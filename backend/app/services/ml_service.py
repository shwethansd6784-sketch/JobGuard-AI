import os
import joblib
from typing import Tuple, List, Dict, Any

class MLService:
    def __init__(self, artifacts_dir: str = None):
        if artifacts_dir is None:
            # Check potential locations
            candidates = [
                os.path.join(os.path.dirname(__file__), "..", "..", "ml", "model_artifacts"),
                os.path.join(os.getcwd(), "backend", "ml", "model_artifacts"),
                os.path.join(os.getcwd(), "ml", "model_artifacts"),
            ]
            for c in candidates:
                if os.path.exists(os.path.join(c, "best_classifier.joblib")):
                    artifacts_dir = c
                    break
            if artifacts_dir is None:
                artifacts_dir = candidates[0]

        self.artifacts_dir = artifacts_dir
        self.vectorizer = None
        self.classifier = None
        self.load_models()

    def load_models(self):
        vec_path = os.path.join(self.artifacts_dir, "tfidf_vectorizer.joblib")
        clf_path = os.path.join(self.artifacts_dir, "best_classifier.joblib")
        if os.path.exists(vec_path) and os.path.exists(clf_path):
            try:
                self.vectorizer = joblib.load(vec_path)
                self.classifier = joblib.load(clf_path)
                print(f"[MLService] Loaded ML model successfully from {self.artifacts_dir}")
            except Exception as e:
                print(f"[MLService] Warning loading model: {e}")
        else:
            print(f"[MLService] Model artifacts not found at {self.artifacts_dir}")

    def predict_risk(self, text: str) -> Tuple[float, float, List[str]]:
        """
        Returns:
            ml_risk_score: 0.0 to 100.0
            confidence: 0.0 to 1.0
            top_suspicious_features: List of informative words detected by TF-IDF
        """
        if not text or not text.strip():
            return 10.0, 0.5, []

        if not self.classifier or not self.vectorizer:
            # Fallback heuristic if model files are missing
            return 25.0, 0.5, ["Model initializing"]

        try:
            vec = self.vectorizer.transform([text])
            probs = self.classifier.predict_proba(vec)[0]
            # prob of class 1 (fraudulent)
            fraud_prob = float(probs[1])
            ml_risk_score = round(fraud_prob * 100.0, 2)
            confidence = round(float(max(probs)), 2)

            # Extract active n-grams from vectorizer
            feature_names = self.vectorizer.get_feature_names_out()
            nonzero_indices = vec.nonzero()[1]
            active_tokens = [feature_names[i] for i in nonzero_indices]

            # Filter high-risk suspicious tokens
            suspicious_signals = ["fee", "deposit", "telegram", "whatsapp", "daily", "guaranteed", "registration", "pay", "task", "direct", "urgent", "commission", "upi", "recharge"]
            flagged = [t for t in active_tokens if any(s in t for s in suspicious_signals)]

            return ml_risk_score, confidence, flagged[:5]
        except Exception as e:
            print(f"[MLService] Prediction error: {e}")
            return 20.0, 0.5, []

ml_service = MLService()
