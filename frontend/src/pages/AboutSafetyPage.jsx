import React from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Building2, 
  DollarSign, 
  FileCheck2,
  Lock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export function AboutSafetyPage() {
  const redFlags = [
    {
      title: "1. Demand for Upfront Payment or 'Refundable' Deposit",
      desc: "Legitimate corporate recruiters never ask candidates for money — whether for application processing, background checks, training kits, uniform costs, or laptop courier insurance.",
      category: "Monetary Extortion"
    },
    {
      title: "2. Recruiter Uses Free Webmail (Gmail / Yahoo / Outlook)",
      desc: "Genuine enterprise recruiters (Google, TCS, Infosys, Amazon) always email from corporate domains (@company.com). An offer from 'tcs.careers.verify@gmail.com' is 100% fake.",
      category: "Domain Impersonation"
    },
    {
      title: "3. Direct Selection Without Any Interview",
      desc: "If you receive an offer letter or instant hiring notice without a technical assessment, interview, or screening, it is a psychological bait tactic.",
      category: "Social Engineering"
    },
    {
      title: "4. Unrealistic Daily Earnings for Simple Tasks",
      desc: "Offers promising ₹3,000 to ₹5,000 per day for 30 minutes of liking YouTube videos, rating Google Maps locations, or typing captchas are classic Telegram task scams.",
      category: "Task Scam"
    },
    {
      title: "5. Pressure Tactics & Artificial 24-Hour Deadlines",
      desc: "Scammers manufacture artificial urgency ('Offer valid for 4 hours only', 'Pay registration immediately to reserve your seat') to prevent you from researching the company.",
      category: "Psychological Pressure"
    },
    {
      title: "6. Communication Exclusively via WhatsApp or Telegram",
      desc: "Refusal to conduct video interviews or communicate via official company telephone switchboards indicates an anonymous threat actor operating with burner SIM cards.",
      category: "Anonymity Masking"
    },
    {
      title: "7. Suspicious Website Domains (.xyz, .top, .icu, .buzz)",
      desc: "Fraudulent syndicates register disposable, unindexed top-level domains rather than establishing legitimate verified corporate web presences.",
      category: "Infrastructure Spoofing"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-1">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Job Safety Guidelines & Threat Advisory
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          An educational reference manual designed for engineering students, fresh graduates, and remote job seekers to recognize, prevent, and report recruitment fraud.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold uppercase tracking-wider">
            🚨 Immediate Cyber Incident Response
          </div>
          <h3 className="text-xl font-black">Report Recruitment Fraud to Government Authorities</h3>
          <p className="text-xs text-rose-200 max-w-xl leading-relaxed">
            If you have transferred funds or shared government IDs with a fraudulent recruiter in India, report within the 'Golden Hour' to freeze fraudulent bank transactions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 whitespace-nowrap">
          <a
            href="tel:1930"
            className="px-5 py-3 rounded-xl bg-white text-rose-900 hover:bg-rose-50 font-black text-sm shadow flex items-center gap-2 transition-transform hover:scale-105"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Call Helpline 1930</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-sm shadow flex items-center gap-2 border border-rose-500/40"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 7 Red Flags */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Defensive Knowledge
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            The 7 Red Flags of Recruitment Scams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redFlags.map((rf, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {rf.category}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{rf.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rf.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Checklist */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">
          Student Job Verification Checklist Before Applying
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">Check the company's official careers portal (company.com/careers) to verify if the job requisition exists.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">Look up the recruiter on LinkedIn and confirm they actively work in the talent acquisition department of the company.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">Verify company corporate registration on the Ministry of Corporate Affairs (MCA) portal or local registrar.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">Never send bank account numbers, Aadhaar copies, or PAN cards over WhatsApp before receiving a verifiable offer.</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            to="/analyzer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
          >
            <span>Scan a Job Posting with JobGuard AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
