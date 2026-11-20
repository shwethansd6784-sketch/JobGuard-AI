import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobAnalysis, User
from app.schemas import JobAnalyzeRequest, JobAnalyzeResponse, ScoreBreakdown
from app.services.explainability import explainability_engine
from app.auth import get_optional_current_user, get_current_user

router = APIRouter(prefix="/analyze", tags=["Job Analysis Engine"])

@router.post("/job", response_model=JobAnalyzeResponse)
def analyze_job_posting(
    req: JobAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    # Run explainable multi-factor analysis
    analysis_res = explainability_engine.analyze_job(req.dict(), db)

    # Persist in Database
    new_analysis = JobAnalysis(
        user_id=current_user.id if current_user else None,
        job_title=req.job_title,
        company_name=req.company_name,
        job_description=req.job_description,
        salary_offered=req.salary_offered,
        job_location=req.job_location,
        recruiter_email=req.recruiter_email,
        recruiter_phone=req.recruiter_phone,
        company_website=req.company_website,
        job_url=req.job_url,
        risk_score=analysis_res["risk_score"],
        risk_category=analysis_res["risk_category"],
        ml_confidence=analysis_res["ml_confidence"],
        detected_language=analysis_res["detected_language"],
        suspicious_indicators=json.dumps(analysis_res["suspicious_indicators"]),
        positive_indicators=json.dumps(analysis_res["positive_indicators"]),
        score_breakdown=json.dumps(analysis_res["score_breakdown"]),
        explanation=analysis_res["explanation"],
        safety_recommendations=json.dumps(analysis_res["safety_recommendations"])
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return JobAnalyzeResponse(
        id=new_analysis.id,
        job_title=new_analysis.job_title,
        company_name=new_analysis.company_name or "Undisclosed",
        risk_score=new_analysis.risk_score,
        risk_category=new_analysis.risk_category,
        ml_confidence=new_analysis.ml_confidence,
        detected_language=new_analysis.detected_language,
        suspicious_indicators=analysis_res["suspicious_indicators"],
        positive_indicators=analysis_res["positive_indicators"],
        score_breakdown=ScoreBreakdown(**analysis_res["score_breakdown"]),
        explanation=new_analysis.explanation,
        safety_recommendations=analysis_res["safety_recommendations"],
        recruiter_verification_status=analysis_res["recruiter_verification_status"],
        company_verification_status=analysis_res["company_verification_status"],
        created_at=new_analysis.created_at
    )

@router.get("/history", response_model=List[JobAnalyzeResponse])
def get_user_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only return analyses owned by the authenticated user
    records = db.query(JobAnalysis).filter(
        JobAnalysis.user_id == current_user.id
    ).order_by(JobAnalysis.created_at.desc()).limit(100).all()

    res = []
    for r in records:
        try:
            susp = json.loads(r.suspicious_indicators or "[]")
            pos = json.loads(r.positive_indicators or "[]")
            breakdown = json.loads(r.score_breakdown or "{}")
            recs = json.loads(r.safety_recommendations or "[]")
        except Exception:
            susp, pos, breakdown, recs = [], [], {}, []

        res.append(JobAnalyzeResponse(
            id=r.id,
            job_title=r.job_title,
            company_name=r.company_name or "Undisclosed",
            risk_score=r.risk_score,
            risk_category=r.risk_category,
            ml_confidence=r.ml_confidence or 0.0,
            detected_language=r.detected_language or "English",
            suspicious_indicators=susp,
            positive_indicators=pos,
            score_breakdown=ScoreBreakdown(
                ml_linguistic_risk=breakdown.get("ml_linguistic_risk", 0.0),
                suspicious_keywords_risk=breakdown.get("suspicious_keywords_risk", 0.0),
                payment_demand_risk=breakdown.get("payment_demand_risk", 0.0),
                recruiter_contact_risk=breakdown.get("recruiter_contact_risk", 0.0),
                historical_threat_match=breakdown.get("historical_threat_match", 0.0),
                domain_consistency_risk=breakdown.get("domain_consistency_risk", 0.0)
            ),
            explanation=r.explanation,
            safety_recommendations=recs,
            recruiter_verification_status="Complete",
            company_verification_status="Standard Profile",
            created_at=r.created_at
        ))
    return res

@router.get("/{analysis_id}", response_model=JobAnalyzeResponse)
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    r = db.query(JobAnalysis).filter(JobAnalysis.id == analysis_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    try:
        susp = json.loads(r.suspicious_indicators or "[]")
        pos = json.loads(r.positive_indicators or "[]")
        breakdown = json.loads(r.score_breakdown or "{}")
        recs = json.loads(r.safety_recommendations or "[]")
    except Exception:
        susp, pos, breakdown, recs = [], [], {}, []

    return JobAnalyzeResponse(
        id=r.id,
        job_title=r.job_title,
        company_name=r.company_name or "Undisclosed",
        risk_score=r.risk_score,
        risk_category=r.risk_category,
        ml_confidence=r.ml_confidence or 0.0,
        detected_language=r.detected_language or "English",
        suspicious_indicators=susp,
        positive_indicators=pos,
        score_breakdown=ScoreBreakdown(
            ml_linguistic_risk=breakdown.get("ml_linguistic_risk", 0.0),
            suspicious_keywords_risk=breakdown.get("suspicious_keywords_risk", 0.0),
            payment_demand_risk=breakdown.get("payment_demand_risk", 0.0),
            recruiter_contact_risk=breakdown.get("recruiter_contact_risk", 0.0),
            historical_threat_match=breakdown.get("historical_threat_match", 0.0),
            domain_consistency_risk=breakdown.get("domain_consistency_risk", 0.0)
        ),
        explanation=r.explanation,
        safety_recommendations=recs,
        recruiter_verification_status="Verified against local database",
        company_verification_status="Standard Evaluation",
        created_at=r.created_at
    )
