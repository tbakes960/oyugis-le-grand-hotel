// Home Page — Oyugis Le Grand Hotel
// Sections: Hero · Booking Widget · Highlights · Amenities · Gallery · Testimonials · Map · CTA

import HeroSection from '@/components/home/HeroSection'
import BookingWidget from '@/components/home/BookingWidget'
import HotelHighlights from '@/components/home/HotelHighlights'
import AmenitiesSection from '@/components/home/AmenitiesSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import MapSection from '@/components/home/MapSection'
import ExternalBooking from '@/components/home/ExternalBooking'
import CTASection from '@/components/home/CTASection'

export const metadata = {
  title: 'Welcome | Oyugis Le Grand Hotel',
  description:
    'Oyugis Le Grand Hotel — Luxury accommodation, fine dining, and world-class conference facilities in Oyugis, Homa Bay County, Kenya.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BookingWidget />
      <HotelHighlights />
      <AmenitiesSection />
      <GalleryPreview />
      <TestimonialsSection />
      <ExternalBooking />
      <MapSection />
      <CTASection />
    </>
  )
}
