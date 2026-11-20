"""
Dataset generation and management for JobGuard AI Fake Job Detection.
Dataset inspiration: University of the Aegean Employment Scam Aegean Dataset (EMSCAD)
and real-world 2024-2026 recruitment scam patterns observed across India and global remote work channels.

Features:
- title
- company_profile
- description
- requirements
- benefits
- telecommuting (0 or 1)
- has_company_logo (0 or 1)
- has_questions (0 or 1)
- fraudulent (0 for genuine, 1 for fake/scam)
"""

import os
import pandas as pd
import numpy as np

def generate_curated_dataset(output_path: str = "dataset/fake_job_postings.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Genuine job samples across various industries (Tech, Finance, Healthcare, Design, Marketing)
    genuine_samples = [
        {
            "title": "Senior Frontend Engineer (React/TypeScript)",
            "company_profile": "CloudScale Systems is an enterprise SaaS provider delivering real-time telemetry solutions to Fortune 500 companies. Founded in 2018.",
            "description": "We are seeking a Senior Frontend Engineer to architect resilient web dashboards using React 18, TypeScript, and modern state management. You will collaborate with UX designers and backend distributed systems teams.",
            "requirements": "5+ years experience with modern JavaScript/TypeScript, React, Redux Toolkit, RESTful APIs, Git, and automated testing (Jest/Cypress). BS in Computer Science or equivalent work experience.",
            "benefits": "Competitive compensation (₹18-24 LPA / $120k-$150k), health insurance, 401k/EPF matching, ₹75,000 annual learning stipend, flexible remote work policy.",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Software Development Engineer - Intern",
            "company_profile": "Amazon Web Services (AWS) builds highly reliable, scalable, and low-cost infrastructure platform in the cloud.",
            "description": "As an SDE Intern at AWS, you will work on mission-critical distributed services, write high-quality clean Java/Python code, implement unit and integration tests, and participate in design reviews.",
            "requirements": "Currently enrolled in Bachelor's or Master's degree in Computer Science, IT, or related STEM field. Solid foundation in data structures, algorithms, and OOP principles.",
            "benefits": "Monthly stipend ₹65,000 - ₹85,000, mentor allocation, relocation assistance, full-time PPO consideration upon performance.",
            "telecommuting": 0,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Data Analyst (SQL / PowerBI)",
            "company_profile": "FinMetrics Global provides actuarial and quantitative market risk research to institutional investors.",
            "description": "The Data Analyst will build automated ETL pipelines, maintain corporate risk scorecards, synthesize raw transactional data into interactive PowerBI dashboards, and present findings to executive leadership.",
            "requirements": "Proficiency in Advanced SQL, PostgreSQL, PowerBI or Tableau, and intermediate Python (pandas). Strong communication and statistical modeling acumen.",
            "benefits": "Comprehensive medical, dental, vision insurance, annual performance bonus, paid time off, hybrid schedule (2 days in office).",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Cybersecurity Associate - Threat Intelligence",
            "company_profile": "SecureShield Cyber Labs defends critical infrastructure against nation-state threat actors.",
            "description": "Join our 24/7 Security Operations Center (SOC). Monitor SIEM alerts, triage security incident reports, conduct root cause forensic analyses, and coordinate incident response protocols.",
            "requirements": "B.Tech in Information Security or Computer Science. Familiarity with Splunk, Wireshark, MITRE ATT&CK framework, and network protocols. CompTIA Security+ or CEH preferred.",
            "benefits": "Tier 1 health coverage, shift allowances, continuous certification sponsorship, wellness allowance.",
            "telecommuting": 0,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Product Marketing Specialist",
            "company_profile": "InnovateGrowth is a venture-backed B2B marketing tech startup based in Bengaluru.",
            "description": "Drive Go-to-Market strategies, execute content marketing campaigns, manage social channels, and optimize customer conversion funnels using Google Analytics and HubSpot.",
            "requirements": "2-4 years of experience in product marketing, copy drafting, and marketing automation. Degree in Marketing, Communications, or Business.",
            "benefits": "Stock options (ESOPs), wellness leave, annual international company retreat, flexible hours.",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 0,
            "fraudulent": 0
        },
        {
            "title": "Human Resources Coordinator",
            "company_profile": "Metro Healthcare Group operates a network of multi-specialty hospitals with over 5,000 healthcare staff.",
            "description": "Coordinate employee onboarding, verify candidate educational credentials, manage internal HRIS databases, and assist senior HR business partners with campus recruitment drives.",
            "requirements": "Bachelor's degree in HR, Psychology, or Business Administration. Strong interpersonal skills and proficiency in Microsoft Office 365.",
            "benefits": "Hospital OPD discounts for family, gratuity, statutory provident fund, 24 days paid vacation.",
            "telecommuting": 0,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Customer Success Manager (APAC)",
            "company_profile": "ZetaDesk builds omnichannel support software for high-growth e-commerce merchants.",
            "description": "Act as the primary point of contact for enterprise clients across Singapore, India, and Australia. Drive product adoption, conduct quarterly business reviews, and minimize account churn.",
            "requirements": "3+ years in B2B SaaS account management or customer success. Fluent English communication.",
            "benefits": "Health insurance, performance-based quarterly commissions, home office setup budget.",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        },
        {
            "title": "Full Stack Developer (Node.js & Vue.js)",
            "company_profile": "NextGen Logistics simplifies freight supply chains across South Asia.",
            "description": "Develop microservices with Node.js, Express, and Docker. Build responsive user interfaces with Vue 3 and Pinia. Integrate third-party GPS tracking and payment gateway webhooks.",
            "requirements": "Solid experience with modern JavaScript, Node.js, REST APIs, and relational databases (MySQL/PostgreSQL).",
            "benefits": "Provident fund, gym membership reimbursement, continuous learning budget, laptop provided.",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 1,
            "fraudulent": 0
        }
    ]

    # Fraudulent / Scam job samples reflecting common recruitment fraud archetypes:
    # 1. Registration Fee / Training fee scam
    # 2. Telegram / WhatsApp task scam (rating videos/hotels)
    # 3. Unrealistic salary part-time typing/data entry
    # 4. Impersonation of major brand with free webmail and urgent deposit
    # 5. Multilingual scam vectors (Hindi/Kannada/Hinglish)
    fraudulent_samples = [
        {
            "title": "Online Data Entry Operator - Daily Payment Guaranteed",
            "company_profile": "Leading International Data Management Corp. No website or verified address available.",
            "description": "Earn ₹3000 to ₹5000 daily from home. Simple copy-paste, form filling and captcha typing work. No prior experience or qualification needed. Direct joining without interview. Note: Selected applicants must pay a refundable registration fee of ₹1,499 for portal credentials and software kit. Send screenshot to WhatsApp +91-9876543210.",
            "requirements": "Basic mobile or laptop with internet connection. Anyone can apply (students, housewives, retired). Must pay registration and ID card fee before commencing.",
            "benefits": "Daily payout to UPI / Paytm. Work 1 to 2 hours per day. 100% placement assurance.",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "YouTube Video Reviewer & Google Maps Rating Specialist",
            "company_profile": "Digital Marketing Global Alliance.",
            "description": "Work from home part time. Get paid ₹50 to ₹150 for liking each YouTube video and rating Google Maps locations. Earn ₹50,000 per month easily. Contact HR strictly on Telegram @Recruiter_Pooja_Jobs. You must complete a trial prepaid task of ₹500 to activate your merchant account and unlock task bonuses.",
            "requirements": "Telegram application, UPI ID or crypto wallet (USDT) for receiving daily commission.",
            "benefits": "Daily withdrawal to bank account. Instant payout after each 5 tasks completed.",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "Urgent Requirement: Airport Ground Staff & Cargo Loader",
            "company_profile": "Aviation Career Placement Services.",
            "description": "Urgent hiring for Indira Gandhi International Airport. Direct job without interview. Salary ₹45,000 - ₹65,000 per month. Selected candidates will receive official offer letter immediately. Security deposit of ₹3,500 required for uniform, airport gate pass and security verification. Deposit is 100% refundable with first month salary.",
            "requirements": "10th, 12th pass or graduate. Age 18-35. Immediate joining within 48 hours.",
            "benefits": "Free food, accommodation, cab facility, overtime bonus.",
            "telecommuting": 0,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "Software Development Internship (Guaranteed Offer Letter)",
            "company_profile": "TechVanguard Solutions (hiring via techvanguard.hr.verify@gmail.com).",
            "description": "We are offering virtual software engineering internships for college students. Direct selection without technical assessment. To process your official background verification and project allocation, candidate must deposit a training and mentorship fee of ₹4,999. Do not miss this golden opportunity for assured placement.",
            "requirements": "Any engineering student. Payment of onboarding documentation fee is mandatory.",
            "benefits": "Experience certificate, recommendation letter, guaranteed job guarantee at top MNC.",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "घर बैठे पैकिंग का काम - रोजाना कमाई ₹2500",
            "company_profile": "घरेलू उद्योग सेवा केंद्र",
            "description": "पेन पैकिंग, मोमबत्ती पैकिंग और मसाला पैकिंग का काम घर बैठे करें। कंपनी आपके घर कच्चा माल पहुंचाएगी। कोई इंटरव्यू नहीं। सामग्री डिलीवरी से पहले ₹1,200 सिक्योरिटी डिपाजिट जमा करना अनिवार्य है। काम पूरा होने पर तुरंत नकद भुगतान मिलेगा। संपर्क केवल व्हाट्सएप पर करें।",
            "requirements": "कोई योग्यता की आवश्यकता नहीं। आधार कार्ड और पंजीकरण शुल्क आवश्यक है।",
            "benefits": "रोजाना नकद भुगतान, फ्री होम डिलीवरी।",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಕೆಲಸ - ದೈನಂದಿನ ಆದಾಯ ₹3000 (Data Entry)",
            "company_profile": "ಕರ್ನಾಟಕ ಆನ್‌ಲೈನ್ ಉದ್ಯೋಗ ಸೇವೆಗಳು",
            "description": "ಯಾವುದೇ ಸಂದರ್ಶನವಿಲ್ಲದೆ ನೇರ ನೇಮಕಾತಿ. ದಿನಕ್ಕೆ ಕೇವಲ 2 ಗಂಟೆ ಕೆಲಸ ಮಾಡಿ ₹3,000 ಗಳಿಸಿ. ಐಡಿ ಕಾರ್ಡ್ ಮತ್ತು ತರಬೇತಿ ಶುಲ್ಕ ₹1,500 ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ. ಮೊದಲ ದಿನದಿಂದಲೇ ಪಾವತಿ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಟೆಲಿಗ್ರಾಂ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            "requirements": "ಕಂಪ್ಯೂಟರ್ ಅಥವಾ ಮೊಬೈಲ್ ಹೊಂದಿರಬೇಕು. ನೋಂದಣಿ ಶುಲ್ಕ ಕಡ್ಡಾಯ.",
            "benefits": "ದೈನಂದಿನ ಖಾತೆಗೆ ನೇರ ಹಣ ವರ್ಗಾವಣೆ.",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "Google India Remote Support Specialist - Urgent Joining",
            "company_profile": "Google Recruitment Team (contact: google.careers.hiring.desk@gmail.com).",
            "description": "Google is urgently hiring remote support executives. Congratulations! Your resume has been shortlisted from the job portal. Monthly salary ₹95,000 with Mac laptop provided. You must pay ₹5,500 laptop courier insurance fee to our authorized logistics partner via Google Pay to dispatch your company assets.",
            "requirements": "Good English communication. Ability to pay courier insurance within 24 hours.",
            "benefits": "Google corporate health insurance, annual stock grants, work from anywhere.",
            "telecommuting": 1,
            "has_company_logo": 1,
            "has_questions": 0,
            "fraudulent": 1
        },
        {
            "title": "Hotel Reservation Reviewer - Telegram VIP Task Group",
            "company_profile": "Agoda Trip Advisor Partner Group.",
            "description": "Help five star hotels boost their rating. Complete 3 prepaid merchant tasks every morning. Recharge ₹1,000 to get ₹1,300 back. Upgrade to VIP diamond level for ₹10,000 recharge and get ₹15,000 back guaranteed. Contact mentor on Telegram @VIP_Task_Manager.",
            "requirements": "Active bank account and Telegram app. Quick execution of prepaid tasks.",
            "benefits": "30% profit within 20 minutes, fast withdrawals.",
            "telecommuting": 1,
            "has_company_logo": 0,
            "has_questions": 0,
            "fraudulent": 1
        }
    ]

    # Synthesize variation to reach balanced statistical representation (120 genuine, 80 fraud patterns)
    all_data = []
    
    # Expand genuine postings
    titles_g = [
        "React Native Mobile Developer", "DevOps Engineer (Kubernetes/AWS)", "Backend Python Developer (FastAPI)",
        "QA Automation Engineer", "UI/UX Product Designer", "Associate Product Manager",
        "Financial Analyst", "Operations Executive", "Digital Marketing Lead",
        "Cloud Architect (GCP/Azure)", "Machine Learning Engineer", "Content Strategist",
        "Database Administrator (PostgreSQL)", "Security Analyst", "Technical Writer"
    ]
    companies_g = [
        "TechNova Solutions", "Apex Global Media", "FinServ Analytics", "HealthCare Plus Systems",
        "Quantum Computing Labs", "BluePeak Digital", "Vanguard Logistics", "Starlight Interactive",
        "CoreLogic Systems", "Evergreen Technologies"
    ]

    for i in range(120):
        base = genuine_samples[i % len(genuine_samples)].copy()
        base["title"] = f"{titles_g[i % len(titles_g)]} - Level {((i % 3) + 1)}"
        base["company_profile"] = f"{companies_g[i % len(companies_g)]} - {base['company_profile']}"
        all_data.append(base)

    # Expand fraudulent postings
    titles_f = [
        "Part Time SMS Sending Job - Earn ₹2000 Daily", "WhatsApp Chat Support Operator",
        "Home Based Typing Assignment (Registration Required)", "Amazon Review & Rating Specialist",
        "Railway Ticket Booking Agent - Direct Selection", "VIP Crypto Trading Assistant",
        "Direct Joining Metro Rail Ground Officer", "Flipkart Product Review Task Associate",
        "Instant Placement Java Developer (Training Fee Applicable)", "Online Survey Taker - High Daily Payout"
    ]
    
    for i in range(80):
        base = fraudulent_samples[i % len(fraudulent_samples)].copy()
        base["title"] = f"{titles_f[i % len(titles_f)]} [Urgent Hiring #{i+101}]"
        all_data.append(base)

    df = pd.DataFrame(all_data)
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} curated dataset rows at {output_path}. (Genuine: {(df['fraudulent'] == 0).sum()}, Fraudulent: {(df['fraudulent'] == 1).sum()})")
    return df

if __name__ == "__main__":
    generate_curated_dataset()
