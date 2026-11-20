# JobGuard AI — System Architecture & Technical Specifications

JobGuard AI is a multi-tier cybersecurity intelligence system designed to protect students and job seekers against recruitment fraud, fake internships, and monetary extortion schemes.

## 1. Architectural Overview

```
                      +------------------------------------------+
                      |         JobGuard AI Chrome MV3           |
                      |   Extension (activeTab / Content Script) |
                      +--------------------+---------------------+
                                           |
                                           v
+------------------------+       +---------+----------+       +------------------------+
|  React 19 + Vite 8     | <---> |   FastAPI Backend  | <---> |   SQLite / PostgreSQL  |
|  Tailwind + Recharts   | REST  |   Python 3.11 REST | ORM   |   Database Layer       |
+------------------------+       +---------+----------+       +------------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                         |                         |
                 v                         v                         v
     +-----------+-----------+ +-----------+-----------+ +-----------+-----------+
     |  Scikit-Learn ML NLP  | |  Multilingual Phrase  | |  Recruiter Syndicate  |
     |  TF-IDF + Classifiers | |  Engine (EN / HI / KN)| |  Connection Graph Engine|
     +-----------------------+ +-----------------------+ +-----------------------+
```

## 2. 7-Factor Weighted Explainability Engine

A core design requirement is that JobGuard AI never issues opaque binary decisions. Threat scores ($S \in [0, 100]$) are derived from seven transparently evaluated components:

$$S = 0.25 M + 0.20 K + 0.15 R + 0.15 C + 0.15 P + 0.05 H + 0.05 D$$

Where:
- **$M$ (ML Linguistic Risk, 25%)**: Scikit-Learn classifier output predicting fraud likelihood based on job description semantics.
- **$K$ (Suspicious Keyword Risk, 20%)**: Multi-lingual dictionary lookup across English, Hindi, Kannada, and Hinglish.
- **$P$ (Payment Demand Risk, 15%)**: Explicit flags for registration fees, training deposits, or courier charges.
- **$C$ (Contact Detail Consistency, 15%)**: Checks whether recruiters use free personal webmails (`@gmail.com`) to represent registered enterprises.
- **$R$ (Recruiter & Brand Verification, 15%)**: Evaluates employer reputation and checks for corporate impersonation.
- **$H$ (Historical Threat Matches, 5%)**: Cross-references phone numbers and emails against verified community scam reports.
- **$D$ (Domain Consistency Risk, 5%)**: Audits website domains, detecting low-trust disposable TLDs (`.xyz`, `.top`, `.icu`).

## 3. Database Schema

The database is built on SQLAlchemy declarative models:
- `users`: Stores user identity, bcrypt-hashed credentials, and role permissions (`user` vs `admin`).
- `job_analyses`: Records all audited job listings, sub-score breakdowns, and explainability text.
- `scam_reports`: Crowdsourced scam registry storing target companies, loss amounts, and evidence snippets.
- `recruiter_entities`: Normalizes recruiter phones, emails, and website domains for graph traversal.
- `uploaded_documents`: Manages offer letter PDFs and WhatsApp screenshot OCR metadata.
