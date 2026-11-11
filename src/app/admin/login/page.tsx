"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Incorrect email or password.");
        setLoading(false);
        return;
      }

      // Store CSRF token in sessionStorage (session-scoped only, never long-term storage)
      if (data.csrfToken) {
        sessionStorage.setItem("meddy_csrf_token", data.csrfToken);
      }

      router.push("/admin/compose");
    } catch {
      setErrorMessage("Network error occurred while connecting to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#076E9C] selection:text-white">
      {/* Search engine index guard */}
      <head>
        <title>Sign In | MEDDY Secure Portal</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Official Letterhead Header: Logo Alone */}
        <div className="inline-block p-4 mb-2">
          <Image
            src="/email/meddy-logo.png"
            alt="MEDDY GLOBAL SOLUTIONS LTD"
            width={56}
            height={65}
            priority
            className="mx-auto h-[65px] w-[56px] object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#20262B]">
          MEDDY Executive Mail Portal
        </h1>
        <p className="mt-1 text-sm text-[#5A6872]">
          Authorized correspondence &amp; document dispatch
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E4EDF2] rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2.5"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-[#5A6872]" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@meddyglobalsolutions.com"
                  className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] pl-10 pr-4 py-3 text-sm text-[#20262B] placeholder:text-[#5A6872]/60 focus:border-[#076E9C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
              >
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-[#5A6872]" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security credential"
                  className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] pl-10 pr-11 py-3 text-sm text-[#20262B] placeholder:text-[#5A6872]/60 focus:border-[#076E9C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#5A6872] hover:text-[#20262B] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-semibold text-white bg-[#076E9C] hover:bg-[#065A80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076E9C] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#076E9C]/20 active:scale-[0.98]"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Compose</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E4EDF2] text-center">
            <p className="text-xs text-[#5A6872] leading-relaxed">
              Confidential internal utility. All access attempts and dispatches are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

