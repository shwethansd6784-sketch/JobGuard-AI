import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score, roc_auc_score

try:
    from ml.dataset import generate_curated_dataset
except ImportError:
    from dataset import generate_curated_dataset

def train_and_evaluate(dataset_csv: str = "dataset/fake_job_postings.csv", artifacts_dir: str = "ml/model_artifacts"):
    os.makedirs(artifacts_dir, exist_ok=True)

    if not os.path.exists(dataset_csv):
        print(f"Dataset not found at {dataset_csv}. Generating curated benchmark dataset...")
        df = generate_curated_dataset(dataset_csv)
    else:
        df = pd.read_csv(dataset_csv)

    print(f"Dataset loaded: {len(df)} records. Class balance: Genuine={(df['fraudulent']==0).sum()}, Fraudulent={(df['fraudulent']==1).sum()}")

    # Feature Engineering: Combine text columns
    df['combined_text'] = (
        df['title'].fillna('') + ' ' +
        df['company_profile'].fillna('') + ' ' +
        df['description'].fillna('') + ' ' +
        df['requirements'].fillna('') + ' ' +
        df['benefits'].fillna('')
    )

    X = df['combined_text']
    y = df['fraudulent'].astype(int)

    # Train / Test split (80% train, 20% test with stratification)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # TF-IDF Vectorizer with unigrams & bigrams
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        stop_words='english'
    )

    print("Fitting TF-IDF Vectorizer...")
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # 1. Baseline Model: Logistic Regression with balanced class weights
    lr_model = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
    lr_model.fit(X_train_vec, y_train)
    lr_preds = lr_model.predict(X_test_vec)
    lr_probs = lr_model.predict_proba(X_test_vec)[:, 1]

    # 2. Advanced Comparison Model: Random Forest
    rf_model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
    rf_model.fit(X_train_vec, y_train)
    rf_preds = rf_model.predict(X_test_vec)
    rf_probs = rf_model.predict_proba(X_test_vec)[:, 1]

    # Metrics evaluation
    lr_precision = precision_score(y_test, lr_preds, zero_division=0)
    lr_recall = recall_score(y_test, lr_preds, zero_division=0)
    lr_f1 = f1_score(y_test, lr_preds, zero_division=0)
    lr_auc = roc_auc_score(y_test, lr_probs)
    lr_cm = confusion_matrix(y_test, lr_preds).tolist()

    rf_precision = precision_score(y_test, rf_preds, zero_division=0)
    rf_recall = recall_score(y_test, rf_preds, zero_division=0)
    rf_f1 = f1_score(y_test, rf_preds, zero_division=0)
    rf_auc = roc_auc_score(y_test, rf_probs)
    rf_cm = confusion_matrix(y_test, rf_preds).tolist()

    print("\n=== Model Evaluation Results ===")
    print(f"Logistic Regression: Precision={lr_precision:.4f}, Recall={lr_recall:.4f}, F1={lr_f1:.4f}, ROC-AUC={lr_auc:.4f}")
    print(f"Random Forest:       Precision={rf_precision:.4f}, Recall={rf_recall:.4f}, F1={rf_f1:.4f}, ROC-AUC={rf_auc:.4f}")

    # Select best model based on F1-score (prioritizing high fraud recall & precision)
    best_model = rf_model if rf_f1 >= lr_f1 else lr_model
    best_name = "RandomForest" if rf_f1 >= lr_f1 else "LogisticRegression"

    # Save artifacts
    joblib.dump(vectorizer, os.path.join(artifacts_dir, "tfidf_vectorizer.joblib"))
    joblib.dump(best_model, os.path.join(artifacts_dir, "best_classifier.joblib"))
    joblib.dump(lr_model, os.path.join(artifacts_dir, "baseline_logistic_regression.joblib"))

    # Save metrics JSON
    metrics = {
        "selected_model": best_name,
        "dataset_size": len(df),
        "test_size": len(y_test),
        "genuine_count": int((df['fraudulent'] == 0).sum()),
        "fraudulent_count": int((df['fraudulent'] == 1).sum()),
        "baseline_logistic_regression": {
            "precision": round(float(lr_precision), 4),
            "recall": round(float(lr_recall), 4),
            "f1_score": round(float(lr_f1), 4),
            "roc_auc": round(float(lr_auc), 4),
            "confusion_matrix": lr_cm # [[TN, FP], [FN, TP]]
        },
        "random_forest": {
            "precision": round(float(rf_precision), 4),
            "recall": round(float(rf_recall), 4),
            "f1_score": round(float(rf_f1), 4),
            "roc_auc": round(float(rf_auc), 4),
            "confusion_matrix": rf_cm
        }
    }

    with open(os.path.join(artifacts_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Successfully trained and saved model artifacts in {artifacts_dir}")
    return metrics

if __name__ == "__main__":
    train_and_evaluate()
