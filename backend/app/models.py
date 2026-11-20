import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="user") # "user" or "admin"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analyses = relationship("JobAnalysis", back_populates="user")
    reports = relationship("ScamReport", back_populates="user")
    documents = relationship("UploadedDocument", back_populates="user")


class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)
    salary_offered = Column(String(100), nullable=True)
    job_location = Column(String(100), nullable=True)
    recruiter_email = Column(String(255), nullable=True, index=True)
    recruiter_phone = Column(String(100), nullable=True, index=True)
    company_website = Column(String(255), nullable=True)
    job_url = Column(String(500), nullable=True)

    # Risk Metrics
    risk_score = Column(Float, nullable=False) # 0 to 100
    risk_category = Column(String(50), nullable=False) # low, medium, high, critical
    ml_confidence = Column(Float, default=0.0)
    detected_language = Column(String(50), default="en")

    # Detailed Explainability JSON strings
    suspicious_indicators = Column(Text, default="[]") # JSON list of strings
    positive_indicators = Column(Text, default="[]") # JSON list of strings
    score_breakdown = Column(Text, default="{}") # JSON dict
    explanation = Column(Text, nullable=False)
    safety_recommendations = Column(Text, default="[]") # JSON list of strings

    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="analyses")


class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    scam_type = Column(String(100), nullable=False) # task_scam, registration_fee, fake_offer, impersonation
    contact_phone = Column(String(100), nullable=True, index=True)
    contact_email = Column(String(255), nullable=True, index=True)
    website_url = Column(String(255), nullable=True)
    demanded_amount = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    evidence_snippet = Column(Text, nullable=True)
    status = Column(String(50), default="verified") # verified, under_review, rejected
    upvotes = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")


class RecruiterEntity(Base):
    __tablename__ = "recruiter_entities"

    id = Column(Integer, primary_key=True, index=True)
    identifier_type = Column(String(50), nullable=False) # email, phone, domain
    identifier_value = Column(String(255), nullable=False, unique=True, index=True)
    associated_companies = Column(Text, default="[]") # JSON list
    associated_reports_count = Column(Integer, default=1)
    risk_rating = Column(String(50), default="suspicious") # suspicious, flagged, neutral
    first_reported = Column(DateTime, default=datetime.datetime.utcnow)
    last_reported = Column(DateTime, default=datetime.datetime.utcnow)
    evidence_notes = Column(Text, nullable=True)


class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    doc_type = Column(String(50), nullable=False) # offer_letter, whatsapp_screenshot, job_flyer
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    extracted_text = Column(Text, nullable=True)
    risk_score = Column(Float, default=0.0)
    risk_category = Column(String(50), default="low")
    findings = Column(Text, default="[]") # JSON findings
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="documents")
