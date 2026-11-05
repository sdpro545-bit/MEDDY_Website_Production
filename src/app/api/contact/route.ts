import { NextResponse } from "next/server";

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a detailed message (minimum 10 characters)." },
        { status: 400 }
      );
    }

    const recipient = process.env.CONTACT_RECIPIENT || "info@meddyglobalsolutions.com";
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Integration with Resend when API key is provided
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "enquiries@meddyglobalsolutions.com",
          to: recipient,
          subject: `New Enquiry from ${name.trim()} - ${subject || "General Industrial Enquiry"}`,
          text: `Name: ${name}\nEmail: ${email}\nCategory: ${subject || "General"}\n\nMessage:\n${message}`,
        }),
      });

      if (!resendResponse.ok) {
        console.error("Resend API error:", await resendResponse.text());
        return NextResponse.json(
          { success: false, error: "Failed to dispatch enquiry email via provider. Please email us directly." },
          { status: 502 }
        );
      }
    } else {
      // Documented configuration boundary: Log securely in local development / review
      console.log(`[ENQUIRY RECEIVED] To: ${recipient}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: ${subject || "General Enquiry"}`);
      console.log(`Message: ${message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. We will review your message and reply via email promptly.",
    });
  } catch (error) {
    console.error("Contact API submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your enquiry." },
      { status: 500 }
    );
  }
}

