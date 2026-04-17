// MapSection — Google Maps embed
// REPLACE: Update the Google Maps embed URL below with your exact hotel location
// How to get the embed URL:
//   1. Go to maps.google.com
//   2. Search for your hotel address
//   3. Click Share → Embed a map
//   4. Copy the src URL from the <iframe> tag and paste it below

export default function MapSection() {
  const MAPS_EMBED_URL =
    'https://maps.google.com/maps?q=Le+Grand+Hotel+Oyugis+Kenya&t=&z=17&ie=UTF8&iwloc=&output=embed'

  return (
    <section className="py-20 bg-hotel-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="eyebrow">Find Us</span>
          <h2 className="section-title">Our Location</h2>
          <p className="section-desc">
              Kisumu-Kisii Road, Oyugis Town, Homa Bay County, Kenya
          </p>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg h-96">
          {/* REPLACE: The src below — paste your real Google Maps embed URL */}
          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Oyugis Le Grand Hotel Location"
          />
        </div>
      </div>
    </section>
  )
}
