"use client";

import React, { useState } from "react";
import { siteContent } from "@/content/siteContent";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function checkGibberish(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  if (/(.)\1{4,}/.test(clean)) return true;
  const mashPatterns = [/asdfgh/i, /qwerty/i, /zxcvbn/i, /hjkl;'/i, /123456/];
  if (mashPatterns.some((p) => p.test(clean))) return true;
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length >= 7 && !/[aeiouyAEIOUY]/i.test(word)) return true;
  }
  return false;
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Industrial Engineering Enquiry",
    message: "",
    honeypot: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkGibberish(formData.name)) {
      setStatus("error");
      setErrorMessage("Please enter a valid full name without random or repetitive characters.");
      return;
    }

    if (checkGibberish(formData.message)) {
      setStatus("error");
      setErrorMessage("Your message appears to contain repetitive or unrecognized characters. Please provide clear details.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "General Industrial Engineering Enquiry",
          message: "",
          honeypot: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error connecting to the submission service. Please email us directly.");
    }
  };

  return (
    <div className="bg-[#F5FAFC] p-8 sm:p-10 rounded-[24px] border border-[#E4EDF2] shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#20262B] mb-2">
          Send an Official Enquiry
        </h3>
        <p className="text-sm text-[#64727C]">
          Direct routing to our commercial operations team at {siteContent.company.email}.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-8 rounded-[20px] bg-white border border-[#0CA3DC]/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#0CA3DC]/10 text-[#0CA3DC] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-xl font-bold text-[#20262B]">Enquiry Received</h4>
          <p className="text-sm text-[#64727C] max-w-md mx-auto">
            Thank you for reaching out to MEDDY GLOBAL SOLUTIONS LTD. Our team will review your technical requirements and respond promptly to your provided email address.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-4 px-6 py-2.5 rounded-full bg-[#0CA3DC] text-white text-xs font-semibold hover:bg-[#087FB5] transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Honeypot field (hidden from screen readers & users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={handleChange}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#20262B]">
              Full Name <span className="text-[#0CA3DC]">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Engr. Babatunde Adeyemi"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4EDF2] focus:border-[#0CA3DC] focus:ring-2 focus:ring-[#0CA3DC]/20 text-sm text-[#20262B] transition-all outline-none"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#20262B]">
              Email Address <span className="text-[#0CA3DC]">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. yourname@company.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4EDF2] focus:border-[#0CA3DC] focus:ring-2 focus:ring-[#0CA3DC]/20 text-sm text-[#20262B] transition-all outline-none"
            />
          </div>

          {/* Service Category */}
          <div className="space-y-1.5">
            <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-[#20262B]">
              Area of Interest / Service Category
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4EDF2] focus:border-[#0CA3DC] focus:ring-2 focus:ring-[#0CA3DC]/20 text-sm text-[#20262B] transition-all outline-none"
            >
              <option value="General Industrial Engineering Enquiry">General Industrial Engineering Enquiry</option>
              {siteContent.services.items.map((svc) => (
                <option key={svc.id} value={svc.title}>
                  {svc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Message */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#20262B]">
              Message / Specification Details <span className="text-[#0CA3DC]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Outline your facility location, equipment specifications, maintenance cadence, or technical requirements..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E4EDF2] focus:border-[#0CA3DC] focus:ring-2 focus:ring-[#0CA3DC]/20 text-sm text-[#20262B] transition-all outline-none resize-y"
            />
          </div>

          {status === "error" && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3.5 px-6 rounded-full bg-[#0CA3DC] hover:bg-[#087FB5] disabled:opacity-70 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending enquiry...</span>
              </>
            ) : (
              <>
                <span>Submit Enquiry</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

