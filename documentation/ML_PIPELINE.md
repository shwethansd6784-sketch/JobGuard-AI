# JobGuard AI — Machine Learning Pipeline Documentation

## 1. Dataset & Class Imbalance Strategy

Recruitment fraud represents an inherently imbalanced problem in the real world: the vast majority of online job postings are genuine, while fraudulent postings represent a high-impact minority.

- **Dataset Source**: Inspired by the University of the Aegean Employment Scam Aegean Dataset (EMSCAD) and curated real-world recruitment fraud patterns (2024–2026).
- **Curated Dataset Location**: `dataset/fake_job_postings.csv`
- **Class Distribution**: 120 genuine postings (Tech, SDE, Finance, Healthcare, Design) and 80 fraudulent postings (Task scams, Registration fee demands, Laptop insurance extortion, and Hindi/Kannada transliterations).
- **Handling Imbalance**: Models are trained using `class_weight='balanced'` to prevent bias toward genuine postings and prioritize the recall of fraud signals.

## 2. Text Preprocessing & Vectorization

The feature engineering pipeline concatenates:
`Title + Company Profile + Description + Requirements + Benefits`

We apply `TfidfVectorizer`:
- `ngram_range=(1, 2)`: Captures both unigrams and informative bigrams like `"registration fee"`, `"daily payout"`, and `"prepaid task"`.
- `sublinear_tf=True`: Applies logarithmic term frequency scaling ($1 + \log(tf)$) to prevent high-frequency words from skewing predictions.
- `max_features=5000`: Caps vocabulary dimensionality for rapid real-time inference.

## 3. Model Comparison & Metrics

We train and evaluate two complementary classifiers with stratified 25% holdout validation:

| Model | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- |
| **Baseline Logistic Regression** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |
| **Random Forest (100 Trees)** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |

*Note: Evaluation emphasizes Recall and F1-score over raw accuracy because a False Negative (allowing a scam posting to pass as genuine) carries severe financial harm for a job seeker.*

## 4. Retraining

Administrators can retrain the ML pipeline on-demand from the Admin Dashboard or via CLI:
```bash
python backend/ml/train_model.py
```
Trained artifacts are persisted into `backend/ml/model_artifacts/`:
- `tfidf_vectorizer.joblib`
- `best_classifier.joblib`
- `baseline_logistic_regression.joblib`
- `metrics.json`
