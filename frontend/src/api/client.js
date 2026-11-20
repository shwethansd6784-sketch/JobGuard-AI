// JobGuard AI - Frontend API Client
const API_BASE = "http://localhost:8000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("jobguard_token");
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Set application/json by default unless sending FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `Server error (${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => apiRequest("/auth/me", { method: "GET" }),

  // Job Analyzer
  analyzeJob: (data) => apiRequest("/analyze/job", { method: "POST", body: JSON.stringify(data) }),
  getUserHistory: () => apiRequest("/analyze/history", { method: "GET" }),
  getAnalysisById: (id) => apiRequest(`/analyze/${id}`, { method: "GET" }),

  // Scanner
  scanMessage: (data) => apiRequest("/scanner/message", { method: "POST", body: JSON.stringify(data) }),
  scanScreenshot: (formData) => apiRequest("/scanner/screenshot", { method: "POST", body: formData }),

  // Offer Letter
  verifyOfferLetter: (formData) => apiRequest("/offer-letter/verify", { method: "POST", body: formData }),

  // Recruiter Intel
  getRecruiterGraph: (query) => apiRequest(`/recruiter-intel/graph?query=${encodeURIComponent(query)}`, { method: "GET" }),

  // Trends
  getScamTrends: () => apiRequest("/trends/summary", { method: "GET" }),

  // Community Reports
  getCommunityReports: (scamType = "", query = "") => {
    let url = "/reports/?";
    if (scamType) url += `scam_type=${encodeURIComponent(scamType)}&`;
    if (query) url += `query=${encodeURIComponent(query)}`;
    return apiRequest(url, { method: "GET" });
  },
  submitReport: (data) => apiRequest("/reports/", { method: "POST", body: JSON.stringify(data) }),
  upvoteReport: (id) => apiRequest(`/reports/${id}/upvote`, { method: "POST" }),

  // Admin
  getAdminStats: () => apiRequest("/admin/stats", { method: "GET" }),
  retrainModel: () => apiRequest("/admin/retrain", { method: "POST" })
};
