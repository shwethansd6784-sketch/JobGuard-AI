import React, { useState } from "react";
import { Shield, Phone, Mail, Building2, Briefcase, AlertOctagon } from "lucide-react";

export function NetworkGraph({ nodes = [], edges = [], warnings = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  // Position nodes radially or in layered layout if coordinates not preset
  const width = 640;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;

  // Compute 2D coordinates for nodes
  const nodePositions = {};
  const total = nodes.length;

  nodes.forEach((n, idx) => {
    if (idx === 0) {
      // Center root node
      nodePositions[n.id] = { x: centerX, y: centerY };
    } else {
      const angle = ((idx - 1) / Math.max(total - 1, 1)) * 2 * Math.PI;
      const radius = 130 + (idx % 2 === 0 ? 30 : -20);
      nodePositions[n.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  });

  function getNodeColor(risk, type) {
    if (risk === "critical" || risk === "high") return "#ef4444";
    if (risk === "medium") return "#f59e0b";
    if (type === "company") return "#2563eb";
    if (type === "phone" || type === "email") return "#8b5cf6";
    return "#10b981";
  }

  function getNodeIcon(type) {
    if (type === "phone") return <Phone className="w-3.5 h-3.5 text-white" />;
    if (type === "email") return <Mail className="w-3.5 h-3.5 text-white" />;
    if (type === "company") return <Building2 className="w-3.5 h-3.5 text-white" />;
    if (type === "scam_report") return <AlertOctagon className="w-3.5 h-3.5 text-white" />;
    return <Briefcase className="w-3.5 h-3.5 text-white" />;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-sm tracking-wide text-slate-100">
            Recruiter Connection Intelligence Graph
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Risk</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Company</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Contact</span>
        </div>
      </div>

      <div className="relative bg-slate-950/70 rounded-lg border border-slate-800/80 overflow-hidden flex justify-center">
        <svg width={width} height={height} className="select-none max-w-full">
          {/* Edges */}
          {edges.map((e, idx) => {
            const src = nodePositions[e.source];
            const tgt = nodePositions[e.target];
            if (!src || !tgt) return null;
            const isHighlight = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);
            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlight ? "#00d2ff" : "#334155"}
                  strokeWidth={isHighlight ? 2.5 : 1.2}
                  strokeDasharray={e.label?.includes("Report") ? "4,4" : "none"}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const pos = nodePositions[n.id] || { x: centerX, y: centerY };
            const isSelected = selectedNode?.id === n.id;
            const color = getNodeColor(n.risk, n.type);
            const radius = n.id.startsWith("target") ? 22 : 16;

            return (
              <g
                key={n.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(n)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {/* Glow ring on selection */}
                {isSelected && (
                  <circle r={radius + 6} fill="none" stroke="#00d2ff" strokeWidth="2.5" strokeDasharray="3,3" />
                )}
                {/* Node Circle */}
                <circle
                  r={radius}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  className="shadow-md"
                />
                {/* Node Label */}
                <text
                  y={radius + 14}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  className="pointer-events-none drop-shadow"
                >
                  {n.label.length > 18 ? n.label.slice(0, 16) + "…" : n.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-cyan-500/40 rounded-lg p-3 backdrop-blur text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>{selectedNode.label}</span>
                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-cyan-800">
                  {selectedNode.type}
                </span>
              </div>
              <p className="text-slate-400 mt-0.5">
                Risk Classification: <strong className="text-rose-400 uppercase">{selectedNode.risk}</strong> • Click any connected node to trace syndicate links.
              </p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded border border-slate-700"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Syndicate Alerts */}
      {warnings && warnings.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {warnings.map((w, idx) => (
            <div
              key={idx}
              className={`text-xs p-2.5 rounded-lg border flex items-start gap-2 ${
                w.includes("Warning") || w.includes("Alert")
                  ? "bg-rose-950/30 border-rose-800/60 text-rose-200"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-300"
              }`}
            >
              <span className="text-sm">⚠️</span>
              <p className="leading-relaxed">{w}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
