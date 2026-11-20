import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ShieldCheck, 
  Search, 
  MessageSquare, 
  FileText, 
  Network, 
  TrendingUp, 
  History, 
  Users, 
  Compass, 
  Settings, 
  HelpCircle,
  Menu,
  X,
  User as UserIcon,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const navLinks = [
    { to: "/analyzer", label: "Job Analyzer", icon: Search },
    { to: "/scanner", label: "Message Scanner", icon: MessageSquare },
    { to: "/offer-letter", label: "Offer Letter", icon: FileText },
    { to: "/recruiter-intel", label: "Recruiter Intel", icon: Network },
    { to: "/trends", label: "Scam Trends", icon: TrendingUp },
    { to: "/community", label: "Community", icon: Users },
    { to: "/history", label: "History", icon: History, authOnly: true },
    { to: "/extension", label: "Extension", icon: Compass },
    { to: "/about", label: "Safety Guide", icon: HelpCircle },
  ];

  if (isAdmin) {
    navLinks.push({ to: "/admin", label: "Admin", icon: Settings, adminOnly: true });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-800 bg-clip-text text-transparent">
                JobGuard<span className="text-blue-600 font-black">AI</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Scam Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.authOnly && !user) return null;
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 font-bold border border-blue-200"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & User Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/analyzer"
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              Check a Job Now
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{user.full_name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                Log in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            if (link.authOnly && !user) return null;
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-blue-600" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/analyzer"
              onClick={() => setMobileOpen(false)}
              className="w-full py-2.5 text-center rounded-lg text-sm font-bold bg-blue-600 text-white"
            >
              Check a Job Now
            </Link>
            {user ? (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
              >
                Log Out ({user.full_name})
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
