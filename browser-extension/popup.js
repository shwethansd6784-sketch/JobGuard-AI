// JobGuard AI - Extension Popup Logic
const API_BASE = "http://localhost:8000/api";
const WEB_BASE = "http://localhost:5173";

document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scanBtn");
  const manualToggleBtn = document.getElementById("manualToggleBtn");
  const cancelManualBtn = document.getElementById("cancelManualBtn");
  const manualAnalyzeBtn = document.getElementById("manualAnalyzeBtn");
  const recheckBtn = document.getElementById("recheckBtn");
  const retryBtn = document.getElementById("retryBtn");
  const openFullReportBtn = document.getElementById("openFullReportBtn");

  const actionPanel = document.getElementById("actionPanel");
  const manualPanel = document.getElementById("manualPanel");
  const loadingPanel = document.getElementById("loadingPanel");
  const resultPanel = document.getElementById("resultPanel");
  const errorPanel = document.getElementById("errorPanel");
  const backendStatusDot = document.getElementById("backendStatusDot");

  // Check backend health
  checkBackendHealth();

  scanBtn.addEventListener("click", () => {
    runPageInspection();
  });

  manualToggleBtn.addEventListener("click", () => {
    actionPanel.classList.add("hidden");
    manualPanel.classList.remove("hidden");
  });

  cancelManualBtn.addEventListener("click", () => {
    manualPanel.classList.add("hidden");
    actionPanel.classList.remove("hidden");
  });

  manualAnalyzeBtn.addEventListener("click", () => {
    const title = document.getElementById("manualTitle").value.trim();
    const company = document.getElementById("manualCompany").value.trim();
    const desc = document.getElementById("manualDesc").value.trim();

    if (!desc && !title) {
      alert("Please provide at least a job title or description.");
      return;
    }

    sendJobToAnalyzer({
      job_title: title || "Job Posting",
      company_name: company || "Undisclosed",
      job_description: desc || title,
      salary_offered: "",
      job_location: "Remote / Not Specified",
      job_url: ""
    });
  });

  recheckBtn.addEventListener("click", () => {
    resultPanel.classList.add("hidden");
    actionPanel.classList.remove("hidden");
  });

  retryBtn.addEventListener("click", () => {
    errorPanel.classList.add("hidden");
    actionPanel.classList.remove("hidden");
    checkBackendHealth();
  });

  async function checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: "GET" });
      if (res.ok) {
        backendStatusDot.classList.add("online");
        backendStatusDot.title = "JobGuard AI backend online";
      } else {
        backendStatusDot.classList.remove("online");
        backendStatusDot.title = "JobGuard AI backend unreachable";
      }
    } catch {
      backendStatusDot.classList.remove("online");
      backendStatusDot.title = "JobGuard AI backend offline";
    }
  }

  function runPageInspection() {
    actionPanel.classList.add("hidden");
    loadingPanel.classList.remove("hidden");
    document.getElementById("loadingMessage").textContent = "Extracting job details from active tab...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0]) {
        showError("Could not locate active browser tab.");
        return;
      }

      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: "extract_job_info" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // If content script was not injected (e.g. chrome:// or restricted page)
          console.warn("Script injection fallback:", chrome.runtime.lastError);
          // Try manual scripting executeScript as fallback
          chrome.scripting.executeScript(
            {
              target: { tabId: activeTab.id },
              func: () => {
                return {
                  job_title: document.title || "",
                  company_name: "",
                  job_description: document.body.innerText.slice(0, 3000),
                  salary_offered: "",
                  job_location: "",
                  job_url: window.location.href
                };
              }
            },
            (results) => {
              if (results && results[0] && results[0].result) {
                sendJobToAnalyzer(results[0].result);
              } else {
                showError("Unable to extract text from this page. Try 'Manual Text Check'.");
              }
            }
          );
          return;
        }

        sendJobToAnalyzer(response.data);
      });
    });
  }

  async function sendJobToAnalyzer(jobPayload) {
    loadingPanel.classList.remove("hidden");
    actionPanel.classList.add("hidden");
    manualPanel.classList.add("hidden");
    document.getElementById("loadingMessage").textContent = "Running AI ML classification & forensic scoring...";

    try {
      const res = await fetch(`${API_BASE}/analyze/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload)
      });

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }

      const data = await res.json();
      displayResults(data, jobPayload);
    } catch (err) {
      showError(err.message || "Failed to analyze job posting with backend.");
    }
  }

  function displayResults(data, jobPayload) {
    loadingPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");

    const score = Math.round(data.risk_score || 0);
    const category = (data.risk_category || "LOW").toUpperCase();

    const scoreEl = document.getElementById("riskScore");
    const badgeEl = document.getElementById("riskBadge");
    const meterEl = document.getElementById("meterFill");
    const summaryEl = document.getElementById("summaryText");
    const indicatorsList = document.getElementById("indicatorsList");

    scoreEl.textContent = `${score}/100`;
    badgeEl.textContent = `${category} RISK`;
    badgeEl.className = `risk-badge ${category.toLowerCase()}`;

    meterEl.style.width = `${Math.min(score, 100)}%`;
    if (score < 30) {
      meterEl.style.background = "#10b981";
    } else if (score < 60) {
      meterEl.style.background = "#f59e0b";
    } else {
      meterEl.style.background = "#ef4444";
    }

    summaryEl.textContent = data.explanation || "Risk calculated based on ML language patterns and contact indicators.";

    indicatorsList.innerHTML = "";
    if (data.suspicious_indicators && data.suspicious_indicators.length > 0) {
      data.suspicious_indicators.slice(0, 3).forEach(ind => {
        const pill = document.createElement("span");
        pill.className = "indicator-pill negative";
        pill.textContent = `⚠️ ${ind}`;
        indicatorsList.appendChild(pill);
      });
    }

    if (data.positive_indicators && data.positive_indicators.length > 0) {
      data.positive_indicators.slice(0, 2).forEach(ind => {
        const pill = document.createElement("span");
        pill.className = "indicator-pill positive";
        pill.textContent = `✓ ${ind}`;
        indicatorsList.appendChild(pill);
      });
    }

    // Link to full web app report
    const analysisId = data.id || "";
    openFullReportBtn.href = `${WEB_BASE}/analyzer?analysis_id=${encodeURIComponent(analysisId)}&title=${encodeURIComponent(jobPayload.job_title || "")}&company=${encodeURIComponent(jobPayload.company_name || "")}`;
  }

  function showError(msg) {
    loadingPanel.classList.add("hidden");
    actionPanel.classList.add("hidden");
    manualPanel.classList.add("hidden");
    resultPanel.classList.add("hidden");
    errorPanel.classList.remove("hidden");
    document.getElementById("errorText").textContent = msg;
  }
});
