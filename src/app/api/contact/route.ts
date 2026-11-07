import { NextResponse } from "next/server";

// Anti-gibberish and spam detection heuristics
function isGibberish(text: string): boolean {
  if (!text) return true;
  const clean = text.trim();

  // Flag repetitive characters (e.g. aaaaa, !!!!!!, .....)
  if (/(.)\1{4,}/.test(clean)) return true;

  // Flag common keyboard mash patterns
  const mashPatterns = [
    /asdfgh/i, /qwerty/i, /zxcvbn/i, /hjkl;'/, /123456/,
    /qazwsx/i, /edcrfv/i, /tgbyhn/i, /yuiop/i,
  ];
  if (mashPatterns.some((pattern) => pattern.test(clean))) return true;

  // Words with excessive consonants and no vowels (e.g., "bcdfghjklmn")
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length >= 7 && !/[aeiouyAEIOUY]/i.test(word)) {
      return true;
    }
    // High repeated character frequency in single word
    const uniqueChars = new Set(word.toLowerCase());
    if (word.length >= 8 && uniqueChars.size <= 2) {
      return true;
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message, honeypot } = data;

    // Spam honeypot check
    if (honeypot && honeypot.length > 0) {
      // Quietly reject bots without alerting them
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    // Required fields validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (isGibberish(name)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid, recognizable full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid corporate or personal email address." },
        { status: 400 }
      );
    }

    // Check for throwaway / gibberish email handles
    const [handle] = email.split("@");
    if (isGibberish(handle)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid, legitimate email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a detailed enquiry description (minimum 10 characters)." },
        { status: 400 }
      );
    }

    if (isGibberish(message)) {
      return NextResponse.json(
        { success: false, error: "Your message appears to contain repetitive or unrecognized text. Please provide clear enquiry details." },
        { status: 400 }
      );
    }

    // Display / public email is info@meddyglobalsolutions.com
    // Target inbox routing destination requested by client is mglobalsolutions185@gmail.com
    const recipient = process.env.CONTACT_RECIPIENT || "mglobalsolutions185@gmail.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Professional branded HTML email layout
      const htmlBody = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #06121F; color: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #1E293B;">
          <div style="background: linear-gradient(135deg, #0B2239 0%, #06121F 100%); padding: 24px 30px; border-bottom: 2px solid #0EA5E0;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;">MEDDY GLOBAL SOLUTIONS LTD</h2>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #0EA5E0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Official Web Portal Enquiry</p>
          </div>
          
          <div style="padding: 30px; background: #FFFFFF; color: #1E293B;">
            <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600; margin-bottom: 4px;">Enquiry Category</span>
              <span style="font-size: 16px; font-weight: 700; color: #0B2239;">${subject || "General Industrial Engineering Enquiry"}</span>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; width: 120px; font-size: 13px; color: #64748B; font-weight: 600;">Full Name:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #0F172A; font-weight: 600;">${name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 600;">Client Email:</td>
                <td style="padding: 8px 0; font-size: 14px; color: #0284C7; font-weight: 600;"><a href="mailto:${email}" style="color: #0284C7; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #64748B; font-weight: 600;">Received Date:</td>
                <td style="padding: 8px 0; font-size: 13px; color: #475569;">${new Date().toUTCString()}</td>
              </tr>
            </table>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748B; font-weight: 600; margin-bottom: 10px;">Enquiry Details & Specifications</span>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${email}?subject=RE:%20${encodeURIComponent(subject || 'Enquiry')}%20-%20MEDDY%20GLOBAL%20SOLUTIONS" style="display: inline-block; background: #0EA5E0; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">Reply Directly to Client</a>
            </div>
          </div>

          <div style="background: #0B2239; padding: 16px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.6);">This message was dispatched from the official web portal at info@meddyglobalsolutions.com and delivered to ${recipient}.</p>
          </div>
        </div>
      `;

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MEDDY Portal <enquiries@meddyglobalsolutions.com>",
          to: recipient,
          reply_to: email,
          subject: `[Web Enquiry] ${subject || "General Industrial Enquiry"} — ${name.trim()}`,
          html: htmlBody,
          text: `MEDDY GLOBAL SOLUTIONS LTD\nNew Web Enquiry\n\nCategory: ${subject || "General"}\nClient: ${name}\nEmail: ${email}\nDate: ${new Date().toISOString()}\n\nMessage Details:\n${message}\n\nRouted to: ${recipient}`,
        }),
      });

      if (!resendResponse.ok) {
        console.error("Resend API error:", await resendResponse.text());
        return NextResponse.json(
          { success: false, error: "Failed to dispatch enquiry email via provider. Please email us directly at info@meddyglobalsolutions.com." },
          { status: 502 }
        );
      }
    } else {
      // Documented configuration boundary: Log securely with full routing trace
      console.log(`[ENQUIRY ROUTED] Destination: ${recipient} (Display: info@meddyglobalsolutions.com)`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Category: ${subject || "General Enquiry"}`);
      console.log(`Message: ${message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. Our technical operations team has received your message and will reply via email promptly.",
    });
  } catch (error) {
    console.error("Contact API submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your enquiry. Please try again." },
      { status: 500 }
    );
  }
}

