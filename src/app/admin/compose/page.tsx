"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Send,
  Eye,
  Edit3,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  HelpCircle,
  Bold,
  List,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

interface AttachmentItem {
  filename: string;
  size: number;
  content: string; // base64
}

interface LintIssue {
  type: "error" | "warning";
  code: string;
  message: string;
}

interface LintResult {
  passed: boolean;
  errors: LintIssue[];
  warnings: LintIssue[];
  htmlSizeBytes: number;
  imageCount: number;
  linkCount: number;
}

export default function AdminComposePage() {
  const router = useRouter();

  // Form State
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("");
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessId, setSendSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize CSRF Token
  useEffect(() => {
    const token = sessionStorage.getItem("meddy_csrf_token") || "";
    setCsrfToken(token);
  }, []);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if ((body.trim() || subject.trim()) && !sendSuccessId) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [body, subject, sendSuccessId]);

  // Debounced preview generator
  const fetchPreview = useCallback(async () => {
    if (!csrfToken) return;
    setPreviewLoading(true);

    try {
      const ccList = cc
        ? cc.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          to: toEmail.trim(),
          toName: toName.trim(),
          subject: subject.trim(),
          cc: ccList,
          body,
          ctaLabel: ctaLabel.trim(),
          ctaUrl: ctaUrl.trim(),
        }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setPreviewHtml(data.html);
        setPreviewText(data.text);
        setLintResult(data.lintResult);
      }
    } catch {
      // Quiet fail on network debounce
    } finally {
      setPreviewLoading(false);
    }
  }, [toEmail, toName, subject, cc, body, ctaLabel, ctaUrl, csrfToken, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (csrfToken) {
        fetchPreview();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchPreview, csrfToken]);

  // Attachment handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (attachments.length + files.length > 3) {
      alert("A maximum of 3 PDF attachments is allowed per message.");
      return;
    }

    const newAttachments: AttachmentItem[] = [...attachments];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert(`File "${file.name}" rejected. Only PDF files are permitted.`);
        continue;
      }
      if (file.size > 2.5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 2.5 MB single-file ceiling.`);
        continue;
      }

      const base64 = await readFileAsBase64(file);
      newAttachments.push({
        filename: file.name,
        size: file.size,
        content: base64,
      });
    }

    setAttachments(newAttachments);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, idx) => idx !== index));
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Textarea toolbar formatting helpers
  const insertSyntax = (prefix: string, suffix = "") => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 0);
  };

  // Send Submission
  const handleFinalSend = async () => {
    setIsSending(true);
    setErrorMessage(null);

    const ccList = cc
      ? cc.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          to: toEmail.trim(),
          toName: toName.trim(),
          subject: subject.trim(),
          cc: ccList,
          body,
          ctaLabel: ctaLabel.trim(),
          ctaUrl: ctaUrl.trim(),
          attachments: attachments.map((a) => ({
            filename: a.filename,
            content: a.content,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to dispatch email.");
        setShowConfirmModal(false);
        setIsSending(false);
        return;
      }

      setSendSuccessId(data.messageId || "delivered");
      setShowConfirmModal(false);
      setIsSending(false);
    } catch {
      setErrorMessage("Network error occurred during send. Please check your connection.");
      setShowConfirmModal(false);
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setToName("");
    setToEmail("");
    setCc("");
    setSubject("");
    setBody("");
    setCtaLabel("");
    setCtaUrl("");
    setAttachments([]);
    setSendSuccessId(null);
    setErrorMessage(null);
    setActiveTab("write");
  };

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    sessionStorage.removeItem("meddy_csrf_token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F5FAFC] flex flex-col font-sans selection:bg-[#076E9C] selection:text-white">
      <head>
        <title>Owner Compose | MEDDY Executive Mail</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </head>

      {/* Top Header Band */}
      <header className="bg-white border-b border-[#E4EDF2] sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Image
            src="/email/meddy-logo.png"
            alt="MEDDY GLOBAL SOLUTIONS LTD"
            width={40}
            height={46}
            priority
            className="h-[46px] w-[40px] object-contain"
          />
          <div>
            <div className="font-bold text-sm tracking-tight text-[#20262B]">
              MEDDY GLOBAL SOLUTIONS
            </div>
            <div className="text-[11px] font-semibold text-[#076E9C] tracking-wider uppercase">
              Executive Message Dispatch
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#5A6872] hover:text-[#20262B] hover:bg-[#F5FAFC] rounded-lg border border-[#E4EDF2] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {sendSuccessId ? (
          <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl border border-[#E4EDF2] shadow-sm text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#20262B]">Email Successfully Dispatched</h2>
            <p className="text-sm text-[#5A6872] max-w-md mx-auto leading-relaxed">
              Your branded message has been delivered to the dispatch queue. A confirmation audit copy has been archived.
            </p>
            <div className="p-3 bg-[#F5FAFC] rounded-xl border border-[#E4EDF2] text-xs font-mono text-[#5A6872] inline-block">
              Message ID: {sendSuccessId}
            </div>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full bg-[#076E9C] text-white font-semibold text-sm hover:bg-[#065A80] transition-colors shadow-md shadow-[#076E9C]/20"
              >
                Compose Another Message
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex border-b border-[#E4EDF2] bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("write")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === "write"
                    ? "bg-[#076E9C] text-white shadow-sm"
                    : "text-[#5A6872] hover:text-[#20262B]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write Message</span>
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all ${
                  activeTab === "preview"
                    ? "bg-[#076E9C] text-white shadow-sm"
                    : "text-[#5A6872] hover:text-[#20262B]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* Split Grid: Editor (Left) & Preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Editor */}
              <div
                className={`lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border border-[#E4EDF2] shadow-sm space-y-5 ${
                  activeTab === "preview" ? "hidden lg:block" : "block"
                }`}
              >
                <div className="border-b border-[#E4EDF2] pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#20262B]">Message Details</h2>
                    <p className="text-xs text-[#5A6872]">
                      Deterministic formatting applies professional letterhead styling.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHelp(!showHelp)}
                    className="text-xs font-semibold text-[#076E9C] hover:text-[#065A80] flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Formatting Help</span>
                  </button>
                </div>

                {showHelp && (
                  <div className="p-4 bg-[#F5FAFC] border border-[#E4EDF2] rounded-xl text-xs text-[#3A444C] space-y-2 leading-relaxed">
                    <div className="font-bold text-[#20262B] uppercase tracking-wider text-[10px]">
                      Quick Syntax Guide:
                    </div>
                    <div>&bull; <strong>Paragraphs:</strong> Separate with a blank line.</div>
                    <div>&bull; <strong>Bold:</strong> Wrap words in <code className="bg-white px-1 py-0.5 rounded border border-[#E4EDF2]">**bold text**</code></div>
                    <div>&bull; <strong>Bullet Lists:</strong> Start lines with <code className="bg-white px-1 py-0.5 rounded border border-[#E4EDF2]">- Item 1</code></div>
                    <div>&bull; <strong>Headings:</strong> Start a line with <code className="bg-white px-1 py-0.5 rounded border border-[#E4EDF2]">## Section Title</code></div>
                    <div>&bull; <strong>Links:</strong> Use <code className="bg-white px-1 py-0.5 rounded border border-[#E4EDF2]">[Click here](https://...)</code> or paste bare URLs.</div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="compose-to-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
                    >
                      Recipient Name
                    </label>
                    <input
                      id="compose-to-name"
                      type="text"
                      value={toName}
                      onChange={(e) => setToName(e.target.value)}
                      placeholder="e.g. Engr. Babatunde Lawal"
                      className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] px-3.5 py-2.5 text-sm text-[#20262B] focus:bg-white focus:border-[#076E9C] focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="compose-to-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
                    >
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="compose-to-email"
                      type="email"
                      required
                      value={toEmail}
                      onChange={(e) => setToEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] px-3.5 py-2.5 text-sm text-[#20262B] focus:bg-white focus:border-[#076E9C] focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="compose-cc"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
                  >
                    CC Recipients <span className="text-[#5A6872] font-normal normal-case">(optional, max 3 comma-separated)</span>
                  </label>
                  <input
                    id="compose-cc"
                    type="text"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="project@partner.com, manager@client.com"
                    className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] px-3.5 py-2.5 text-sm text-[#20262B] focus:bg-white focus:border-[#076E9C] focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="compose-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5"
                  >
                    Subject Line <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="compose-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Technical Proposal for Rotating Equipment Overhaul"
                    className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] px-3.5 py-2.5 text-sm text-[#20262B] focus:bg-white focus:border-[#076E9C] focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="compose-body"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#20262B]"
                    >
                      Message Body <span className="text-red-500">*</span>
                    </label>

                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertSyntax("**", "**")}
                        title="Bold"
                        className="p-1.5 rounded hover:bg-[#E4EDF2] text-[#5A6872] hover:text-[#20262B]"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("- ")}
                        title="Bullet List"
                        className="p-1.5 rounded hover:bg-[#E4EDF2] text-[#5A6872] hover:text-[#20262B]"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSyntax("[link text](", ")")}
                        title="Link"
                        className="p-1.5 rounded hover:bg-[#E4EDF2] text-[#5A6872] hover:text-[#20262B]"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id="compose-body"
                    ref={textareaRef}
                    rows={10}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Type your correspondence here. It will be professionally formatted into official letterhead styling..."
                    className="block w-full rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] p-3.5 text-sm text-[#20262B] font-mono leading-relaxed focus:bg-white focus:border-[#076E9C] focus:outline-none focus:ring-2 focus:ring-[#076E9C]/20"
                  />
                </div>

                {/* Optional Attachments (PDF only) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#20262B] mb-1.5">
                    Attachments <span className="text-[#5A6872] font-normal normal-case">(PDF only, max 3 files, &lt;3 MB total)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4EDF2] bg-[#F5FAFC] hover:bg-white text-xs font-semibold text-[#076E9C] cursor-pointer transition-colors shadow-sm">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Upload PDF Document</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5FAFC] border border-[#E4EDF2] text-xs text-[#20262B]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 text-[#076E9C] flex-shrink-0" />
                            <span className="font-semibold truncate">{att.filename}</span>
                            <span className="text-[#5A6872] text-[11px]">({(att.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="p-1 hover:text-red-600 text-[#5A6872]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dispatch Button */}
                <div className="pt-4 border-t border-[#E4EDF2]">
                  <button
                    type="button"
                    onClick={() => {
                      if (!toEmail.trim() || !subject.trim() || !body.trim()) {
                        alert("Please complete recipient email, subject, and message body.");
                        return;
                      }
                      setShowConfirmModal(true);
                    }}
                    className="w-full min-h-[48px] py-3.5 px-6 rounded-full bg-[#076E9C] hover:bg-[#065A80] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#076E9C]/25 active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Review &amp; Send Message</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Sandboxed Preview */}
              <div
                className={`lg:col-span-6 space-y-4 ${
                  activeTab === "write" ? "hidden lg:block" : "block"
                }`}
              >
                {/* Deliverability & Metadata Bar */}
                <div className="bg-white p-4 rounded-xl border border-[#E4EDF2] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#20262B]">Quality &amp; Spam Lint:</span>
                    {lintResult ? (
                      lintResult.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>PASSED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>ISSUES DETECTED</span>
                        </span>
                      )
                    ) : (
                      <span className="text-[#5A6872]">Evaluating...</span>
                    )}
                  </div>

                  {lintResult && (
                    <div className="text-[#5A6872] flex items-center gap-3">
                      <span>HTML: {(lintResult.htmlSizeBytes / 1024).toFixed(1)} KB</span>
                      <span>Links: {lintResult.linkCount}</span>
                      <span>Images: {lintResult.imageCount}</span>
                    </div>
                  )}
                </div>

                {/* Lint Warnings / Errors Box */}
                {lintResult && (lintResult.errors.length > 0 || lintResult.warnings.length > 0) && (
                  <div className="space-y-2">
                    {lintResult.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{err.message}</span>
                      </div>
                    ))}
                    {lintResult.warnings.map((warn, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{warn.message}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sandboxed iframe Preview */}
                <div className="bg-white rounded-2xl border border-[#E4EDF2] shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-[#F5FAFC] px-4 py-2.5 border-b border-[#E4EDF2] flex items-center justify-between text-xs text-[#5A6872]">
                    <div className="font-semibold text-[#20262B] truncate max-w-[280px]">
                      Subject: {subject.trim() || "(Untitled Message)"}
                    </div>
                    {previewLoading && <span className="text-[#076E9C] font-semibold">Updating...</span>}
                  </div>

                  <iframe
                    title="Live Branded Email Preview"
                    sandbox="allow-same-origin"
                    srcDoc={previewHtml}
                    className="w-full h-[650px] border-0 bg-[#F5FAFC]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#E4EDF2] space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#E4EDF2] pb-3">
              <h3 className="text-lg font-bold text-[#20262B]">Confirm Message Dispatch</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-[#5A6872] hover:text-[#20262B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#3A444C]">
              <div>
                <span className="font-bold text-[#20262B]">To:</span> {toName ? `${toName} <${toEmail}>` : toEmail}
              </div>
              {cc && (
                <div>
                  <span className="font-bold text-[#20262B]">CC:</span> {cc}
                </div>
              )}
              <div>
                <span className="font-bold text-[#20262B]">Subject:</span> {subject}
              </div>
              {attachments.length > 0 && (
                <div>
                  <span className="font-bold text-[#20262B]">Attachments:</span>{" "}
                  {attachments.map((a) => a.filename).join(", ")}
                </div>
              )}
            </div>

            {lintResult && lintResult.errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                <strong>Cannot Send:</strong> {lintResult.errors[0].message}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4EDF2]">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5A6872] hover:text-[#20262B]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSending || (lintResult ? lintResult.errors.length > 0 : false)}
                onClick={handleFinalSend}
                className="px-6 py-2.5 rounded-full bg-[#076E9C] hover:bg-[#065A80] text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#076E9C]/20"
              >
                {isSending ? "Dispatching..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

