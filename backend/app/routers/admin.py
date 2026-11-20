import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, JobAnalysis, ScamReport
from app.auth import require_admin
from app.config import settings

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats")
def get_admin_dashboard_stats(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    total_users = db.query(User).count()
    total_analyses = db.query(JobAnalysis).count()
    critical_jobs = db.query(JobAnalysis).filter(
        JobAnalysis.risk_category.in_(["critical", "CRITICAL"])
    ).count()
    high_jobs = db.query(JobAnalysis).filter(
        JobAnalysis.risk_category.in_(["high", "HIGH"])
    ).count()
    total_reports = db.query(ScamReport).count()

    # Load ML metrics
    metrics_path = os.path.join(settings.MODEL_DIR, "metrics.json")
    if not os.path.exists(metrics_path):
        metrics_path = os.path.join(os.getcwd(), "ml", "model_artifacts", "metrics.json")
    
    ml_metrics = {}
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, "r") as f:
                ml_metrics = json.load(f)
        except Exception as e:
            ml_metrics = {"error": str(e)}

    # Recent flagged jobs
    recent_flagged = db.query(JobAnalysis).filter(
        JobAnalysis.risk_category.in_(["high", "critical", "HIGH", "CRITICAL"])
    ).order_by(JobAnalysis.created_at.desc()).limit(10).all()

    flagged_list = [
        {
            "id": j.id,
            "title": j.job_title,
            "company": j.company_name,
            "score": j.risk_score,
            "category": j.risk_category,
            "language": j.detected_language,
            "date": j.created_at.isoformat() if j.created_at else None
        }
        for j in recent_flagged
    ]

    return {
        "admin_email": admin_user.email,
        "total_users": total_users,
        "total_analyses": total_analyses,
        "high_risk_flagged": high_jobs + critical_jobs,
        "community_reports": total_reports,
        "ml_model_metrics": ml_metrics,
        "recent_flagged_listings": flagged_list
    }

@router.post("/retrain")
def trigger_retraining(
    admin_user: User = Depends(require_admin)
):
    try:
        from ml.train_model import train_and_evaluate
        metrics = train_and_evaluate()
        return {"status": "success", "message": "ML model pipeline successfully retrained", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
