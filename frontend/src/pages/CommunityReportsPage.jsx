import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  ThumbsUp, 
  AlertTriangle, 
  DollarSign, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  RefreshCw,
  X
} from "lucide-react";
import { api } from "../api/client";

export function CommunityReportsPage() {
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Modal Form State
  const [newReport, setNewReport] = useState({
    title: "",
    company_name: "",
    scam_type: "registration_fee",
    contact_phone: "",
    contact_email: "",
    website_url: "",
    demanded_amount: "",
    description: "",
    evidence_snippet: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    loadReports();
  }, [filterType]);

  async function loadReports() {
    setLoading(true);
    try {
      const data = await api.getCommunityReports(filterType === "all" ? "" : filterType, searchQuery);
      setReports(data);
    } catch (err) {
      console.warn("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadReports();
  }

  async function handleUpvote(id) {
    try {
      const res = await api.upvoteReport(id);
      setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: res.upvotes } : r));
    } catch (err) {
      console.warn("Could not upvote:", err);
    }
  }

  async function handleCreateReport(e) {
    e.preventDefault();
    if (!newReport.title.trim() || !newReport.company_name.trim() || !newReport.description.trim()) {
      setSubmitError("Please fill in the required fields: Title, Company Name, and Description.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await api.submitReport(newReport);
      setShowSubmitModal(false);
      setNewReport({
        title: "",
        company_name: "",
        scam_type: "registration_fee",
        contact_phone: "",
        contact_email: "",
        website_url: "",
        demanded_amount: "",
        description: "",
        evidence_snippet: ""
      });
      loadReports();
    } catch (err) {
      setSubmitError(err.message || "Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Community Scam Intelligence Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Crowdsourced database of verified recruitment fraud, impersonations, and fee extortion schemes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report a Scam</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, title, or keywords..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button type="submit" className="text-xs font-bold text-blue-600 px-2 py-1">
            Search
          </button>
        </form>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {["all", "registration_fee", "task_scam", "fake_offer", "impersonation"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "all" ? "All Reports" : type.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading verified scam reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-2">
          <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Scam Reports Found</h3>
          <p className="text-xs text-slate-500">No reports matched your current filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                    {report.scam_type.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {report.title}
                </h3>

                <div className="text-xs font-semibold text-slate-600">
                  Target Company: <strong className="text-slate-800">{report.company_name}</strong>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {report.description}
                </p>

                {report.demanded_amount && (
                  <div className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Loss Demanded: {report.demanded_amount}</span>
                  </div>
                )}

                {/* Masked / Anonymized Contact Snippets */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                  {report.contact_phone && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-slate-400" /> {report.contact_phone}
                    </span>
                  )}
                  {report.contact_email && (
                    <span className="flex items-center gap-1 font-mono">
                      <Mail className="w-3 h-3 text-slate-400" /> {report.contact_email}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm / Upvote ({report.upvotes})</span>
                </button>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  ✓ Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">File a Community Scam Report</h3>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateReport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Report Title *</label>
                <input
                  type="text"
                  required
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="e.g. Demanded ₹1500 Registration fee for remote typing job"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Group Claimed *</label>
                  <input
                    type="text"
                    required
                    value={newReport.company_name}
                    onChange={(e) => setNewReport({ ...newReport, company_name: e.target.value })}
                    placeholder="e.g. Global Tech Jobs"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scam Archetype</label>
                  <select
                    value={newReport.scam_type}
                    onChange={(e) => setNewReport({ ...newReport, scam_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="registration_fee">Registration / Deposit Fee</option>
                    <option value="task_scam">Telegram / Rating Task Scam</option>
                    <option value="fake_offer">Forged Offer Letter</option>
                    <option value="impersonation">Brand Impersonation (MNC)</option>
                    <option value="fake_internship">Unpaid / Paid Internship Trap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Phone</label>
                  <input
                    type="text"
                    value={newReport.contact_phone}
                    onChange={(e) => setNewReport({ ...newReport, contact_phone: e.target.value })}
                    placeholder="e.g. +91-9876543210"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Recruiter Email</label>
                  <input
                    type="text"
                    value={newReport.contact_email}
                    onChange={(e) => setNewReport({ ...newReport, contact_email: e.target.value })}
                    placeholder="e.g. hr.verify@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Demanded / Lost</label>
                <input
                  type="text"
                  value={newReport.demanded_amount}
                  onChange={(e) => setNewReport({ ...newReport, demanded_amount: e.target.value })}
                  placeholder="e.g. ₹2,500 or $50 USDT"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Incident Description & Evidence *</label>
                <textarea
                  required
                  rows={4}
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Explain what happened: what message was received, which payment methods were demanded, and how the scam proceeded..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none resize-y"
                ></textarea>
              </div>

              <p className="text-[11px] text-slate-400">
                🔒 Privacy: Contact details are analyzed for syndicate detection and never shared publicly without masking.
              </p>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow"
                >
                  {submitting ? "Submitting..." : "Publish Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
