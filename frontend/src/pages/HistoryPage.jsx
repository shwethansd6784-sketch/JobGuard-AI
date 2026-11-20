import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, Search, AlertTriangle, ExternalLink, RefreshCw, FileText, Lock } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { RiskBadge } from "../components/RiskBadge";

export function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  async function loadHistory() {
    setLoading(true);
    try {
      const data = await api.getUserHistory();
      setHistory(data);
    } catch (err) {
      console.warn("Error loading user history:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to View Your Private History</h2>
        <p className="text-xs text-slate-500">
          Your analyzed job postings and uploaded documents are encrypted and kept strictly confidential.
        </p>
        <Link
          to="/auth"
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-blue-600" />
            My Private Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Private records for {user.full_name} ({user.email}). Only you can access these audit records.
          </p>
        </div>
        <Link
          to="/analyzer"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16 space-y-2">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Scans Recorded Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Whenever you analyze a job, the full 7-factor explanation is saved here for your future records.
          </p>
          <Link
            to="/analyzer"
            className="inline-block mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
          >
            Run First Scan
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Risk Rating</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.job_title}</td>
                  <td className="py-3 px-4 text-slate-600">{item.company_name}</td>
                  <td className="py-3 px-4 text-blue-600 font-medium">{item.detected_language}</td>
                  <td className="py-3 px-4">
                    <RiskBadge category={item.risk_category} score={item.risk_score} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">{selectedItem.job_title}</h3>
                <div className="text-xs text-slate-500">{selectedItem.company_name}</div>
              </div>
              <RiskBadge category={selectedItem.risk_category} score={selectedItem.risk_score} size="md" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="font-bold text-slate-700 uppercase tracking-wide">Explanation:</div>
              <p className="text-slate-600">{selectedItem.explanation}</p>
            </div>

            {selectedItem.suspicious_indicators?.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-bold text-rose-700">Flagged Indicators:</div>
                {selectedItem.suspicious_indicators.map((ind, i) => (
                  <div key={i} className="text-xs p-1.5 rounded bg-rose-50 text-rose-800">
                    • {ind}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
