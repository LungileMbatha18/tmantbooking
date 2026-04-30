import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BookingPayload {
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  event_name: string;
  event_location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  guest_count?: number | null;
  notes?: string | null;
}

const ADMIN_EMAILS = ["kunenethato09@gmail.com", "mbatha_asl@icloud.com"];
const FROM = "TMANT Bookings <onboarding@resend.dev>";

async function sendEmail(to: string[], subject: string, html: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error", res.status, text);
    throw new Error(`Resend ${res.status}: ${text}`);
  }
  return res.json();
}

function escape(s: string | number | null | undefined) {
  if (s === null || s === undefined) return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bookerEmail(b: BookingPayload) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:30px;max-width:600px;margin:auto">
      <h1 style="font-size:24px;margin:0 0 20px;background:linear-gradient(135deg,#a855f7,#fb923c);-webkit-background-clip:text;background-clip:text;color:transparent">TMANT Bookings</h1>
      <p style="color:#fff">Hi ${escape(b.full_name)},</p>
      <p style="color:#ccc;line-height:1.6">Thank you for booking TMANT.</p>
      <p style="color:#ccc;line-height:1.6">Your booking request has been received successfully. We'll review the details and be in touch soon to confirm availability, pricing, and final arrangements.</p>
      <div style="border-left:3px solid #a855f7;padding:16px 20px;background:#161616;margin:24px 0;border-radius:4px">
        <h3 style="margin:0 0 12px;color:#fb923c;font-size:14px;text-transform:uppercase;letter-spacing:2px">Booking Summary</h3>
        <p style="margin:6px 0;color:#fff"><strong>Event Type:</strong> ${escape(b.event_type)}</p>
        <p style="margin:6px 0;color:#fff"><strong>Event Name:</strong> ${escape(b.event_name)}</p>
        <p style="margin:6px 0;color:#fff"><strong>Date:</strong> ${escape(b.event_date)}</p>
        <p style="margin:6px 0;color:#fff"><strong>Time:</strong> ${escape(b.start_time)} – ${escape(b.end_time)}</p>
        <p style="margin:6px 0;color:#fff"><strong>Location:</strong> ${escape(b.event_location)}</p>
      </div>
      <p style="color:#ccc">Kind regards,<br/><strong style="color:#fff">TMANT Bookings Team</strong></p>
      <hr style="border:none;border-top:1px solid #333;margin:30px 0"/>
      <p style="color:#666;font-size:12px">TMANT — DJ Bloemfontein · House · Private Piano · Amapiano</p>
    </div>
  `;
}

function adminEmail(b: BookingPayload) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#fff;padding:30px;max-width:600px;margin:auto">
      <h1 style="font-size:22px;margin:0 0 20px;color:#fb923c">🔔 New TMANT Booking Request</h1>
      <div style="background:#161616;padding:20px;border-radius:6px;border:1px solid #333">
        <h3 style="margin:0 0 12px;color:#a855f7;font-size:13px;text-transform:uppercase;letter-spacing:2px">Contact</h3>
        <p style="margin:4px 0;color:#fff"><strong>Name:</strong> ${escape(b.full_name)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Email:</strong> ${escape(b.email)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Phone:</strong> ${escape(b.phone)}</p>
        <h3 style="margin:18px 0 12px;color:#a855f7;font-size:13px;text-transform:uppercase;letter-spacing:2px">Event</h3>
        <p style="margin:4px 0;color:#fff"><strong>Type:</strong> ${escape(b.event_type)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Name:</strong> ${escape(b.event_name)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Location:</strong> ${escape(b.event_location)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Date:</strong> ${escape(b.event_date)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Time:</strong> ${escape(b.start_time)} – ${escape(b.end_time)}</p>
        <p style="margin:4px 0;color:#fff"><strong>Expected Guests:</strong> ${escape(b.guest_count ?? null)}</p>
        ${b.notes ? `<h3 style="margin:18px 0 12px;color:#a855f7;font-size:13px;text-transform:uppercase;letter-spacing:2px">Notes</h3><p style="margin:4px 0;color:#ccc;line-height:1.6">${escape(b.notes)}</p>` : ""}
      </div>
    </div>
  `;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const b = (await req.json()) as BookingPayload;
    if (!b.full_name || !b.email || !b.event_date) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = await Promise.allSettled([
      sendEmail([b.email], "TMANT Booking Request Received", bookerEmail(b)),
      sendEmail(
        ADMIN_EMAILS,
        `New TMANT Booking — ${b.event_name} (${b.event_date})`,
        adminEmail(b),
      ),
    ]);

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length) {
      console.error("Some emails failed", failures);
    }

    return new Response(
      JSON.stringify({ success: true, sent: results.length - failures.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("send-booking-emails error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
