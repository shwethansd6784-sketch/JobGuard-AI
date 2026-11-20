import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Network, 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Phone, 
  Mail, 
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { api } from "../api/client";
import { NetworkGraph } from "../components/NetworkGraph";

export function RecruiterIntelPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("+91-9876543210");
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], warnings: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("query");
    if (q) {
      setQuery(q);
      loadGraph(q);
    } else {
      loadGraph(query);
    }
  }, [searchParams]);

  async function loadGraph(target) {
    if (!target.trim()) return;
    setLoading(true);
    setError("");

    try {
      const data = await api.getRecruiterGraph(target.trim());
      setGraphData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch recruiter network intelligence.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadGraph(query);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="w-7 h-7 text-indigo-600" />
            Recruiter Connection Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect relationships between burner phone numbers, emails, and company names used across disparate fraudulent listings.
          </p>
        </div>

        {/* Demo Syndicate Queries */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Trace Syndicate:</span>
          <button
            type="button"
            onClick={() => { setQuery("+91-9876543210"); loadGraph("+91-9876543210"); }}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
          >
            🔥 Multi-Company Phone (+91-9876543210)
          </button>
          <button
            type="button"
            onClick={() => { setQuery("careers.apex.data.verify@gmail.com"); loadGraph("careers.apex.data.verify@gmail.com"); }}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
          >
            ✉️ Apex Webmail
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter recruiter phone, email, company name, or domain..."
          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
          <span>Trace Connections</span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Interactive Network Graph */}
      <div className="space-y-4">
        <NetworkGraph
          nodes={graphData.nodes || []}
          edges={graphData.edges || []}
          warnings={graphData.warnings || []}
        />
      </div>

      {/* Intelligence Explainer & Ethics Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            How Recruiter Syndicate Analysis Works
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recruitment scam networks rarely create new contact details for every listing. They recycle burner SIM cards and free webmails across unrelated job posts (e.g., claiming to be Tata Aviation one day, and Agoda Hotel Reviews the next). By graphing these shared entities, JobGuard AI exposes the underlying syndicate before they can strike again.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Ethical Intelligence Principles
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            In accordance with cybersecurity guidelines, JobGuard AI never labels an individual fraudulent based on a single unverified report. Graph node ratings reflect correlation frequency and community consensus. Contact information from private user histories is strictly anonymized.
          </p>
        </div>
      </div>
    </div>
  );
}
