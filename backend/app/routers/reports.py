from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScamReport, User
from app.schemas import ScamReportCreate, ScamReportOut
from app.auth import get_optional_current_user

router = APIRouter(prefix="/reports", tags=["Community Scam Reports"])

@router.post("/", response_model=ScamReportOut)
def submit_scam_report(
    report_in: ScamReportCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    new_report = ScamReport(
        user_id=current_user.id if current_user else None,
        title=report_in.title,
        company_name=report_in.company_name,
        scam_type=report_in.scam_type,
        contact_phone=report_in.contact_phone,
        contact_email=report_in.contact_email,
        website_url=report_in.website_url,
        demanded_amount=report_in.demanded_amount,
        description=report_in.description,
        evidence_snippet=report_in.evidence_snippet,
        status="verified"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/", response_model=List[ScamReportOut])
def list_scam_reports(
    scam_type: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(ScamReport)
    if scam_type and scam_type != "all":
        q = q.filter(ScamReport.scam_type.ilike(f"%{scam_type}%"))
    if query:
        q = q.filter(
            (ScamReport.title.ilike(f"%{query}%")) |
            (ScamReport.company_name.ilike(f"%{query}%")) |
            (ScamReport.description.ilike(f"%{query}%"))
        )
    return q.order_by(ScamReport.created_at.desc()).limit(limit).all()

@router.post("/{report_id}/upvote")
def upvote_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(ScamReport).filter(ScamReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    report.upvotes += 1
    db.commit()
    return {"id": report.id, "upvotes": report.upvotes}
