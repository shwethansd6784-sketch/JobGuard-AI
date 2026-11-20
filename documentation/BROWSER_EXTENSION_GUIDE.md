# JobGuard AI Browser Extension — Setup & Architecture Guide

## Overview

The JobGuard AI Browser Extension is a **Manifest V3** security tool that inspects active job postings in Chromium browsers (Chrome, Edge, Brave, Opera).

## Key Privacy Features

- **Zero Passive Scraping**: The extension runs strictly upon user invocation. It does not monitor tabs, track browsing history, or log keystrokes.
- **Client-Side Extraction**: DOM extraction runs via an on-demand content script when the user clicks "Scan Current Page".
- **Real-Time Backend Verification**: Extracted job title, description, and compensation details are transmitted securely to the local JobGuard backend (`http://localhost:8000/api/analyze/job`).

## Installation Steps

1. Open your browser and go to `chrome://extensions/`
2. Enable the **Developer mode** toggle in the top-right corner.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the `browser-extension` folder inside this project directory:
   ```
   JobGuard AI/browser-extension/
   ```
5. Pin **JobGuard AI** to your browser toolbar.

## Supported Job Portals

The content script contains native DOM selectors for:
- **LinkedIn Jobs** (`linkedin.com/jobs/*`)
- **Indeed** (`indeed.com/viewjob*`)
- **Naukri** (`naukri.com/*`)
- **Internshala** (`internshala.com/*`)
- **Generic Fallback**: Microdata and heading heuristics for any career portal.
