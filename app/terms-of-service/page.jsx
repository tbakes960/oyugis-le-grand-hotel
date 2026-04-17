import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Oyugis Le Grand Hotel',
  description: 'Terms and conditions for bookings, payments, and use of Oyugis Le Grand Hotel services.',
}

const LAST_UPDATED = 'April 2026'

export default function TermsOfServicePage() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/Side%20View.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Terms of Service</h1>
          <p className="text-white/60 text-sm mt-3">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-card p-10 prose prose-sm max-w-none
                          [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-hotel-dark [&_h2]:mt-10 [&_h2]:mb-4
                          [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-hotel-dark [&_h3]:mt-6 [&_h3]:mb-3
                          [&_p]:text-hotel-muted [&_p]:leading-relaxed [&_p]:mb-4
                          [&_ul]:text-hotel-muted [&_ul]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5
                          [&_li]:mb-1.5
                          [&_strong]:text-hotel-dark [&_strong]:font-semibold">

            <p className="text-hotel-muted text-sm leading-relaxed border-l-4 border-gold-400 pl-4 mb-8">
              By using this website or making a booking with Oyugis Le Grand Hotel, you agree to
              these Terms of Service. Please read them carefully before completing a reservation.
            </p>

            <h2>1. Reservations and Booking</h2>
            <h3>1.1 Making a Booking</h3>
            <p>
              Reservations can be made via our website, phone, WhatsApp, or through authorised
              third-party platforms (Booking.com, Airbnb, Expedia). A booking is only confirmed
              once you receive a written confirmation with a booking reference number.
            </p>

            <h3>1.2 Booking Information</h3>
            <p>
              You are responsible for ensuring that all booking details — including guest name,
              check-in/out dates, number of guests, and contact information — are accurate.
              Oyugis Le Grand Hotel is not liable for losses arising from incorrect information
              provided at the time of booking.
            </p>

            <h3>1.3 Room Availability</h3>
            <p>
              All bookings are subject to availability. We reserve the right to offer an
              alternative room of equal or higher category if the booked room type is
              unavailable due to unforeseen circumstances.
            </p>

            <h2>2. Check-in and Check-out</h2>
            <ul>
              <li><strong>Check-in time:</strong> From 14:00 (2:00 PM)</li>
              <li><strong>Check-out time:</strong> By 11:00 (11:00 AM)</li>
              <li>Early check-in and late check-out are subject to availability and may incur an additional charge</li>
              <li>Valid government-issued photo identification is required at check-in</li>
              <li>The primary guest must be at least 18 years of age</li>
            </ul>

            <h2>3. Rates and Payments</h2>
            <h3>3.1 Room Rates</h3>
            <p>
              All rates are quoted in Kenyan Shillings (KES) and include applicable taxes and
              service charges unless stated otherwise. Rates are per room per night and include
              breakfast where specified.
            </p>

            <h3>3.2 Payment Methods</h3>
            <p>We accept the following payment methods:</p>
            <ul>
              <li><strong>M-Pesa:</strong> Lipa na M-Pesa — Till Number 944443</li>
              <li><strong>Cash:</strong> Kenyan Shillings accepted at the front desk</li>
              <li><strong>Bank transfer:</strong> Available on request — contact us for bank details</li>
              <li><strong>Card payments:</strong> Visa and Mastercard accepted at the front desk</li>
            </ul>

            <h3>3.3 Payment at Check-in</h3>
            <p>
              Full payment is required at check-in unless a prepaid booking has been made.
              For online bookings, payment confirmation must be presented at the front desk.
            </p>

            <h2>4. Cancellation and Modification Policy</h2>
            <h3>4.1 Free Cancellation</h3>
            <p>
              Bookings cancelled more than <strong>24 hours before the scheduled check-in time</strong> are
              eligible for a full refund. Cancellations within 24 hours of check-in are non-refundable.
            </p>

            <h3>4.2 No-Show Policy</h3>
            <p>
              If you do not arrive on your scheduled check-in date without prior notice,
              the reservation will be treated as a no-show and the full booking amount
              will be forfeited.
            </p>

            <h3>4.3 Early Departure</h3>
            <p>
              If you check out before your scheduled departure date, you will be charged
              for the full duration of the original booking unless alternative arrangements
              have been agreed in advance with hotel management.
            </p>

            <h3>4.4 How to Cancel</h3>
            <p>
              To cancel or modify a booking, contact us at least 24 hours before check-in via:
            </p>
            <ul>
              <li>Phone: +254 799 200050</li>
              <li>Email: hotellegrand619@gmail.com</li>
              <li>WhatsApp: +254 799 200050</li>
            </ul>

            <h2>5. Refund Policy</h2>
            <p>
              Approved refunds will be processed within <strong>7–14 business days</strong> to
              the original payment method. For M-Pesa payments, refunds are sent to the original
              M-Pesa number. We are not responsible for delays caused by payment processors
              or mobile network operators.
            </p>

            <h2>6. Guest Conduct</h2>
            <p>
              All guests are expected to behave in a manner that is respectful of other guests,
              hotel staff, and the property. We reserve the right to ask any guest to leave the
              premises — without refund — if their behaviour causes disturbance, damage, or
              violates Kenyan law.
            </p>
            <ul>
              <li>Smoking is permitted only in designated outdoor smoking areas</li>
              <li>Pets are not permitted on the premises unless prior written approval has been granted</li>
              <li>Noise must be kept to a minimum after 22:00 in room areas</li>
              <li>Unauthorised visitors in guest rooms are not permitted</li>
            </ul>

            <h2>7. Damage to Property</h2>
            <p>
              Guests are liable for any damage caused to hotel property during their stay.
              Damage will be assessed and charged to the guest at replacement or repair cost.
              Oyugis Le Grand Hotel reserves the right to charge a security deposit for
              bookings deemed to be at higher risk of damage.
            </p>

            <h2>8. Liability</h2>
            <p>
              Oyugis Le Grand Hotel is not liable for:
            </p>
            <ul>
              <li>Loss, theft, or damage to personal belongings during your stay</li>
              <li>Personal injury arising from misuse of hotel facilities</li>
              <li>Disruption to services caused by events outside our reasonable control
                  (force majeure), including power outages, natural disasters, or civil unrest</li>
            </ul>
            <p>
              Guests are advised to ensure their belongings are stored securely. The hotel
              accepts no responsibility for valuables not deposited with the front desk.
            </p>

            <h2>9. Conference and Event Bookings</h2>
            <p>
              Conference and event hall bookings are subject to a separate event agreement
              provided at the time of confirmed booking. Key terms include:
            </p>
            <ul>
              <li>A deposit of 50% is required to confirm event bookings</li>
              <li>Cancellations made within 7 days of the event date forfeit the deposit</li>
              <li>The hotel is not responsible for technical failures of client-supplied equipment</li>
              <li>Catering orders must be confirmed at least 48 hours before the event</li>
            </ul>

            <h2>10. Dining and Restaurant</h2>
            <p>
              Menu items, prices, and availability are subject to change without notice.
              Guests with food allergies or dietary requirements should inform staff before ordering.
              The hotel is not liable for adverse reactions where a guest has not disclosed
              dietary requirements.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the
              laws of Kenya. Any disputes arising from these terms shall be subject to the
              exclusive jurisdiction of the courts of Kenya.
            </p>

            <h2>12. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms of Service at any time. Changes will
              be posted on this page with a revised &ldquo;Last updated&rdquo; date. Continued
              use of our services after changes are posted constitutes your acceptance of the
              revised terms.
            </p>

            <h2>13. Contact</h2>
            <p>
              For questions about these terms, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> hotellegrand619@gmail.com</li>
              <li><strong>Phone:</strong> +254 799 200050</li>
              <li><strong>Address:</strong> Kisumu-Kisii Road, Oyugis Town, Homa Bay County, Kenya</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sky-400 text-sm hover:underline">← Back to Home</Link>
            <span className="mx-4 text-gray-300">·</span>
            <Link href="/privacy-policy" className="text-sky-400 text-sm hover:underline">Privacy Policy</Link>
            <span className="mx-4 text-gray-300">·</span>
            <Link href="/contact" className="text-sky-400 text-sm hover:underline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
