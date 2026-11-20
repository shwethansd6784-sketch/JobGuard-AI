// JobGuard AI - Content Script
// Extracts job details with user consent when requested by the popup

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_job_info") {
    try {
      const extracted = extractPageDetails();
      sendResponse({ success: true, data: extracted });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  }
  return true; // Keep channel open for async response
});

function extractPageDetails() {
  const url = window.location.href;
  const pageTitle = document.title || "";
  let jobTitle = "";
  let company = "";
  let description = "";
  let salary = "";
  let location = "";

  // 1. LinkedIn Job Posting
  if (url.includes("linkedin.com")) {
    jobTitle = document.querySelector(".job-details-jobs-unified-top-card__job-title, .top-card-layout__title, h1")?.innerText?.trim() || "";
    company = document.querySelector(".job-details-jobs-unified-top-card__company-name, .topcard__org-name-link, .job-details-jobs-unified-top-card__primary-description a")?.innerText?.trim() || "";
    description = document.querySelector("#job-details, .show-more-less-html__markup, .description__text")?.innerText?.trim() || "";
    salary = document.querySelector(".job-details-jobs-unified-top-card__job-insight:has(.job-details-jobs-unified-top-card__job-insight-view-model-secondary)")?.innerText?.trim() || "";
  }
  // 2. Indeed Job Posting
  else if (url.includes("indeed.com")) {
    jobTitle = document.querySelector("h1.jobsearch-JobInfoHeader-title, h1")?.innerText?.trim() || "";
    company = document.querySelector("[data-company-name='true'], .jobsearch-CompanyInfoContainer a")?.innerText?.trim() || "";
    description = document.querySelector("#jobDescriptionText")?.innerText?.trim() || "";
    salary = document.querySelector("#salaryInfoAndJobType, .jobsearch-JobMetadataHeader-item")?.innerText?.trim() || "";
  }
  // 3. Internshala
  else if (url.includes("internshala.com")) {
    jobTitle = document.querySelector(".profile_on_detail_page, h1")?.innerText?.trim() || "";
    company = document.querySelector(".link_display_like_text, .company_name")?.innerText?.trim() || "";
    description = document.querySelector(".internship_details, .job_details")?.innerText?.trim() || "";
    salary = document.querySelector(".stipend, .salary")?.innerText?.trim() || "";
  }
  // 4. Naukri
  else if (url.includes("naukri.com")) {
    jobTitle = document.querySelector(".styles_jd-header-title__rZwM1, h1")?.innerText?.trim() || "";
    company = document.querySelector(".styles_jd-header-comp-name__MvqAI a, .company-name")?.innerText?.trim() || "";
    description = document.querySelector(".styles_JDC__dang-inner-html__h0K4t, .dang-inner-html")?.innerText?.trim() || "";
    salary = document.querySelector(".styles_jhc__salary__jdfEC, .salary")?.innerText?.trim() || "";
  }
  // 5. Generic Fallback
  else {
    const h1 = document.querySelector("h1")?.innerText?.trim() || "";
    jobTitle = h1 || pageTitle.split("-")[0]?.split("|")[0]?.trim() || "";

    // Search common class patterns
    company = document.querySelector("[class*='company'], [class*='employer'], [class*='org']")?.innerText?.trim() || "";
    description = document.querySelector("[class*='job-desc'], [class*='description'], article, main")?.innerText?.slice(0, 4000)?.trim() || "";
    salary = document.querySelector("[class*='salary'], [class*='stipend'], [class*='compensation']")?.innerText?.trim() || "";
    location = document.querySelector("[class*='location'], [class*='city']")?.innerText?.trim() || "";
  }

  // Fallback description if empty
  if (!description || description.length < 50) {
    const bodyText = document.body.innerText;
    description = bodyText.slice(0, 3000);
  }

  return {
    job_title: jobTitle.slice(0, 150),
    company_name: company.slice(0, 150),
    job_description: description.slice(0, 6000),
    salary_offered: salary.slice(0, 100),
    job_location: location.slice(0, 100),
    job_url: url
  };
}
