import os
import re
import json
from typing import Dict, List, Tuple, Any

class MultilingualScamDetector:
    def __init__(self, keywords_json_path: str = None):
        if keywords_json_path is None:
            keywords_json_path = os.path.join(
                os.path.dirname(__file__), "..", "data", "fraud_keywords.json"
            )
        
        self.keywords = self.load_keywords(keywords_json_path)

    def load_keywords(self, path: str) -> Dict[str, List[str]]:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "monetary_demands": ["registration fee", "security deposit", "training fee"],
            "unrealistic_promises": ["guaranteed placement", "earn daily", "no interview"],
            "task_scam_signals": ["telegram task", "like youtube videos"],
            "suspicious_communication": ["whatsapp only", "telegram @"],
            "hindi_scam_phrases": ["पंजीकरण शुल्क", "घर बैठे कमाएं"],
            "kannada_scam_phrases": ["ನೋಂದಣಿ ಶುಲ್ಕ", "ದೈನಂದಿನ ಆದಾಯ"],
            "hinglish_scam_phrases": ["registration fee dena hoga", "task complete karo"]
        }

    def detect_language(self, text: str) -> str:
        """
        Detects primary script and language characteristics:
        - Devanagari -> Hindi
        - Kannada -> Kannada
        - Latin characters with Hindi/Urdu romanized phonetics -> Hinglish (Mixed)
        - Standard Latin -> English
        """
        if not text:
            return "English"

        devanagari_chars = len(re.findall(r'[\u0900-\u097F]', text))
        kannada_chars = len(re.findall(r'[\u0C80-\u0CFF]', text))
        total_chars = max(len(re.findall(r'\S', text)), 1)

        if kannada_chars / total_chars > 0.15:
            return "Kannada"
        if devanagari_chars / total_chars > 0.15:
            return "Hindi"

        # Check for Hinglish markers
        hinglish_markers = [
            "karo", "karen", "paise", "milega", "hoga", "dena", "ghar baithe",
            "kamao", "kamaaye", "naukri", "bina interview", "shuru kare", "padega"
        ]
        text_lower = text.lower()
        hinglish_hits = sum(1 for m in hinglish_markers if m in text_lower)
        if hinglish_hits >= 2:
            return "Mixed (Hinglish)"

        return "English"

    def extract_contacts(self, text: str) -> Dict[str, List[str]]:
        contacts = {
            "emails": [],
            "phones": [],
            "telegram_handles": [],
            "upi_ids": [],
            "urls": []
        }

        # Email Regex
        emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
        contacts["emails"] = list(set(emails))

        # Indian / International Phone Regex
        phones = re.findall(r'(?:\+91[-\s]?|91[-\s]?|0)?[6-9]\d{9}', text)
        contacts["phones"] = list(set(phones))

        # Telegram handles
        tg = re.findall(r'(?:@|t\.me\/)([a-zA-Z0-9_]{4,32})', text)
        contacts["telegram_handles"] = list(set(tg))

        # UPI Handles
        upis = re.findall(r'[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}', text)
        # Exclude standard emails from UPI list
        upi_clean = [u for u in upis if not u.endswith((".com", ".org", ".net", ".edu", ".gov", ".io"))]
        contacts["upi_ids"] = list(set(upi_clean))

        # URLs
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', text)
        contacts["urls"] = list(set(urls))

        return contacts

    def analyze_scam_signals(self, text: str) -> Dict[str, Any]:
        """
        Identifies suspicious phrases across categories and calculates
        monetary demand and keyword severity.
        """
        text_lower = text.lower()
        detected_lang = self.detect_language(text)

        flagged_categories = {
            "Monetary Demands": [],
            "Unrealistic Promises": [],
            "Task / Review Scam Patterns": [],
            "Suspicious Channels": [],
            "Regional Language Red Flags": []
        }

        # Check English & Universal Patterns
        for phrase in self.keywords.get("monetary_demands", []):
            if phrase in text_lower:
                flagged_categories["Monetary Demands"].append(phrase)

        for phrase in self.keywords.get("unrealistic_promises", []):
            if phrase in text_lower:
                flagged_categories["Unrealistic Promises"].append(phrase)

        for phrase in self.keywords.get("task_scam_signals", []):
            if phrase in text_lower:
                flagged_categories["Task / Review Scam Patterns"].append(phrase)

        for phrase in self.keywords.get("suspicious_communication", []):
            if phrase in text_lower:
                flagged_categories["Suspicious Channels"].append(phrase)

        # Check Hindi
        for phrase in self.keywords.get("hindi_scam_phrases", []):
            if phrase in text:
                flagged_categories["Regional Language Red Flags"].append(f"Hindi: {phrase}")

        # Check Kannada
        for phrase in self.keywords.get("kannada_scam_phrases", []):
            if phrase in text:
                flagged_categories["Regional Language Red Flags"].append(f"Kannada: {phrase}")

        # Check Hinglish
        for phrase in self.keywords.get("hinglish_scam_phrases", []):
            if phrase in text_lower:
                flagged_categories["Regional Language Red Flags"].append(f"Hinglish: {phrase}")

        # Flatten flagged phrases
        all_flagged = []
        for cat, phrases in flagged_categories.items():
            all_flagged.extend(phrases)

        # Calculate keyword risk score (0 to 100)
        has_monetary = len(flagged_categories["Monetary Demands"]) > 0 or "शुल्क" in text or "ಠೇವಣಿ" in text
        has_task_scam = len(flagged_categories["Task / Review Scam Patterns"]) > 0
        has_unrealistic = len(flagged_categories["Unrealistic Promises"]) > 0

        keyword_risk = 0.0
        if has_monetary:
            keyword_risk += 50.0
        if has_task_scam:
            keyword_risk += 30.0
        if has_unrealistic:
            keyword_risk += 20.0
        if len(all_flagged) > 3:
            keyword_risk += 15.0

        keyword_risk = min(keyword_risk, 100.0)

        return {
            "detected_language": detected_lang,
            "flagged_phrases": all_flagged,
            "flagged_categories": flagged_categories,
            "has_monetary_demand": has_monetary,
            "has_task_scam": has_task_scam,
            "keyword_risk": round(keyword_risk, 2)
        }

multilingual_detector = MultilingualScamDetector()
