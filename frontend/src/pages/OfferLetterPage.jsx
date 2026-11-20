import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  Mail, 
  Phone,
  FileCheck2,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { api } from "../api/client";
import { RiskBadge } from "../components/RiskBadge";
import { RiskScoreGauge } from "../components/RiskScoreGauge";

export function OfferLetterPage() {
  const [file, setFile] = useState(null);
  const [declaredCompany, setDeclaredCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError("");
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!file) {
      setError("Please choose a PDF document or PNG/JPG image to verify.");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("declared_company", declaredCompany);

      const res = await api.verifyOfferLetter(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || "Failed to parse and verify offer letter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-7 h-7 text-blue-600" />
          Offer Letter Forensic Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep document parsing and OCR to inspect suspicious clauses, upfront fee demands, and mismatched email domains.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Upload Appointment Document
          </h2>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employer / Company Claimed on Offer
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={declaredCompany}
                  onChange={(e) => setDeclaredCompany(e.target.value)}
                  placeholder="e.g. Tata Consultancy Services, Amazon, etc."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Helps detect domain spoofing and corporate impersonation
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Offer Letter Document (PDF, PNG, JPG) *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  id="offerFileInput"
                  className="hidden"
                />
                <label htmlFor="offerFileInput" className="cursor-pointer space-y-2 block">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {file ? file.name : "Click to select or drop offer letter"}
                  </div>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG up to 10MB</p>
                </label>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              ⚠️ <strong>Notice:</strong> High-quality formatting, company logos, and official stamps do not guarantee authenticity. Scammers routinely clone corporate letterheads.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Document & Analyzing Clauses...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Verify Offer Letter</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Offer Letter Forensic Verdict
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">
                    {result.extracted_company} — {result.extracted_candidate_role}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Offered Compensation: <strong className="text-slate-800">{result.extracted_salary}</strong>
                  </div>
                </div>
                <RiskBadge category={result.risk_category} score={result.risk_score} size="lg" />
              </div>

              {/* Gauge and Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <RiskScoreGauge score={result.risk_score} category={result.risk_category} size={170} />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Document Verdict
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>

              {/* Verification Checklist */}
              {result.checklist_status && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Authentication Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(result.checklist_status).map(([check, passed], idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                          passed
                            ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                            : "bg-rose-50/60 border-rose-200 text-rose-900 font-semibold"
                        }`}
                      >
                        <span>{check}</span>
                        {passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Domain Mismatch Alert */}
              {result.domain_mismatch_warning && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Domain & Email Inconsistency Detected</div>
                    <div className="mt-0.5 leading-relaxed">{result.domain_mismatch_warning}</div>
                  </div>
                </div>
              )}

              {/* Suspicious Clauses Flagged */}
              {result.suspicious_clauses?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-700 flex items-center gap-1.5 uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4" />
                    High-Risk Clauses Identified ({result.suspicious_clauses.length})
                  </h4>
                  <div className="space-y-1">
                    {result.suspicious_clauses.map((clause, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                        <span className="font-bold text-rose-500">•</span>
                        <span>{clause}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Advisories */}
              {result.safety_advisory?.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                  <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Safety Guidelines Before Accepting
                  </h4>
                  <ul className="space-y-1">
                    {result.safety_advisory.map((adv, idx) => (
                      <li key={idx} className="text-xs text-blue-800 flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">✓</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Upload an Offer Letter to Begin</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                We'll extract all company names, compensation figures, and fine print clauses to protect you from fraudulent hiring scams.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
