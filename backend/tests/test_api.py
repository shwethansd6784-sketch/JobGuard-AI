import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app"] == "JobGuard AI"

def test_analyze_genuine_job():
    payload = {
        "job_title": "Senior Frontend Engineer (React/TypeScript)",
        "company_name": "CloudScale Systems",
        "job_description": "We are seeking a Frontend Engineer with 5+ years of experience in React, TypeScript, and modern state management. Competitive compensation and health insurance provided.",
        "salary_offered": "₹18 - 24 LPA",
        "job_location": "Bengaluru (Hybrid)",
        "recruiter_email": "careers@cloudscale-systems.com",
        "company_website": "https://cloudscale-systems.com"
    }
    response = client.post("/api/analyze/job", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] < 40.0
    assert data["risk_category"] in ["LOW", "MEDIUM"]
    assert len(data["positive_indicators"]) > 0

def test_analyze_scam_job():
    payload = {
        "job_title": "Online Typing & Captcha Work - Earn ₹5000 Daily",
        "company_name": "Apex Global Data",
        "job_description": "Work 1 hour daily, earn ₹5000 daily. Direct selection without interview. Registration fee of ₹1,499 required for portal access. Contact Pooja on WhatsApp.",
        "salary_offered": "₹5000 / day",
        "recruiter_phone": "+91-9876543210",
        "recruiter_email": "pooja.data.jobs@gmail.com",
        "company_website": "http://apex-jobs.xyz"
    }
    response = client.post("/api/analyze/job", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] >= 50.0
    assert data["risk_category"] in ["HIGH", "CRITICAL"]
    assert any("registration fee" in ind.lower() or "monetary demand" in ind.lower() for ind in data["suspicious_indicators"])

def test_multilingual_kannada_detection():
    payload = {
        "job_title": "ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಕೆಲಸ (Data Entry)",
        "company_name": "ಕರ್ನಾಟಕ ಆನ್‌ಲೈನ್ ಉದ್ಯೋಗ",
        "job_description": "ದೈನಂದಿನ ಆದಾಯ 3000. ಯಾವುದೇ ಸಂದರ್ಶನವಿಲ್ಲದೆ ನೇರ ನೇಮಕಾತಿ. ನೋಂದಣಿ ಶುಲ್ಕ 1500 ಪಾವತಿಸಿ.",
        "recruiter_phone": "+91-9876543210"
    }
    response = client.post("/api/analyze/job", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["detected_language"] == "Kannada"
    assert any("ನೋಂದಣಿ ಶುಲ್ಕ" in ind for ind in data["suspicious_indicators"])

def test_recruiter_graph_intelligence():
    response = client.get("/api/recruiter-intel/graph?query=+91-9876543210")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert "warnings" in data
    assert len(data["nodes"]) > 0

def test_scam_trends_dashboard():
    response = client.get("/api/trends/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_analyzed"] >= 1
    assert "top_scam_types" in data
    assert len(data["top_suspicious_phrases"]) > 0

def test_community_reports():
    # List reports
    response = client.get("/api/reports/")
    assert response.status_code == 200
    reports = response.json()
    assert isinstance(reports, list)
    assert len(reports) > 0

    # Upvote report
    first_id = reports[0]["id"]
    upvote_res = client.post(f"/api/reports/{first_id}/upvote")
    assert upvote_res.status_code == 200
    assert upvote_res.json()["upvotes"] >= reports[0]["upvotes"]

def test_scanner_message_endpoint():
    payload = {
        "message_text": "Earn 5000 daily with prepaid task on Telegram @VIP_Task. UPI pay to activate.",
        "source_channel": "WhatsApp"
    }
    response = client.post("/api/scanner/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] > 60
    assert "@VIP_Task" in data["extracted_contacts"]["telegram_handles"] or "VIP_Task" in data["extracted_contacts"]["telegram_handles"]
