import React, { useState } from "react";
import { 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Lock, 
  Search, 
  Zap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export function ExtensionInfoPage() {
  // Live Simulator state inside the page
  const [simJobTitle, setSimJobTitle] = useState("Online Data Entry Associate");
  const [simCompany, setSimCompany] = useState("Apex Global Services");
  const [simDesc, setSimDesc] = useState("Direct selection without interview. Pay ₹1,500 registration fee.");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  function runSimulatedCheck() {
    setSimLoading(true);
    setTimeout(() => {
      setSimLoading(false);
      setSimResult({
        score: 85,
        category: "HIGH",
        explanation: "Critical fee demand identified ('registration fee'). Recruiter uses disposable channels.",
        indicators: ["Monetary demand detected", "Direct selection without interview", "Free webmail domain"]
      });
    }, 900);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-1">
          <Compass className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          JobGuard AI Real-Time Browser Extension
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Inspect job vacancies directly as you browse LinkedIn, Indeed, Naukri, or Internshala with zero privacy intrusion. Built on Google Chrome Manifest V3.
        </p>
      </div>

      {/* Grid: Installation Guide on Left, Interactive Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 4-Step Installation Guide (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Setup Instructions
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              How to Install in 60 Seconds
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Open Browser Extensions Page</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Open your Chromium browser (Google Chrome, Microsoft Edge, Brave, or Opera) and navigate to:
                </p>
                <code className="inline-block px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-blue-700 font-bold">
                  chrome://extensions/
                </code>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Enable "Developer Mode"</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In the top-right corner of the Extensions dashboard, toggle the switch labeled <strong>Developer mode</strong> to ON.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Click "Load Unpacked"</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Click the <strong>Load unpacked</strong> button in the top left, and choose the <code>browser-extension</code> directory from this project:
                </p>
                <div className="p-2 rounded bg-white border border-slate-300 font-mono text-[11px] text-slate-700">
                  📁 JobGuard-AI/browser-extension/
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-900 text-sm">Pin to Toolbar & Protect Yourself</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Click the puzzle icon in Chrome and pin <strong>JobGuard AI</strong>. Whenever you visit a job posting, click the shield to inspect safety in real time!
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Strict Privacy Guarantee</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              JobGuard AI never runs background keyloggers, never snoops on personal browsing history, and never transmits data until you explicitly click "Scan Current Page".
            </p>
          </div>
        </div>

        {/* Right: Live Interactive Extension Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Try It Right Now
            </span>
            <h3 className="text-base font-black text-slate-900">
              Live Interactive Extension Popup Simulator
            </h3>
          </div>

          {/* Phone / Extension Window Frame */}
          <div className="max-w-xs mx-auto bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl p-4 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <div>
                  <div className="text-xs font-bold text-cyan-400">JobGuard AI Shield</div>
                  <div className="text-[10px] text-slate-400">Real-time Scam Inspector</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" title="Connected"></span>
            </div>

            <div className="p-2 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              🔒 Privacy-first: analyzes page only upon explicit activation.
            </div>

            {!simResult ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={simJobTitle}
                  onChange={(e) => setSimJobTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white"
                  placeholder="Job Title"
                />
                <textarea
                  rows={3}
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white resize-none"
                  placeholder="Job description..."
                ></textarea>

                <button
                  type="button"
                  onClick={runSimulatedCheck}
                  disabled={simLoading}
                  className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5"
                >
                  {simLoading ? "Inspecting DOM..." : "⚡ Scan Page Simulator"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in-50">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                  <div className="text-2xl font-black text-rose-500">{simResult.score}/100</div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      {simResult.category} RISK
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">Threat Level</div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-tight">
                  {simResult.explanation}
                </p>

                <div className="space-y-1">
                  {simResult.indicators.map((ind, i) => (
                    <div key={i} className="text-[10px] px-2 py-1 rounded bg-rose-950/40 border border-rose-800 text-rose-300">
                      ⚠️ {ind}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    to="/analyzer"
                    className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Open Full Web Report <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setSimResult(null)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500">
              Chrome MV3 Production Build v1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
