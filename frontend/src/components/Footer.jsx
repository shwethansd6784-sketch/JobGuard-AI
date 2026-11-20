import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, PhoneCall, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs">
      {/* Alert Ribbon */}
      <div className="bg-blue-950/60 border-b border-blue-900/50 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-blue-200">
            <PhoneCall className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>
              <strong>Fallen victim to a recruitment scam?</strong> Report immediately to the National Cyber Crime Reporting Portal.
            </span>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            cybercrime.gov.in (Helpline: 1930) <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>JobGuard AI</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Intelligent, explainable multi-factor AI safety shield protecting students and job seekers against fraudulent internships, fake recruiters, and recruitment scams.
            </p>
            <div className="text-[11px] text-slate-500">
              Built with Scikit-learn, FastAPI, React & Chrome MV3.
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Safety Modules
            </h4>
            <ul className="space-y-2">
              <li><Link to="/analyzer" className="hover:text-cyan-400 transition-colors">Job Advertisement Analyzer</Link></li>
              <li><Link to="/scanner" className="hover:text-cyan-400 transition-colors">Screenshot & WhatsApp Scanner</Link></li>
              <li><Link to="/offer-letter" className="hover:text-cyan-400 transition-colors">Offer Letter Verification</Link></li>
              <li><Link to="/recruiter-intel" className="hover:text-cyan-400 transition-colors">Recruiter Connection Graph</Link></li>
            </ul>
          </div>

          {/* Intelligence & Community */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Intelligence & Tools
            </h4>
            <ul className="space-y-2">
              <li><Link to="/trends" className="hover:text-cyan-400 transition-colors">Emerging Scam Dashboard</Link></li>
              <li><Link to="/community" className="hover:text-cyan-400 transition-colors">Community Scam Reports</Link></li>
              <li><Link to="/extension" className="hover:text-cyan-400 transition-colors">Browser Extension Shield</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">Safety Guidelines & Red Flags</Link></li>
            </ul>
          </div>

          {/* Legal / Disclaimer */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Ethical & Safety Notice
            </h4>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              JobGuard AI delivers explainable probabilistic risk assessments based on NLP and historical indicators. Risk scores do not constitute definitive legal proof of fraud. Never share financial details or pay fees for employment.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 JobGuard AI. Developed for engineering students and job seekers worldwide.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for transparency and explainability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
