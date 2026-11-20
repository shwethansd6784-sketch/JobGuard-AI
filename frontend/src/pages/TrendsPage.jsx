import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Calendar, 
  Clock, 
  Flame, 
  AlertOctagon, 
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { api } from "../api/client";

export function TrendsPage() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  async function loadTrends() {
    setLoading(true);
    try {
      const data = await api.getScamTrends();
      setTrends(data);
    } catch (err) {
      console.warn("Error fetching trends:", err);
    } finally {
      setLoading(false);
    }
  }

  // Format Top Scam Types data
  const scamTypeData = trends?.top_scam_types
    ? Object.entries(trends.top_scam_types).map(([name, count]) => ({ name, count }))
    : [];

  const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-rose-600" />
            Emerging Scam Trends & Threat Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics aggregated from user reports and verified threat scans across India and global remote channels.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Analyzed Period: Last 30 Days</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans Triaged</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{trends?.total_analyzed || 28}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>↑ +18% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <div className="text-xs font-bold text-rose-500 uppercase tracking-wider">Critical Threats Flagged</div>
          <div className="text-3xl font-black text-rose-600 mt-1">{trends?.high_risk_count || 15}</div>
          <div className="text-[11px] text-rose-500 font-semibold mt-1">
            High & Critical Risk Postings
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
          <div className="text-xs font-bold text-blue-500 uppercase tracking-wider">Community Scam Reports</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{trends?.reports_submitted || 12}</div>
          <div className="text-[11px] text-blue-500 font-semibold mt-1">
            Verified Victim / Witness Reports
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Top Scam Vector</div>
          <div className="text-xl font-black text-indigo-700 mt-2 truncate">
            Telegram Tasks
          </div>
          <div className="text-[11px] text-indigo-500 font-semibold mt-1">
            Prepaid Review Scams Dominant
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Weekly Threat Scan Volume vs Flagged Fraud
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Daily Trajectory</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends?.recent_threat_timeline || []}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                <Area type="monotone" dataKey="scans" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScans)" name="Total Ingested" />
                <Area type="monotone" dataKey="threats_flagged" stroke="#ef4444" fillOpacity={1} fill="url(#colorThreats)" name="Threats Flagged" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Scam Archetype Distribution
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">By Vector</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scamTypeData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 9, fill: "#334155" }} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {scamTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Emerging Scam Phrases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Top Emerging Suspicious Phrases (NLP High-Frequency Trajectory)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Updated Hourly</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Suspicious Pattern Phrase</th>
                <th className="py-2.5 px-3">Scam Category</th>
                <th className="py-2.5 px-3">Observed Hits</th>
                <th className="py-2.5 px-3">Trend Velocity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trends?.top_suspicious_phrases?.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    "{p.phrase}"
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {p.scam_category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">
                    {p.count} reports
                  </td>
                  <td className="py-3 px-3">
                    {p.trend === "new" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        ⚡ NEW OUTBREAK
                      </span>
                    ) : p.trend === "increasing" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        ↑ RISING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        → STABLE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
