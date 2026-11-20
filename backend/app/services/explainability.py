import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.services.ml_service import ml_service
from app.services.multilingual import multilingual_detector
from app.models import ScamReport, RecruiterEntity

class ExplainabilityEngine:
    def analyze_job(self, job_data: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """
        Calculates a multi-factor transparent risk score based on 7 weighted components:
        1. ML Prediction (25%)
        2. Suspicious Keyword Analysis (20%)
        3. Recruiter & Company Checks (15%)
        4. Contact Detail Consistency (15%)
        5. Payment-Request Detection (15%)
        6. Previous Verified Reports (5%)
        7. Website & Domain Checks (5%)
        """
        job_title = job_data.get("job_title", "")
        company_name = job_data.get("company_name", "")
        job_description = job_data.get("job_description", "")
        salary = job_data.get("salary_offered", "")
        recruiter_email = job_data.get("recruiter_email", "") or ""
        recruiter_phone = job_data.get("recruiter_phone", "") or ""
        company_website = job_data.get("company_website", "") or ""
        job_url = job_data.get("job_url", "") or ""

        combined_text = f"{job_title} {company_name} {job_description} {salary}"

        suspicious_indicators: List[str] = []
        positive_indicators: List[str] = []

        # 1. ML Prediction (Weight: 25%)
        ml_score, ml_confidence, ml_features = ml_service.predict_risk(combined_text)
        if ml_score > 60:
            suspicious_indicators.append(f"AI Model detected high similarity with known scam listings (Confidence: {int(ml_confidence*100)}%).")
        elif ml_score < 25:
            positive_indicators.append("AI Model text patterns align with standard professional job descriptions.")

        # 2. Suspicious Keyword Analysis (Weight: 20%)
        keyword_result = multilingual_detector.analyze_scam_signals(combined_text)
        keyword_score = keyword_result["keyword_risk"]
        detected_language = keyword_result["detected_language"]
        for p in keyword_result["flagged_phrases"][:4]:
            suspicious_indicators.append(f"Flagged phrase detected: '{p}'")

        # 3. Payment-Request Detection (Weight: 15%)
        payment_score = 0.0
        if keyword_result["has_monetary_demand"]:
            payment_score = 95.0
            suspicious_indicators.append("Critical: Monetary demand detected (registration, training, or deposit fee requested).")
        else:
            positive_indicators.append("No upfront payment or fee demands identified in the listing.")

        # 4. Contact Detail Consistency (Weight: 15%)
        contact_score = 10.0 # baseline
        free_domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com", "yopmail.com"]
        
        if recruiter_email:
            em_domain = recruiter_email.split("@")[-1].lower() if "@" in recruiter_email else ""
            if em_domain in free_domains:
                contact_score += 45.0
                suspicious_indicators.append(f"Recruiter uses free personal webmail ({em_domain}) rather than corporate domain.")
            elif company_name and len(company_name) > 3:
                clean_c = re.sub(r'[^a-z0-9]', '', company_name.lower())
                clean_d = re.sub(r'[^a-z0-9]', '', em_domain.split('.')[0])
                if clean_d in clean_c or clean_c in clean_d:
                    positive_indicators.append(f"Recruiter email domain matches company brand (@{em_domain}).")
                    contact_score = max(0.0, contact_score - 10.0)
                else:
                    contact_score += 25.0
                    suspicious_indicators.append(f"Recruiter email domain (@{em_domain}) does not match company name '{company_name}'.")

        # Check for WhatsApp/Telegram only communication
        if "whatsapp only" in combined_text.lower() or "telegram" in combined_text.lower():
            contact_score += 35.0
            suspicious_indicators.append("Listing restricts communication exclusively to WhatsApp or Telegram.")

        contact_score = min(contact_score, 100.0)

        # 5. Recruiter & Company Checks (Weight: 15%)
        recruiter_score = 15.0 # default neutral
        company_status = "Unverified Organization"
        recruiter_status = "Standard Verification Incomplete"

        if company_name and len(company_name.strip()) > 2:
            # Check for known high-profile companies
            trusted_corps = ["google", "microsoft", "amazon", "tata consultancy", "tcs", "infosys", "wipro", "ibm", "accenture"]
            if any(t in company_name.lower() for t in trusted_corps):
                company_status = "Recognized Major Enterprise"
                # But if using gmail, trigger impersonation alert!
                if recruiter_email and any(f in recruiter_email.lower() for f in free_domains):
                    recruiter_score = 90.0
                    company_status = "⚠️ Brand Impersonation Alert"
                    suspicious_indicators.append(f"Impersonation Risk: Claims to represent {company_name} but communicates via free {recruiter_email}.")
                else:
                    positive_indicators.append(f"Company name corresponds to recognized employer ({company_name}).")
                    recruiter_score = 10.0
            else:
                positive_indicators.append("Specified organization name provided.")
        else:
            recruiter_score += 30.0
            suspicious_indicators.append("Undisclosed or missing employer/organization identity.")

        # 6. Previous Verified Reports (Weight: 5%)
        history_score = 0.0
        reported_matches = 0
        from sqlalchemy import or_
        filters = []
        if recruiter_phone:
            filters.append(ScamReport.contact_phone == recruiter_phone)
        if recruiter_email:
            filters.append(ScamReport.contact_email == recruiter_email)

        if filters:
            matches = db.query(ScamReport).filter(or_(*filters)).count()
            if matches > 0:
                reported_matches = matches
                history_score = 100.0
                suspicious_indicators.append(f"Intelligence Match: Contact details have {matches} prior community scam report(s).")
            else:
                positive_indicators.append("No prior fraud reports associated with these contact details.")

        # 7. Website & Domain Checks (Weight: 5%)
        domain_score = 10.0
        suspicious_tlds = [".xyz", ".top", ".buzz", ".icu", ".work", ".tk", ".ml", ".cf", ".link"]
        if company_website:
            if any(company_website.lower().endswith(tld) or (tld + "/") in company_website.lower() for tld in suspicious_tlds):
                domain_score = 80.0
                suspicious_indicators.append(f"Company website uses suspicious or disposable top-level domain ({company_website}).")
            elif company_website.startswith("https://"):
                positive_indicators.append("Company website uses valid TLS (HTTPS) security.")
                domain_score = 5.0
        elif job_url:
            if any(tld in job_url.lower() for tld in suspicious_tlds):
                domain_score = 75.0
                suspicious_indicators.append("Job application link hosted on low-reputation domain extension.")

        # Weighted Aggregate Calculation
        # Weights: ML 25%, Keyword 20%, Recruiter 15%, Contact 15%, Payment 15%, History 5%, Domain 5%
        overall_risk = (
            (ml_score * 0.25) +
            (keyword_score * 0.20) +
            (recruiter_score * 0.15) +
            (contact_score * 0.15) +
            (payment_score * 0.15) +
            (history_score * 0.05) +
            (domain_score * 0.05)
        )

        overall_risk = round(min(max(overall_risk, 2.0), 98.0), 1)

        # Risk Category
        if overall_risk < 28.0:
            category = "LOW"
        elif overall_risk < 55.0:
            category = "MEDIUM"
        elif overall_risk < 78.0:
            category = "HIGH"
        else:
            category = "CRITICAL"

        # Plain-English Explanation
        explanation = self.generate_explanation(overall_risk, category, suspicious_indicators, positive_indicators)

        # Recommended Safety Actions
        recommendations = self.generate_recommendations(overall_risk, keyword_result["has_monetary_demand"])

        return {
            "risk_score": overall_risk,
            "risk_category": category,
            "ml_confidence": ml_confidence,
            "detected_language": detected_language,
            "suspicious_indicators": suspicious_indicators,
            "positive_indicators": positive_indicators,
            "score_breakdown": {
                "ml_linguistic_risk": round(ml_score, 1),
                "suspicious_keywords_risk": round(keyword_score, 1),
                "payment_demand_risk": round(payment_score, 1),
                "recruiter_contact_risk": round(contact_score, 1),
                "historical_threat_match": round(history_score, 1),
                "domain_consistency_risk": round(domain_score, 1)
            },
            "explanation": explanation,
            "safety_recommendations": recommendations,
            "recruiter_verification_status": recruiter_status,
            "company_verification_status": company_status
        }

    def generate_explanation(self, score: float, category: str, suspicious: List[str], positive: List[str]) -> str:
        disclaimer = "Note: A risk score represents an automated probabilistic threat evaluation and is not legal proof of fraud."
        if category == "CRITICAL":
            reason = "This posting displays severe hallmarks of employment fraud, including upfront monetary demands, suspicious communication channels, or impersonation tactics."
        elif category == "HIGH":
            reason = "Multiple high-risk indicators were detected, such as mismatched contact domains, unrealistic earnings, or unverified hiring channels."
        elif category == "MEDIUM":
            reason = "Some cautionary signals are present (e.g., informal communication channels or lack of corporate email verification), requiring diligence."
        else:
            reason = "The job posting exhibits language and contact patterns consistent with genuine employment opportunities."
        
        return f"{reason} {disclaimer}"

    def generate_recommendations(self, score: float, has_monetary: bool) -> List[str]:
        recs = [
            "Never pay any money for job application, security deposit, laptop fee, or training.",
            "Verify the company on its official career portal (e.g. company.com/careers) before submitting sensitive documents.",
            "Contact the official HR department via switchboard or LinkedIn to verify the recruiter's identity."
        ]
        if has_monetary:
            recs.insert(0, "DO NOT TRANSFER FUNDS: Legitimate employers never ask candidates to pay for employment or equipment.")
        if score > 60:
            recs.append("If contacted on WhatsApp or Telegram by unknown recruiters, block the sender and file a report on cybercrime.gov.in.")
        return recs

explainability_engine = ExplainabilityEngine()
