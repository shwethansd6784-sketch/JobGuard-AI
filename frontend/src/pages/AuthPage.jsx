import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) throw new Error("Full name is required");
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate("/analyzer");
    } catch (err) {
      setError(err.message || "Authentication failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoAccount(demoEmail, demoPass) {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsRegister(false);
    setError("");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isRegister ? "Create Your JobGuard Account" : "Sign In to JobGuard AI"}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? "Join students and job seekers defending against recruitment fraud"
              : "Access your private analysis history and saved reports"}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Helper */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Demo Accounts (One-Click Fill)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("student@university.edu", "StudentPass123!")}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 transition-colors text-center"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@jobguard.ai", "AdminPass123!")}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-xs font-semibold text-blue-700 transition-colors text-center"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(""); }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(""); }}
                className="font-bold text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
