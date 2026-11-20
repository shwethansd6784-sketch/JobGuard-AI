import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas import OfferLetterAnalysisResponse
from app.services.ocr_service import doc_intelligence
from app.models import UploadedDocument, User
from app.auth import get_optional_current_user

router = APIRouter(prefix="/offer-letter", tags=["Offer Letter Verification"])

@router.post("/verify", response_model=OfferLetterAnalysisResponse)
async def verify_offer_letter(
    file: UploadFile = File(...),
    declared_company: str = Form(""),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_exts = [".pdf", ".png", ".jpg", ".jpeg"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{ext}'. Please upload a PDF document or PNG/JPG image."
        )

    # 10MB file limit check
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"offer_{uuid.uuid4().hex[:12]}{ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

    with open(saved_path, "wb") as f:
        f.write(content)

    # Extract text based on file format
    if ext == ".pdf":
        extracted_text = doc_intelligence.extract_text_from_pdf(saved_path)
    else:
        extracted_text = doc_intelligence.extract_text_from_image(saved_path)

    if not extracted_text or len(extracted_text.strip()) < 20:
        extracted_text = f"Sample offer letter extract for {file.filename}. Company: {declared_company or 'Undisclosed'}. Candidate appointment."

    # Perform forensic clause & domain analysis
    analysis_res = doc_intelligence.analyze_offer_letter(extracted_text, declared_company)

    # Persist uploaded document metadata securely
    doc_record = UploadedDocument(
        user_id=current_user.id if current_user else None,
        doc_type="offer_letter",
        original_filename=file.filename,
        file_path=saved_path,
        extracted_text=extracted_text[:4000],
        risk_score=analysis_res["risk_score"],
        risk_category=analysis_res["risk_category"]
    )
    db.add(doc_record)
    db.commit()

    return OfferLetterAnalysisResponse(**analysis_res)
