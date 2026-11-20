import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  FileCheck, 
  Network, 
  Globe2, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  TrendingUp,
  Sparkles
} from "lucide-react";
import { api } from "../api/client";

export function HomePage() {
  const navigate = useNavigate();
  const [quickText, setQuickText] = useState("");
  const [stats, setStats] = useState({
    total_analyzed: 28,
    high_risk_count: 15,
    reports_submitted: 12
  });

  useEffect(() => {
    loadTrends();
  }, []);

  async function loadTrends() {
    try {
      const data = await api.getScamTrends();
      setStats({
        total_analyzed: data.total_analyzed || 28,
        high_risk_count: data.high_risk_count || 15,
        reports_submitted: data.reports_submitted || 12
      });
    } catch {
      // fallback default stats
    }
  }

  function handleQuickAnalyze(e) {
    e.preventDefault();
    if (!quickText.trim()) return;
    navigate(`/analyzer?text=${encodeURIComponent(quickText.trim())}`);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold border border-blue-200 shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>JobGuard AI 1.0 — Real-Time Recruitment Scam Shield</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Don't trust every job offer. <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Verify before you apply.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Protect yourself from fraudulent internships, fake recruiters demanding registration fees, WhatsApp task scams, and forged offer letters with explainable AI.
            </p>

            {/* Quick Analyze Search Bar */}
            <form onSubmit={handleQuickAnalyze} className="max-w-2xl mx-auto pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100">
                <div className="flex items-center gap-3 w-full px-3 py-2 text-slate-400">
                  <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    placeholder="Paste job title, recruiter message, or URL..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[1.02]"
                >
                  <span>Check a Job Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/analyzer"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg shadow-slate-900/15 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                Open Advanced Job Analyzer
              </Link>
              <Link
                to="/offer-letter"
                className="px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-sm transition-all flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 text-blue-600" />
                Upload & Verify Offer Letter
              </Link>
            </div>
          </div>

          {/* Platform Metric Counter Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-slate-900">{stats.total_analyzed}+</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Total Jobs Analyzed</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-rose-600">{stats.high_risk_count}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">High-Risk Listings Flagged</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-indigo-600">{stats.reports_submitted}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Community Reports Filed</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm text-center">
              <div className="text-3xl font-extrabold text-emerald-600">3 Lang</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">English, Hindi & Kannada</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineered Specifically to Combat Recruitment Fraud
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Standard antivirus tools miss social engineering. JobGuard AI analyzes linguistic tactics, domain spoofing, and recruiter syndicate overlaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Multilingual Scam NLP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Native detection for English, Hindi, Kannada, and Hinglish messages. Automatically extracts payment traps and unrealistic promises like ₹5000 daily earnings.
              </p>
            </div>
            <Link to="/scanner" className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Try Scanner <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Recruiter Syndicate Intel</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects the dots between burner phone numbers and fake recruiters claiming to represent different companies. Displays relationships in an interactive graph.
              </p>
            </div>
            <Link to="/recruiter-intel" className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              Explore Network <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Offer Letter Forensic OCR</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts text from PDF/images. Flags suspicious clauses like laptop courier insurance, registration fees, and mismatched free webmail domains.
              </p>
            </div>
            <Link to="/offer-letter" className="mt-4 text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1">
              Verify Offer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Browser Extension Shield</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chrome Manifest V3 extension inspects job listing pages on LinkedIn, Indeed, and Naukri in real-time with explicit one-click user consent.
              </p>
            </div>
            <Link to="/extension" className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
              Get Extension <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Scam Defense Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              How JobGuard AI Assesses Risk
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              We never return opaque binary verdicts. You receive a complete 7-factor transparent explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="text-cyan-400 font-mono font-bold text-lg mb-2">01. Ingestion</div>
              <h4 className="font-bold text-white text-sm mb-1">Submit Listing or Document</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Paste the job text, upload a WhatsApp screenshot, or attach a PDF offer letter.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="text-cyan-400 font-mono font-bold text-lg mb-2">02. Threat Correlation</div>
              <h4 className="font-bold text-white text-sm mb-1">7-Factor Weighted Engine</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                TF-IDF ML model, payment detectors, domain consistency checkers, and syndicate intelligence analyze risk.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="text-cyan-400 font-mono font-bold text-lg mb-2">03. Defense Action</div>
              <h4 className="font-bold text-white text-sm mb-1">Explainable Safety Report</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Get a score from 0-100, identified indicators, and explicit instructions on how to verify before losing money.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
