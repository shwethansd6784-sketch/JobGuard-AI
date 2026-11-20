import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  DollarSign, 
  MapPin, 
  Share2, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "../api/client";
import { RiskScoreGauge } from "../components/RiskScoreGauge";
import { RiskBadge } from "../components/RiskBadge";

export function JobAnalyzerPage() {
  const [searchParams] = useSearchParams();

  // Form State
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    job_description: "",
    salary_offered: "",
    job_location: "Remote",
    recruiter_email: "",
    recruiter_phone: "",
    company_website: "",
    job_url: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle URL prefill params (e.g. from homepage search or extension)
  useEffect(() => {
    const text = searchParams.get("text");
    const title = searchParams.get("title");
    const company = searchParams.get("company");
    const analysisId = searchParams.get("analysis_id");

    if (text) {
      setFormData(prev => ({
        ...prev,
        job_title: text.slice(0, 80),
        job_description: text
      }));
    } else if (title || company) {
      setFormData(prev => ({
        ...prev,
        job_title: title || prev.job_title,
        company_name: company || prev.company_name
      }));
    }

    if (analysisId) {
      loadExistingAnalysis(analysisId);
    }
  }, [searchParams]);

  async function loadExistingAnalysis(id) {
    try {
      setLoading(true);
      const data = await api.getAnalysisById(id);
      setResult(data);
    } catch (err) {
      console.warn("Could not load analysis by id:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleAnalyze(e) {
    e?.preventDefault();
    if (!formData.job_description.trim() && !formData.job_title.trim()) {
      setError("Please provide at least a job title or description.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const data = await api.analyzeJob(formData);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze job posting. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // Pre-configured Test Samples
  function loadSample(type) {
    if (type === "suspicious") {
      setFormData({
        job_title: "Online Data Entry Operator - Daily Payment",
        company_name: "Apex Global Services",
        job_description: "Earn ₹3000 to ₹5000 daily from home. Simple copy-paste and captcha typing work. No prior experience needed. Direct selection without interview. Note: Selected applicants must pay a refundable registration fee of ₹1,499 for portal credentials. Contact HR Pooja on WhatsApp +91-9876543210.",
        salary_offered: "₹5000 daily",
        job_location: "Remote / Work From Home",
        recruiter_email: "pooja.data.jobs@gmail.com",
        recruiter_phone: "+91-9876543210",
        company_website: "http://apex-data-jobs.xyz",
        job_url: "http://apex-data-jobs.xyz/apply"
      });
    } else if (type === "genuine") {
      setFormData({
        job_title: "Software Engineer - Frontend (React/TypeScript)",
        company_name: "TechNova Cloud Systems",
        job_description: "We are seeking a Frontend Engineer to architect responsive dashboards in React, TypeScript, and modern CSS. You will collaborate with product designers and distributed systems teams to ship scalable web applications.",
        salary_offered: "₹14 - 18 LPA",
        job_location: "Bengaluru (Hybrid)",
        recruiter_email: "careers@technova-cloud.com",
        recruiter_phone: "+91-8041234567",
        company_website: "https://technova-cloud.com",
        job_url: "https://technova-cloud.com/careers/frontend-engineer"
      });
    } else if (type === "regional") {
      setFormData({
        job_title: "ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಕೆಲಸ - Data Entry Assistant",
        company_name: "ಆನ್‌ಲೈನ್ ಉದ್ಯೋಗ ಸೇವೆಗಳು",
        job_description: "ದೈನಂದಿನ ಆದಾಯ 3000. ಯಾವುದೇ ಸಂದರ್ಶನವಿಲ್ಲದೆ ನೇರ ನೇಮಕಾತಿ. ನೋಂದಣಿ ಶುಲ್ಕ 1500 ಪಾವತಿಸಿ. ಟೆಲಿಗ್ರಾಂ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ @Online_Earn_Task.",
        salary_offered: "₹3000 / day",
        job_location: "Karnataka (Remote)",
        recruiter_email: "karnataka.jobs.verify@gmail.com",
        recruiter_phone: "+91-9876543210",
        company_website: "",
        job_url: ""
      });
    }
  }

  // Format Recharts data for breakdown
  const chartData = result?.score_breakdown ? [
    { name: "ML Language", score: result.score_breakdown.ml_linguistic_risk },
    { name: "Keywords", score: result.score_breakdown.suspicious_keywords_risk },
    { name: "Payment Demand", score: result.score_breakdown.payment_demand_risk },
    { name: "Contact Risk", score: result.score_breakdown.recruiter_contact_risk },
    { name: "Threat Match", score: result.score_breakdown.historical_threat_match },
    { name: "Domain Consistency", score: result.score_breakdown.domain_consistency_risk },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Search className="w-7 h-7 text-blue-600" />
            Job Advertisement Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transparent 7-factor explainable threat detection combining ML, NLP keyword extraction, and recruiter intelligence.
          </p>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Load Test Sample:</span>
          <button
            type="button"
            onClick={() => loadSample("suspicious")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            ⚠️ Scam Listing
          </button>
          <button
            type="button"
            onClick={() => loadSample("genuine")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            ✓ Genuine SDE
          </button>
          <button
            type="button"
            onClick={() => loadSample("regional")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            🌐 Kannada / Mixed
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Input Form on Left, Risk Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (5 or 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Listing Details & Recruiter Metadata
            </h2>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Multilingual (EN / HI / KN)
            </span>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.job_title}
                  onChange={(e) => handleInputChange("job_title", e.target.value)}
                  placeholder="e.g. Remote Data Entry Associate"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    placeholder="e.g. Apex Global Services"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Requirements *</label>
              <textarea
                required
                rows={5}
                value={formData.job_description}
                onChange={(e) => handleInputChange("job_description", e.target.value)}
                placeholder="Paste the complete job description, requirements, benefits, or WhatsApp message..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Salary / Compensation</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.salary_offered}
                    onChange={(e) => handleInputChange("salary_offered", e.target.value)}
                    placeholder="e.g. ₹5,000 daily or 12 LPA"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.job_location}
                    onChange={(e) => handleInputChange("job_location", e.target.value)}
                    placeholder="e.g. Remote / Bengaluru"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Recruiter Contact Information Section */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Recruiter Contact Verification Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.recruiter_email}
                      onChange={(e) => handleInputChange("recruiter_email", e.target.value)}
                      placeholder="e.g. hr.verify@gmail.com"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.recruiter_phone}
                      onChange={(e) => handleInputChange("recruiter_phone", e.target.value)}
                      placeholder="e.g. +91-9876543210"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Website</label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.company_website}
                      onChange={(e) => handleInputChange("company_website", e.target.value)}
                      placeholder="e.g. http://apex-data.xyz"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Application URL</label>
                  <div className="relative">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={formData.job_url}
                      onChange={(e) => handleInputChange("job_url", e.target.value)}
                      placeholder="e.g. https://portal.com/job/12"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Multi-Factor Threat Score...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Execute Forensic Job Analysis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Dossier (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in-50">
              {/* Risk Score Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Job Safety Assessment
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {result.job_title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-slate-600">{result.company_name}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-blue-600 font-medium">Detected: {result.detected_language}</span>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <RiskBadge category={result.risk_category} score={result.risk_score} size="lg" />
                </div>
              </div>

              {/* Gauge and Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                <RiskScoreGauge score={result.risk_score} category={result.risk_category} size={180} />
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Forensic Assessment
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.explanation}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    AI ML Confidence: {Math.round(result.ml_confidence * 100)}%
                  </div>
                </div>
              </div>

              {/* 7-Factor Weighted Sub-Scores Bar Chart */}
              {chartData.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
                    <span>Threat Sub-Scores Breakdown (0-100)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Transparent Multi-Factor Model</span>
                  </h4>
                  <div className="h-44 w-full bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} interval={0} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fontSize: 9, fill: "#64748b" }} domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value} / 100`, "Risk Score"]}
                          contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                        />
                        <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Indicators List */}
              <div className="space-y-3">
                {result.suspicious_indicators?.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Suspicious Threat Indicators Detected ({result.suspicious_indicators.length})
                    </h5>
                    <div className="space-y-1">
                      {result.suspicious_indicators.map((ind, i) => (
                        <div key={i} className="text-xs p-2 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-800 flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.positive_indicators?.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <h5 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Positive Genuine Indicators ({result.positive_indicators.length})
                    </h5>
                    <div className="space-y-1">
                      {result.positive_indicators.map((pos, i) => (
                        <div key={i} className="text-xs p-2 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{pos}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {result.safety_recommendations?.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    Recommended Safety Actions
                  </h5>
                  <ul className="space-y-1">
                    {result.safety_recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                {formData.recruiter_phone && (
                  <Link
                    to={`/recruiter-intel?query=${encodeURIComponent(formData.recruiter_phone)}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <span>Trace Recruiter Network</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                <Link
                  to="/community"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Report to Community
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50/40 via-white to-slate-50 rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="font-bold text-slate-800 text-base">Awaiting Job Posting Submission</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in the listing details on the left or click one of the test sample buttons at the top to see the real-time AI risk assessment in action.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => loadSample("suspicious")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  ⚡ Try Sample Scam Posting Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
