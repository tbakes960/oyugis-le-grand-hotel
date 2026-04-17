/**
 * lib/email.js
 * Nodemailer helper for sending transactional emails via Gmail SMTP.
 *
 * Set EMAIL_PASSWORD to a Gmail App Password (not your main password):
 *   https://myaccount.google.com/apppasswords
 */

import nodemailer from 'nodemailer'

function createTransport() {
  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

const HOTEL_NAME  = 'Oyugis Le Grand Hotel'
const HOTEL_EMAIL = process.env.HOTEL_EMAIL || 'hotellegrand619@gmail.com'
const HOTEL_PHONE = '+254 799 200050'
const HOTEL_ADDR  = 'Kisumu-Kisii Road, Oyugis Town, Homa Bay County, Kenya'

/** Returns false if email credentials are not yet configured. */
function isConfigured() {
  const pw = process.env.EMAIL_PASSWORD || ''
  return pw.length > 0 && pw !== 'REPLACE_WITH_GMAIL_APP_PASSWORD'
}

// ── HTML injection prevention ──────────────────────────────────────────────
// Escape every user-supplied value before it touches an HTML template.
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }
function h(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => HTML_ESCAPES[c])
}

// ── Shared email wrapper ───────────────────────────────────────────────────

async function sendMail(options) {
  if (!isConfigured()) {
    console.log('[email] Skipped — EMAIL_PASSWORD not yet set.')
    return
  }
  try {
    const transporter = createTransport()
    await transporter.sendMail({ from: `"${HOTEL_NAME}" <${HOTEL_EMAIL}>`, ...options })
  } catch (err) {
    // Never throw — email failure should not break bookings
    console.error('[email] Send failed:', err.message)
  }
}

// ── Email templates ────────────────────────────────────────────────────────

