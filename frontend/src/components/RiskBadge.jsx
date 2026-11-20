import React from "react";
import { ShieldCheck, AlertTriangle, AlertOctagon, Info } from "lucide-react";

export function RiskBadge({ category, score, size = "md" }) {
  const cat = (category || "LOW").toUpperCase();
  
  let bg = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let icon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
  let label = "LOW RISK";

  if (cat === "MEDIUM") {
    bg = "bg-amber-50 text-amber-700 border-amber-200";
    icon = <Info className="w-4 h-4 text-amber-600" />;
    label = "MEDIUM RISK";
  } else if (cat === "HIGH") {
    bg = "bg-orange-50 text-orange-700 border-orange-200";
    icon = <AlertTriangle className="w-4 h-4 text-orange-600" />;
    label = "HIGH RISK";
  } else if (cat === "CRITICAL") {
    bg = "bg-rose-50 text-rose-700 border-rose-200";
    icon = <AlertOctagon className="w-4 h-4 text-rose-600" />;
    label = "CRITICAL RISK";
  }

  const sizeClasses = size === "lg" 
    ? "px-3.5 py-1.5 text-sm font-bold gap-2" 
    : size === "sm"
    ? "px-2 py-0.5 text-xs font-semibold gap-1"
    : "px-2.5 py-1 text-xs font-bold gap-1.5";

  return (
    <span className={`inline-flex items-center rounded-full border ${bg} ${sizeClasses} shadow-sm transition-all`}>
      {icon}
      <span>{label}</span>
      {score !== undefined && score !== null && (
        <span className="opacity-75 font-mono">({Math.round(score)}/100)</span>
      )}
    </span>
  );
}
