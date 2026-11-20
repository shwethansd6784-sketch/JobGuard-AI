import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { JobAnalyzerPage } from "./pages/JobAnalyzerPage";
import { ScannerPage } from "./pages/ScannerPage";
import { OfferLetterPage } from "./pages/OfferLetterPage";
import { RecruiterIntelPage } from "./pages/RecruiterIntelPage";
import { TrendsPage } from "./pages/TrendsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { CommunityReportsPage } from "./pages/CommunityReportsPage";
import { ExtensionInfoPage } from "./pages/ExtensionInfoPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AboutSafetyPage } from "./pages/AboutSafetyPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/analyzer" element={<JobAnalyzerPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/offer-letter" element={<OfferLetterPage />} />
              <Route path="/recruiter-intel" element={<RecruiterIntelPage />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/community" element={<CommunityReportsPage />} />
              <Route path="/extension" element={<ExtensionInfoPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/about" element={<AboutSafetyPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