/** Send booking confirmation to guest + notification to hotel */
export async function sendBookingConfirmation(booking) {
  const {
    guestName, guestEmail, bookingRef, roomType,
    checkIn, checkOut, nights, totalAmount, paymentMethod,
  } = booking

  const guestHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0A2F3C">
      <div style="background:linear-gradient(135deg,#0A2F3C,#144F60);padding:32px 24px;text-align:center">
        <h1 style="color:#D4AF37;font-family:Georgia,serif;margin:0;font-size:24px">${HOTEL_NAME}</h1>
        <p style="color:#fff;opacity:.7;margin:4px 0 0;font-size:12px;letter-spacing:.15em;text-transform:uppercase">Booking Confirmation</p>
      </div>
      <div style="padding:32px 24px;background:#fff">
        <h2 style="color:#0A2F3C;font-family:Georgia,serif;margin-top:0">Your Booking is Confirmed!</h2>
        <p>Dear ${h(guestName)},</p>
        <p>Thank you for choosing ${HOTEL_NAME}. Your reservation has been received and confirmed.</p>

        <div style="background:#F4F7F9;border-radius:12px;padding:20px;margin:24px 0">
          <h3 style="margin-top:0;color:#D4AF37;font-family:Georgia,serif;font-size:14px;letter-spacing:.1em;text-transform:uppercase">Booking Details</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#6B8B99">Booking Ref</td><td style="font-weight:700;font-family:monospace">${h(bookingRef)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Room Type</td><td>${h(roomType)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Check-in</td><td>${h(checkIn)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Check-out</td><td>${h(checkOut)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Nights</td><td>${h(String(nights))}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Total Amount</td><td style="font-weight:700;color:#D4AF37">KES ${h(Number(totalAmount).toLocaleString())}</td></tr>
            <tr><td style="padding:6px 0;color:#6B8B99">Payment</td><td>${h(paymentMethod || 'To be confirmed')}</td></tr>
          </table>
        </div>

        <p style="font-size:13px;color:#6B8B99">
          Please present your booking reference <strong>${h(bookingRef)}</strong> at check-in.<br>
          Check-in time: 14:00 · Check-out time: 11:00
        </p>

        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #E8EDF0;font-size:12px;color:#6B8B99">
          <strong style="color:#0A2F3C">${HOTEL_NAME}</strong><br>
          ${HOTEL_ADDR}<br>
          Tel: ${HOTEL_PHONE} · Email: ${HOTEL_EMAIL}
        </div>
      </div>
    </div>`

  // Email to guest
  await sendMail({
    to:      guestEmail,
    subject: `Booking Confirmed — ${h(bookingRef)} | ${HOTEL_NAME}`,
    html:    guestHtml,
  })

  // Alert to hotel — use a plain-text summary to avoid re-encoding issues
  await sendMail({
    to:      HOTEL_EMAIL,
    subject: `New Booking: ${h(bookingRef)} — ${h(guestName)} (${h(checkIn)} → ${h(checkOut)})`,
    html:    `<p>New booking received:</p><pre style="font-size:12px">${h(JSON.stringify(booking, null, 2))}</pre>`,
  })
}

/** Send contact message acknowledgement to guest + copy to hotel */
export async function sendContactAcknowledgement(msg) {
  const { name, email, subject, message } = msg

  // Escape then convert newlines — order matters: escape first, then replace \n
  const safeMessage = h(message).replace(/\n/g, '<br>')

  await sendMail({
    to:      email,
    subject: `We received your message — ${HOTEL_NAME}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0A2F3C,#144F60);padding:24px;text-align:center">
          <h1 style="color:#D4AF37;font-family:Georgia,serif;margin:0;font-size:22px">${HOTEL_NAME}</h1>
        </div>
        <div style="padding:28px 24px;background:#fff;color:#0A2F3C">
          <p>Dear ${h(name)},</p>
          <p>Thank you for reaching out. We've received your message and our team will respond within <strong>24 hours</strong>.</p>
          <div style="background:#F4F7F9;border-radius:10px;padding:16px;margin:20px 0;font-size:13px">
            <strong>Subject:</strong> ${h(subject)}<br><br>
            <strong>Your message:</strong><br>${safeMessage}
          </div>
          <p style="font-size:12px;color:#6B8B99">
            For urgent enquiries call us: ${HOTEL_PHONE}<br>
            ${HOTEL_ADDR}
          </p>
        </div>
      </div>`,
  })

  await sendMail({
    to:      HOTEL_EMAIL,
    subject: `New Contact Message: ${h(subject)} — from ${h(name)}`,
    html:    `<p><strong>From:</strong> ${h(name)} (${h(email)})</p><p><strong>Subject:</strong> ${h(subject)}</p><p>${safeMessage}</p>`,
  })
}

/** Send conference enquiry confirmation to organiser + notification to hotel */
export async function sendConferenceConfirmation(booking) {
  const { organizerName, email, ref, eventType, date, hallSize, attendees } = booking

  await sendMail({
    to:      email,
    subject: `Conference Enquiry Received — ${h(ref)} | ${HOTEL_NAME}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#0A2F3C,#144F60);padding:24px;text-align:center">
          <h1 style="color:#D4AF37;font-family:Georgia,serif;margin:0;font-size:22px">${HOTEL_NAME}</h1>
          <p style="color:#fff;opacity:.7;margin:4px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:.15em">Events & Conferences</p>
        </div>
        <div style="padding:28px 24px;background:#fff;color:#0A2F3C">
          <h2 style="font-family:Georgia,serif;margin-top:0">Enquiry Received!</h2>
          <p>Dear ${h(organizerName)},</p>
          <p>Thank you for considering ${HOTEL_NAME} for your event. We've received your enquiry and will respond with a detailed quote within <strong>24 hours</strong>.</p>
          <div style="background:#F4F7F9;border-radius:10px;padding:16px;margin:20px 0;font-size:14px">
            <strong>Enquiry Ref:</strong> <span style="font-family:monospace;font-weight:700">${h(ref)}</span><br>
            <strong>Event Type:</strong> ${h(eventType)}<br>
            <strong>Date:</strong> ${h(date)}<br>
            <strong>Hall:</strong> ${h(hallSize)}<br>
            <strong>Attendees:</strong> ${h(String(attendees))}
          </div>
          <p style="font-size:12px;color:#6B8B99">Tel: ${HOTEL_PHONE} · ${HOTEL_ADDR}</p>
        </div>
      </div>`,
  })

  await sendMail({
    to:      HOTEL_EMAIL,
    subject: `New Conference Enquiry: ${h(ref)} — ${h(organizerName)} (${h(eventType)}, ${h(date)})`,
    html:    `<p>New conference enquiry:</p><pre style="font-size:12px">${h(JSON.stringify(booking, null, 2))}</pre>`,
  })
}
