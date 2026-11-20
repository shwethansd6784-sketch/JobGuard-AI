import os
import re
from typing import Dict, Any, List, Optional
from pypdf import PdfReader
from PIL import Image

try:
    import pytesseract
except ImportError:
    pytesseract = None

class DocumentIntelligenceService:
    def __init__(self):
        # Suspicious clauses commonly found in fraudulent offer letters
        self.suspicious_clauses_patterns = [
            (r'registration\s+fee|refundable\s+deposit|security\s+deposit', "Security Deposit or Registration Fee Demand"),
            (r'laptop\s+charges|courier\s+charges|dispatch\s+insurance', "Equipment Courier / Laptop Fee Demand"),
            (r'training\s+cost|documentation\s+fee|verification\s+charge', "Training or Documentation Cost Clause"),
            (r'gate\s+pass|uniform\s+charge|id\s+card\s+fee', "Uniform or Gate Pass Processing Charge"),
            (r'stamp\s+duty|agreement\s+notary\s+fee', "Legal Stamp Duty / Agreement Notary Fee Demand"),
            (r'pay\s+via\s+upi|google\s+pay|phonepe|paytm', "Personal UPI / Digital Wallet Payment Demand"),
            (r'forfeit.*if\s+not\s+paid\s+within\s+\d+\s+hours', "Urgent Threat of Job Forfeiture within Artificial Deadline")
        ]

    def extract_text_from_pdf(self, file_path: str) -> str:
        extracted = []
        try:
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted.append(text)
        except Exception as e:
            print(f"[DocumentIntelligence] PDF text extraction error: {e}")
        return "\n".join(extracted)

    def extract_text_from_image(self, file_path: str) -> str:
        text = ""
        # 1. Try pytesseract if available and configured
        if pytesseract is not None:
            try:
                img = Image.open(file_path)
                text = pytesseract.image_to_string(img)
                if text.strip():
                    return text
            except Exception as e:
                print(f"[DocumentIntelligence] Tesseract OCR note: {e}")

        # 2. Fallback heuristic inspection of image text if OCR engine binary is not installed on OS
        return text

    def analyze_offer_letter(self, text: str, declared_company: str = "") -> Dict[str, Any]:
        """
        Extracts key entities, checks domain consistency, and verifies
        against known fraudulent offer letter patterns.
        """
        # 1. Entity Extraction
        emails = list(set(re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)))
        phones = list(set(re.findall(r'(?:\+91[-\s]?|91[-\s]?|0)?[6-9]\d{9}', text)))
        
        # Salary patterns (e.g. ₹6,00,000 PA, 4.5 LPA, $80,000/year, Rs. 50,000 per month)
        salary_match = re.search(r'(?:₹|rs\.?|inr|\$)\s*[\d,]+(?:\s*(?:lpa|per\s+annum|p\.a\.|monthly|per\s+month|\/-))?', text, re.IGNORECASE)
        salary_str = salary_match.group(0) if salary_match else "Not explicitly stated"

        # Role pattern
        role_match = re.search(r'(?:position|designation|role|post)\s*(?:of|as|:|-)?\s*([A-Za-z\s]{4,35})', text, re.IGNORECASE)
        role_str = role_match.group(1).strip() if role_match else "Candidate Appointment"

        # Company extraction
        company_match = re.search(r'(?:at|with|join|welcome to)\s+([A-Z][A-Za-z0-9\s&]{2,30}(?:Pvt\.?\s*Ltd\.?|Limited|Corporation|Inc\.?|LLC|Technologies|Solutions|Services)?)', text)
        extracted_company = company_match.group(1).strip() if company_match else declared_company

        # 2. Check Suspicious Clauses
        flagged_clauses = []
        has_payment_clause = False

        for pattern, label in self.suspicious_clauses_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                flagged_clauses.append(label)
                has_payment_clause = True

        # 3. Domain Mismatch & Free Webmail Check
        domain_mismatch_warning = None
        free_webmails = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "rediffmail.com", "proton.me", "yopmail.com"]
        
        for em in emails:
            domain = em.split("@")[-1].lower()
            if domain in free_webmails:
                domain_mismatch_warning = f"High Risk: Official offer letter uses a free consumer email address ('{em}'). Legitimate corporate HR departments never issue offers from public webmail."
                break
            elif declared_company and len(declared_company) > 3:
                clean_comp = re.sub(r'[^a-z0-9]', '', declared_company.lower())
                clean_domain = re.sub(r'[^a-z0-9]', '', domain.split(".")[0])
                if clean_domain not in clean_comp and clean_comp not in clean_domain:
                    domain_mismatch_warning = f"Domain Inconsistency: Recruiter email '{em}' does not match company name '{declared_company}'."

        # 4. Calculate Risk Score
        risk_score = 15.0 # baseline verification caution
        if has_payment_clause:
            risk_score += 55.0
        if domain_mismatch_warning:
            risk_score += 25.0
        if len(flagged_clauses) >= 2:
            risk_score += 15.0

        risk_score = min(round(risk_score, 1), 99.0)

        # Risk category
        if risk_score < 30:
            category = "LOW"
        elif risk_score < 60:
            category = "MEDIUM"
        elif risk_score < 80:
            category = "HIGH"
        else:
            category = "CRITICAL"

        # Explanation synthesis
        explanation_parts = []
        if has_payment_clause:
            explanation_parts.append(f"Demands monetary payment for {', '.join(flagged_clauses)}.")
        if domain_mismatch_warning:
            explanation_parts.append(domain_mismatch_warning)
        if not explanation_parts:
            explanation_parts.append("Document does not contain overt payment demands, but always verify company registration on MCA / LinkedIn.")

        # Safety Advisories
        advisories = [
            "Never pay any security deposit, laptop fee, or training fee for an offer letter.",
            "Genuine employers provide company equipment and do not demand courier or insurance fees.",
            "Verify the recruiter's identity on LinkedIn and check the company's official careers portal.",
            "If asked to transfer funds via UPI or cryptocurrency, immediately report to cybercrime.gov.in."
        ]

        # Checklist status
        checklist = {
            "No Upfront Fees Demanded": not has_payment_clause,
            "Official Corporate Domain Used": domain_mismatch_warning is None,
            "Clear Compensation Details": salary_str != "Not explicitly stated",
            "Valid Contact Information Present": len(emails) > 0 or len(phones) > 0
        }

        return {
            "extracted_company": extracted_company or "Unknown Company",
            "extracted_candidate_role": role_str,
            "extracted_salary": salary_str,
            "extracted_contacts": {"emails": emails, "phones": phones},
            "risk_score": risk_score,
            "risk_category": category,
            "has_payment_clause": has_payment_clause,
            "suspicious_clauses": flagged_clauses,
            "domain_mismatch_warning": domain_mismatch_warning,
            "explanation": " ".join(explanation_parts),
            "checklist_status": checklist,
            "safety_advisory": advisories
        }

doc_intelligence = DocumentIntelligenceService()
