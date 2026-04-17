import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Oyugis Le Grand Hotel',
  description: 'Privacy Policy for Oyugis Le Grand Hotel — how we collect, use, and protect your personal information.',
}

const LAST_UPDATED = 'April 2026'

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/front%20office.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 30%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Privacy Policy</h1>
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

            <p className="text-hotel-muted text-sm leading-relaxed border-l-4 border-sky-400 pl-4 mb-8">
              Oyugis Le Grand Hotel (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting
              your privacy. This policy explains how we collect, use, store, and protect your
              personal information when you use our website or services.
            </p>

            <h2>1. Information We Collect</h2>
            <h3>Information you provide directly</h3>
            <ul>
              <li>Name, email address, and phone number when making a reservation or sending an enquiry</li>
              <li>Payment information (processed securely — we do not store card details)</li>
              <li>M-Pesa phone number for mobile payments</li>
              <li>Special requests, dietary requirements, or accessibility needs</li>
              <li>Messages and feedback submitted via our contact form</li>
            </ul>

            <h3>Information collected automatically</h3>
            <ul>
              <li>Browser type, device information, and IP address</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referral source (how you found our website)</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Process and confirm room reservations and event bookings</li>
              <li>Send booking confirmations and pre-arrival information</li>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Process payments via M-Pesa or card</li>
              <li>Improve our website and services</li>
              <li>Send promotional communications where you have given consent</li>
              <li>Comply with legal obligations under Kenyan law</li>
            </ul>

            <h2>3. How We Share Your Information</h2>
            <p>
              We do <strong>not</strong> sell your personal information to third parties.
              We may share your data with:
            </p>
            <ul>
              <li><strong>Payment processors</strong> — Safaricom (M-Pesa) for mobile payment processing</li>
              <li><strong>Email service providers</strong> — to send booking confirmations and notifications</li>
              <li><strong>Legal authorities</strong> — where required by law or court order</li>
            </ul>

            <h2>4. Data Storage and Security</h2>
            <p>
              Your data is stored securely on our servers. We implement appropriate technical
              and organisational measures to protect your personal information against
              unauthorised access, loss, or disclosure. All payment transactions are
              encrypted using industry-standard SSL technology.
            </p>
            <p>
              We retain your booking data for a maximum of <strong>5 years</strong> as required
              for accounting and legal purposes under Kenyan law, after which it is securely deleted.
            </p>

            <h2>5. Cookies</h2>
            <p>
              Our website uses essential cookies to maintain your session and ensure the website
              functions correctly. We do not use tracking cookies or third-party advertising cookies.
              You can disable cookies in your browser settings, but this may affect website functionality.
            </p>

            <h2>6. Your Rights</h2>
            <p>Under applicable Kenyan data protection law, you have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:hotellegrand619@gmail.com" className="text-sky-400 underline">
                hotellegrand619@gmail.com
              </a>.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party booking platforms (Booking.com, Airbnb, etc.).
              We are not responsible for the privacy practices of these external sites. We encourage
              you to review their privacy policies before providing any personal information.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              Our website is not directed at children under the age of 13. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with personal data, please contact us immediately.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with a revised &ldquo;Last updated&rdquo; date. We encourage you to review
              this policy periodically.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your personal
              data, please contact us:
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
            <Link href="/terms-of-service" className="text-sky-400 text-sm hover:underline">Terms of Service</Link>
            <span className="mx-4 text-gray-300">·</span>
            <Link href="/contact" className="text-sky-400 text-sm hover:underline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
