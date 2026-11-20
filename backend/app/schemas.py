from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Authentication Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# --- Job Analysis Schemas ---
class JobAnalyzeRequest(BaseModel):
    job_title: str
    company_name: Optional[str] = "Undisclosed"
    job_description: str
    salary_offered: Optional[str] = None
    job_location: Optional[str] = "Remote / Unspecified"
    recruiter_email: Optional[str] = None
    recruiter_phone: Optional[str] = None
    company_website: Optional[str] = None
    job_url: Optional[str] = None

class ScoreBreakdown(BaseModel):
    ml_linguistic_risk: float = Field(..., description="Risk derived from ML model NLP vectorizer (0-100)")
    suspicious_keywords_risk: float = Field(..., description="Risk from high-frequency scam phrase matching (0-100)")
    payment_demand_risk: float = Field(..., description="Risk from registration or deposit fees (0-100)")
    recruiter_contact_risk: float = Field(..., description="Risk from free emails, burner numbers, TLDs (0-100)")
    historical_threat_match: float = Field(..., description="Matches with known reported fraudulent entities (0-100)")
    domain_consistency_risk: float = Field(..., description="Mismatch between company domain and recruiter contact (0-100)")

class JobAnalyzeResponse(BaseModel):
    id: Optional[int] = None
    job_title: str
    company_name: str
    risk_score: float # 0 - 100
    risk_category: str # LOW, MEDIUM, HIGH, CRITICAL
    ml_confidence: float
    detected_language: str
    suspicious_indicators: List[str]
    positive_indicators: List[str]
    score_breakdown: ScoreBreakdown
    explanation: str
    safety_recommendations: List[str]
    recruiter_verification_status: str
    company_verification_status: str
    created_at: Optional[datetime] = None


# --- Screenshot & Message Scanner Schemas ---
class MessageScanRequest(BaseModel):
    message_text: str
    source_channel: Optional[str] = "WhatsApp" # WhatsApp, Telegram, SMS, Email
    sender_info: Optional[str] = None

class MessageScanResponse(BaseModel):
    detected_language: str
    risk_score: float
    risk_category: str
    detected_scam_tactics: List[str]
    flagged_phrases: List[str]
    extracted_contacts: Dict[str, List[str]]
    explanation: str
    recommended_action: str


# --- Offer Letter Schemas ---
class OfferLetterAnalysisResponse(BaseModel):
    extracted_company: Optional[str]
    extracted_candidate_role: Optional[str]
    extracted_salary: Optional[str]
    extracted_contacts: Dict[str, List[str]]
    risk_score: float
    risk_category: str
    has_payment_clause: bool
    suspicious_clauses: List[str]
    domain_mismatch_warning: Optional[str]
    explanation: str
    checklist_status: Dict[str, bool]
    safety_advisory: List[str]


# --- Recruiter Intel Schemas ---
class RecruiterIntelQuery(BaseModel):
    query: str # email, phone, domain or company name

class RecruiterThreatDetail(BaseModel):
    identifier: str
    identifier_type: str # phone, email, domain
    risk_rating: str # suspicious, flagged, neutral
    reports_count: int
    associated_companies: List[str]
    first_seen: datetime
    last_seen: datetime
    notes: Optional[str]

class GraphNode(BaseModel):
    id: str
    label: str
    type: str # recruiter, company, phone, email, job
    risk: str # high, medium, low

class GraphEdge(BaseModel):
    source: str
    target: str
    label: str

class RecruiterNetworkGraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    warnings: List[str]


# --- Scam Reports Schemas ---
class ScamReportCreate(BaseModel):
    title: str
    company_name: str
    scam_type: str
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    website_url: Optional[str] = None
    demanded_amount: Optional[str] = None
    description: str
    evidence_snippet: Optional[str] = None

class ScamReportOut(BaseModel):
    id: int
    title: str
    company_name: str
    scam_type: str
    contact_phone: Optional[str]
    contact_email: Optional[str]
    website_url: Optional[str]
    demanded_amount: Optional[str]
    description: str
    evidence_snippet: Optional[str]
    status: str
    upvotes: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Analytics & Dashboard Schemas ---
class EmergingScamPattern(BaseModel):
    phrase: str
    count: int
    scam_category: str
    trend: str # increasing, stable, new

class ScamTrendsResponse(BaseModel):
    total_analyzed: int
    high_risk_count: int
    reports_submitted: int
    top_scam_types: Dict[str, int]
    top_flagged_domains: List[Dict[str, Any]]
    top_suspicious_phrases: List[EmergingScamPattern]
    recent_threat_timeline: List[Dict[str, Any]]
