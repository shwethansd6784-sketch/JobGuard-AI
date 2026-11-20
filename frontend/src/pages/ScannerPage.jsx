import React, { useState } from "react";
import { 
  MessageSquare, 
  Upload, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  RefreshCw,
  Phone,
  Mail,
  AtSign,
  CreditCard
} from "lucide-react";
import { api } from "../api/client";
import { RiskBadge } from "../components/RiskBadge";
import { RiskScoreGauge } from "../components/RiskScoreGauge";

export function ScannerPage() {
  const [mode, setMode] = useState("text"); // "text" or "screenshot"
  const [messageText, setMessageText] = useState("");
  const [sourceChannel, setSourceChannel] = useState("WhatsApp");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleScan(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      if (mode === "text") {
        if (!messageText.trim()) throw new Error("Please enter or paste the message text.");
        const res = await api.scanMessage({
          message_text: messageText,
          source_channel: sourceChannel
        });
        setResult(res);
      } else {
        if (!imageFile) throw new Error("Please select a screenshot image to upload.");
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("source_channel", sourceChannel);
        const res = await api.scanScreenshot(formData);
        setResult(res);
      }
    } catch (err) {
      setError(err.message || "Failed to scan message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function loadSampleMessage(type) {
    setMode("text");
    if (type === "whatsapp_scam") {
      setSourceChannel("WhatsApp");
      setMessageText("Hello dear! I am HR Sneha from Global HR Alliance. We found your profile on job portal. We have urgent opening for Part Time Google Maps review specialist. Work 30 mins daily, earn ₹2,500 daily. Directly join without interview. Registration fee ₹999 refundable with first task. Pay via UPI: hr.sneha@ybl and send screenshot on this WhatsApp.");
    } else if (type === "telegram_task") {
      setSourceChannel("Telegram");
      setMessageText("Congratulations! Your task account is approved. Complete 5 YouTube like and subscribe tasks to earn ₹750. Contact mentor @VIP_Global_Task_Manager on Telegram to claim bonus. Deposit ₹1000 for VIP account tier unlock.");
    } else if (type === "hindi_scam") {
      setSourceChannel("WhatsApp");
      setMessageText("नमस्ते! घर बैठे पैकिंग का काम करके रोजाना ₹3000 कमाएं। बिना किसी इंटरव्यू सीधी भर्ती। सामग्री डिलीवरी से पहले ₹1200 पंजीकरण शुल्क यूपीआई द्वारा जमा करें। संपर्क केवल व्हाट्सएप पर करें।");
    } else if (type === "kannada_scam") {
      setSourceChannel("WhatsApp");
      setMessageText("ನಮಸ್ಕಾರ! ಮನೆಯಲ್ಲೇ ಕುಳಿತು ಮೊಬೈಲ್ ಮೂಲಕ ಕೆಲಸ ಮಾಡಿ ದಿನಕ್ಕೆ ₹2500 ಗಳಿಸಿ. ಯಾವುದೇ ಸಂದರ್ಶನವಿಲ್ಲ. ನೋಂದಣಿ ಶುಲ್ಕ ₹1500 ಪಾವತಿಸಿ. ಟೆಲಿಗ್ರಾಂ ಮೂಲಕ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            Screenshot & Message Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect recruitment fraud across WhatsApp, Telegram, SMS, and chat screenshots in English, Hindi, and Kannada.
          </p>
        </div>

        {/* Quick sample pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sample:</span>
          <button
            type="button"
            onClick={() => loadSampleMessage("whatsapp_scam")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            WhatsApp Fee Scam
          </button>
          <button
            type="button"
            onClick={() => loadSampleMessage("telegram_task")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          >
            Telegram Task Scam
          </button>
          <button
            type="button"
            onClick={() => loadSampleMessage("hindi_scam")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
          >
            हिंदी (Hindi)
          </button>
          <button
            type="button"
            onClick={() => loadSampleMessage("kannada_scam")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          >
            ಕನ್ನಡ (Kannada)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("text")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "text"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              💬 Paste Message Text
            </button>
            <button
              type="button"
              onClick={() => setMode("screenshot")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "screenshot"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📷 Upload Screenshot (OCR)
            </button>
          </div>

          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Platform / Channel</label>
              <select
                value={sourceChannel}
                onChange={(e) => setSourceChannel(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="SMS">SMS / Text Message</option>
                <option value="Email">Email Message</option>
                <option value="LinkedIn InMail">LinkedIn InMail</option>
              </select>
            </div>

            {mode === "text" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Content (English, Hindi, Kannada, or Hinglish)
                </label>
                <textarea
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste the suspicious recruiter message, SMS, or Telegram task invite..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                ></textarea>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Screenshot Image (.PNG, .JPG)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="screenshotInput"
                    className="hidden"
                  />
                  <label htmlFor="screenshotInput" className="cursor-pointer space-y-2 block">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-semibold text-slate-700">
                      {imageFile ? imageFile.name : "Click to browse screenshot image"}
                    </div>
                    <p className="text-[11px] text-slate-400">PNG, JPG, or JPEG up to 10MB</p>
                  </label>
                </div>

                {previewUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Text & Optical OCR...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Scan Message for Scam Signals</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6 animate-in fade-in-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                    Scanner Assessment
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-slate-800">Language: {result.detected_language}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-blue-600 font-semibold">{sourceChannel}</span>
                  </div>
                </div>
                <RiskBadge category={result.risk_category} score={result.risk_score} size="lg" />
              </div>

              {/* Meter */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <RiskScoreGauge score={result.risk_score} category={result.risk_category} size={170} />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Threat Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{result.explanation}</p>
                </div>
              </div>

              {/* Detected Tactics */}
              {result.detected_scam_tactics?.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Identified Scam Tactics
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {result.detected_scam_tactics.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        ⚠️ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Flagged Phrases */}
              {result.flagged_phrases?.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Flagged High-Risk Keywords
                  </h5>
                  <div className="space-y-1">
                    {result.flagged_phrases.map((p, idx) => (
                      <div key={idx} className="text-xs px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2">
                        <span className="text-amber-600 font-bold">»</span>
                        <span>"{p}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Contacts */}
              {result.extracted_contacts && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Extracted Contact Identifiers
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {result.extracted_contacts.phones?.length > 0 && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone Numbers
                        </div>
                        <div className="text-slate-600 mt-1 font-mono">{result.extracted_contacts.phones.join(", ")}</div>
                      </div>
                    )}
                    {result.extracted_contacts.upi_ids?.length > 0 && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> UPI Handles
                        </div>
                        <div className="text-slate-600 mt-1 font-mono">{result.extracted_contacts.upi_ids.join(", ")}</div>
                      </div>
                    )}
                    {result.extracted_contacts.telegram_handles?.length > 0 && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <AtSign className="w-3.5 h-3.5 text-cyan-600" /> Telegram Handles
                        </div>
                        <div className="text-slate-600 mt-1 font-mono">@{result.extracted_contacts.telegram_handles.join(", @")}</div>
                      </div>
                    )}
                    {result.extracted_contacts.emails?.length > 0 && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-purple-600" /> Email Addresses
                        </div>
                        <div className="text-slate-600 mt-1 font-mono">{result.extracted_contacts.emails.join(", ")}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Recommendation */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Immediate Safety Action
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">{result.recommended_action}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Message Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Paste a suspicious text message or upload a chat screenshot on the left to verify authenticity and extract concealed payment threats.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
