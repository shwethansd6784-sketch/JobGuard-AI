import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User, ScamReport, JobAnalysis
from app.auth import get_password_hash

# Routers
from app.routers import auth, job_analyzer, scanner, offer_letter, recruiter_intel, trends, reports, admin

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent Fake Job & Internship Detection System API"
)

# CORS setup for Frontend and Browser Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows web frontend (localhost:5173) and Chrome extension
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(job_analyzer.router, prefix=settings.API_PREFIX)
app.include_router(scanner.router, prefix=settings.API_PREFIX)
app.include_router(offer_letter.router, prefix=settings.API_PREFIX)
app.include_router(recruiter_intel.router, prefix=settings.API_PREFIX)
app.include_router(trends.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "connected"
    }

@app.on_event("startup")
def seed_initial_data_if_empty():
    db = SessionLocal()
    try:
        # Seed default Admin and Demo user if none exist
        if db.query(User).count() == 0:
            admin_user = User(
                email="admin@jobguard.ai",
                hashed_password=get_password_hash("AdminPass123!"),
                full_name="JobGuard Security Admin",
                role="admin"
            )
            demo_user = User(
                email="student@university.edu",
                hashed_password=get_password_hash("StudentPass123!"),
                full_name="Aarav Sharma",
                role="user"
            )
            db.add(admin_user)
            db.add(demo_user)
            db.commit()
            print("[JobGuard Startup] Seeded default admin and demo user.")

        # Seed sample verified community reports if none exist
        if db.query(ScamReport).count() == 0:
            sample_reports = [
                ScamReport(
                    title="Demanded ₹2,500 Registration Fee for Data Entry Job",
                    company_name="Apex Global Data Services",
                    scam_type="registration_fee",
                    contact_phone="+91-9876543210",
                    contact_email="careers.apex.data.verify@gmail.com",
                    website_url="http://apex-data-jobs.xyz",
                    demanded_amount="₹2,500",
                    description="Offered ₹4,000 per day for typing captchas. Asked for refundable registration fee before providing login credentials. Once UPI payment was sent, recruiter blocked me on WhatsApp.",
                    status="verified",
                    upvotes=18
                ),
                ScamReport(
                    title="Telegram VIP Hotel Review Task Scam",
                    company_name="TripAdvisor / Agoda Alliance Group",
                    scam_type="task_scam",
                    contact_phone="+91-9876543210", # Intentionally matching phone for Syndicate Intel demonstration!
                    contact_email="mentor.pooja.vip@gmail.com",
                    website_url="https://t.me/VIP_Hotel_Review_Tasks",
                    demanded_amount="₹5,000 to ₹50,000",
                    description="Recruiter contacted via WhatsApp offering ₹150 per Google review. After paying small ₹500 task fee, they showed fake profits on a dashboard and asked for ₹20,000 recharge to withdraw funds.",
                    status="verified",
                    upvotes=34
                ),
                ScamReport(
                    title="Fake TCS Remote Internship Offer with Laptop Insurance Demand",
                    company_name="Tata Consultancy Services (Impersonation)",
                    scam_type="impersonation",
                    contact_phone="+91-8765432109",
                    contact_email="tcs.internship.onboarding@gmail.com",
                    website_url="http://tcs-careers-portal.top",
                    demanded_amount="₹4,999",
                    description="Received an official-looking offer letter for Python Internship. They requested ₹4,999 courier insurance for company laptop dispatch. TCS officially never asks candidates for money.",
                    status="verified",
                    upvotes=27
                ),
                ScamReport(
                    title="Airport Ground Staff Direct Selection Fee Scam",
                    company_name="Indira Gandhi Aviation Careers",
                    scam_type="fake_offer",
                    contact_phone="+91-9876543210", # Same syndicate phone!
                    contact_email="aviation.selection.delhi@gmail.com",
                    website_url="http://igi-recruitment-pass.icu",
                    demanded_amount="₹3,500",
                    description="Guaranteed placement as ground staff without interview. Demanded ₹3,500 for uniform and airport security gate pass.",
                    status="verified",
                    upvotes=15
                )
            ]
            for r in sample_reports:
                db.add(r)
            db.commit()
            print("[JobGuard Startup] Seeded realistic community scam reports.")

        # Seed sample Job Analyses for baseline trends
        if db.query(JobAnalysis).count() == 0:
            sample_jobs = [
                JobAnalysis(
                    job_title="Data Entry Assistant - Daily Payout",
                    company_name="Apex Global Data Services",
                    job_description="Work 1 hour daily, earn ₹3000. Registration fee of ₹1500 required before receiving tasks.",
                    salary_offered="₹90,000 / month",
                    recruiter_phone="+91-9876543210",
                    recruiter_email="careers.apex.data.verify@gmail.com",
                    risk_score=94.5,
                    risk_category="CRITICAL",
                    ml_confidence=0.98,
                    detected_language="English",
                    suspicious_indicators=json.dumps(["Monetary demand detected (registration fee)", "Free webmail used for corporate hiring", "Unrealistic salary promised"]),
                    positive_indicators=json.dumps([]),
                    score_breakdown=json.dumps({"ml_linguistic_risk": 95, "suspicious_keywords_risk": 90, "payment_demand_risk": 95, "recruiter_contact_risk": 90, "historical_threat_match": 100, "domain_consistency_risk": 80}),
                    explanation="Critical Risk: Listing explicitly demands upfront registration fee and shares contact info with reported scams.",
                    safety_recommendations=json.dumps(["Never pay registration fees", "Report to cybercrime.gov.in"])
                ),
                JobAnalysis(
                    job_title="Software Engineer - React/Node",
                    company_name="TechNova Systems",
                    job_description="Seeking a full-stack engineer with 2+ years of experience in React and Node.js. Competitive compensation and health benefits.",
                    salary_offered="₹12 - 16 LPA",
                    recruiter_email="careers@technova-systems.com",
                    risk_score=12.0,
                    risk_category="LOW",
                    ml_confidence=0.92,
                    detected_language="English",
                    suspicious_indicators=json.dumps([]),
                    positive_indicators=json.dumps(["Official corporate domain used", "Realistic compensation", "No fee demands identified"]),
                    score_breakdown=json.dumps({"ml_linguistic_risk": 10, "suspicious_keywords_risk": 0, "payment_demand_risk": 0, "recruiter_contact_risk": 10, "historical_threat_match": 0, "domain_consistency_risk": 5}),
                    explanation="Low Risk: Standard professional job posting matching genuine employment patterns.",
                    safety_recommendations=json.dumps(["Apply directly via company careers portal"])
                )
            ]
            for j in sample_jobs:
                db.add(j)
            db.commit()
            print("[JobGuard Startup] Seeded sample job analyses.")

    except Exception as e:
        print(f"[JobGuard Startup Error]: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
