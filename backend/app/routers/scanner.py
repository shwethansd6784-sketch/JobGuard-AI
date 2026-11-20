import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas import MessageScanRequest, MessageScanResponse
from app.services.multilingual import multilingual_detector
from app.services.ocr_service import doc_intelligence
from app.models import UploadedDocument, User
from app.auth import get_optional_current_user

router = APIRouter(prefix="/scanner", tags=["Screenshot and Message Scanner"])

@router.post("/message", response_model=MessageScanResponse)
def scan_text_message(req: MessageScanRequest):
    text = req.message_text
    multilingual_res = multilingual_detector.analyze_scam_signals(text)
    contacts = multilingual_detector.extract_contacts(text)

    # Risk score calculation for message
    score = multilingual_res["keyword_risk"]
    if multilingual_res["has_monetary_demand"]:
        score = max(score, 85.0)
    if multilingual_res["has_task_scam"]:
        score = max(score, 75.0)
    if len(contacts["telegram_handles"]) > 0 or len(contacts["upi_ids"]) > 0:
        score = min(score + 15.0, 99.0)

    score = round(max(score, 5.0), 1)

    if score < 30:
        cat = "LOW"
        explanation = "The communication text appears to follow standard introductory or recruiting patterns."
        recom = "Standard diligence advised. Never share OTPs or passwords."
    elif score < 60:
        cat = "MEDIUM"
        explanation = "Cautionary indicators detected. Informal channels or unverified recruiting language present."
        recom = "Request official company email communication and confirm job listing on the company's verified domain."
    elif score < 80:
        cat = "HIGH"
        explanation = "High risk: Suspicious phrases, task compensation patterns, or informal contact channels identified."
        recom = "Do not participate in paid trial tasks or transfer any funds. Do not share identity documents."
    else:
        cat = "CRITICAL"
        explanation = "Severe Threat: Explicit recruitment scam markers detected (e.g. upfront fee demand or task scam)."
        recom = "Immediately cease communication, block the sender, and report to the National Cyber Crime Portal (cybercrime.gov.in)."

    tactics = []
    if multilingual_res["has_monetary_demand"]:
        tactics.append("Upfront Fee / Deposit Demand")
    if multilingual_res["has_task_scam"]:
        tactics.append("Prepaid Telegram/Review Task Scam")
    if "unrealistic" in " ".join(multilingual_res["flagged_phrases"]).lower():
        tactics.append("Unrealistic Guaranteed Earnings")
    if req.source_channel.lower() in ["whatsapp", "telegram"]:
        tactics.append("Informal Instant Messaging Solicitation")

    return MessageScanResponse(
        detected_language=multilingual_res["detected_language"],
        risk_score=score,
        risk_category=cat,
        detected_scam_tactics=tactics if tactics else ["Standard Recruitment Communication"],
        flagged_phrases=multilingual_res["flagged_phrases"],
        extracted_contacts=contacts,
        explanation=explanation,
        recommended_action=recom
    )

@router.post("/screenshot", response_model=MessageScanResponse)
async def scan_screenshot(
    file: UploadFile = File(...),
    source_channel: str = Form("WhatsApp"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".png", ".jpg", ".jpeg", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PNG, JPG, or JPEG image.")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    saved_filename = f"scan_{uuid.uuid4().hex[:12]}{ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(saved_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Perform OCR
    extracted_text = doc_intelligence.extract_text_from_image(saved_path)

    if not extracted_text or len(extracted_text.strip()) < 10:
        # Provide helpful guidance if OCR did not detect characters
        extracted_text = "No clear text could be automatically extracted from this screenshot image. If this is a screenshot of a chat, please paste the message text directly into the Message Scanner for immediate analysis."

    # Run scanning logic
    req = MessageScanRequest(
        message_text=extracted_text,
        source_channel=source_channel
    )
    res = scan_text_message(req)

    # Persist document log
    doc_record = UploadedDocument(
        user_id=current_user.id if current_user else None,
        doc_type="whatsapp_screenshot",
        original_filename=file.filename,
        file_path=saved_path,
        extracted_text=extracted_text[:4000],
        risk_score=res.risk_score,
        risk_category=res.risk_category
    )
    db.add(doc_record)
    db.commit()

    return res
