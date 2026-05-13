import './globals.css'
import { Playfair_Display, Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { Toaster } from 'react-hot-toast'
import CookieConsent from '@/components/CookieConsent'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Oyugis Le Grand Hotel | Oyugis, Kenya',
    template: '%s | Oyugis Le Grand Hotel',
  },
  description:
    'Experience luxury and authentic Kenyan hospitality at Oyugis Le Grand Hotel, Homa Bay County. Book rooms, conference halls, and restaurant reservations.',
  keywords: ['hotel', 'oyugis', 'kenya', 'homa bay', 'luxury hotel', 'accommodation', 'conference', 'restaurant'],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Oyugis Le Grand Hotel',
    title: 'Oyugis Le Grand Hotel | Oyugis, Kenya',
    description: 'Luxury & Comfort in the Heart of Oyugis, Kenya.',
    /* REPLACE: Add /public/og-image.jpg */
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        {/* Preload hero image for fast LCP */}
        <link rel="preload" as="image" href="/images/Side%20View.jpg" />
      </head>
      <body className="font-body antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#5BBFD9', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
