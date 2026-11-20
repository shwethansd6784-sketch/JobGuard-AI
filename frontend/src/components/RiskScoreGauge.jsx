import React from "react";

export function RiskScoreGauge({ score = 0, category = "LOW", size = 200 }) {
  const cleanScore = Math.min(Math.max(Math.round(score), 0), 100);
  
  // Calculate angle for semi-circle gauge (-90 to +90 deg)
  const angle = -90 + (cleanScore / 100) * 180;

  let color = "#10b981"; // green
  if (cleanScore >= 30 && cleanScore < 60) {
    color = "#f59e0b"; // yellow
  } else if (cleanScore >= 60 && cleanScore < 80) {
    color = "#f97316"; // orange
  } else if (cleanScore >= 80) {
    color = "#ef4444"; // red
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <svg viewBox="0 0 200 130" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke={color}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * (cleanScore / 100))}
            style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
          />

          {/* Center Hub & Needle */}
          <g transform={`rotate(${angle} 100 110)`} style={{ transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <line x1="100" y1="110" x2="100" y2="40" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <polygon points="96,44 104,44 100,32" fill="#0f172a" />
          </g>
          <circle cx="100" cy="110" r="8" fill="#0f172a" />
          <circle cx="100" cy="110" r="4" fill="#ffffff" />

          {/* Zone Labels */}
          <text x="25" y="125" fontSize="9" fill="#64748b" fontWeight="600">0</text>
          <text x="94" y="24" fontSize="9" fill="#64748b" fontWeight="600">50</text>
          <text x="170" y="125" fontSize="9" fill="#64748b" fontWeight="600">100</text>
        </svg>

        {/* Center Text */}
        <div className="absolute inset-x-0 bottom-0 text-center">
          <div className="text-3xl font-extrabold tracking-tight" style={{ color }}>
            {cleanScore}<span className="text-sm font-semibold text-slate-500">/100</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {category} RISK
          </div>
        </div>
      </div>
    </div>
  );
}
