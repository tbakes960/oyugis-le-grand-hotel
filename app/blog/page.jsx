import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description: 'Hotel news, travel tips, local experiences, and food stories from Oyugis Le Grand Hotel, Kenya.',
}

// REPLACE: These are placeholder blog posts. Replace with real content from your CMS/database.
// For dynamic blogs, fetch from /api/blog in a server component or use getServerSideProps
const PLACEHOLDER_POSTS = [
  {
    slug: 'placeholder-1',
    category: 'Travel',
    title: 'Your Blog Post Title Will Appear Here',
    excerpt: 'Add a compelling excerpt here that summarises the post and encourages readers to click through and read the full article.',
    author: 'Hotel Team',
    date: 'April 2026',
    readTime: '3 min read',
    gradient: 'from-sky-800 to-sky-600',
  },
  {
    slug: 'placeholder-2',
    category: 'Food',
    title: 'Add Your Second Blog Post Here',
    excerpt: 'Showcase your restaurant specials, new menu items, chef features, or the story behind your signature dishes.',
    author: 'Hotel Team',
    date: 'April 2026',
    readTime: '4 min read',
    gradient: 'from-brown-700 to-brown-500',
  },
  {
    slug: 'placeholder-3',
    category: 'Local Experiences',
    title: 'Discover Local Attractions Around Oyugis',
    excerpt: 'Guide your guests through the best local experiences — from Lake Victoria to Simbi Nyaima, share what makes Oyugis special.',
    author: 'Hotel Team',
    date: 'April 2026',
    readTime: '5 min read',
    gradient: 'from-hotel-dark to-sky-800',
  },
  {
    slug: 'placeholder-4',
    category: 'Hotel News',
    title: 'Hotel News and Announcements',
    excerpt: 'Share hotel updates, new services, seasonal offers, upcoming events, and other announcements with your guests.',
    author: 'Management',
    date: 'April 2026',
    readTime: '2 min read',
    gradient: 'from-gold-700 to-gold-500',
  },
]

const CATEGORIES = ['All', 'Travel', 'Food', 'Local Experiences', 'Hotel News']

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/Side%20View.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">Oyugis Le Grand Hotel</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">Blog &amp; Stories</h1>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-7xl mx-auto px-6">

          {/* Category Filter — static in this version */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {CATEGORIES.map(cat => (
              <span
                key={cat}
                className={`px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full border cursor-pointer
                  ${cat === 'All'
                    ? 'bg-sky-400 border-sky-400 text-white'
                    : 'border-gray-200 text-hotel-muted bg-white'
                  }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {PLACEHOLDER_POSTS.map((post) => (
              <article key={post.slug} className="card overflow-hidden group">
                {/* Cover */}
                <div className={`relative h-52 bg-gradient-to-br ${post.gradient}`}>
                  {/* REPLACE: <Image src={post.coverImage} alt={post.title} fill className="object-cover" /> */}
                  <div className="img-placeholder h-full">ADD COVER IMAGE</div>
                  <span className="absolute top-3 left-3 bg-white/90 text-hotel-dark text-xs font-semibold px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-hotel-muted mb-3">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-hotel-dark mb-3 leading-snug
                                 group-hover:text-sky-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-hotel-muted leading-relaxed mb-5">{post.excerpt}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-hotel-muted">By {post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-sky-400 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Admin Note */}
          <div className="mt-12 bg-sky-50 border border-sky-100 rounded-lg p-5 text-center max-w-xl mx-auto">
            <p className="text-sm text-hotel-muted">
              <strong className="text-sky-400">Admin tip:</strong> Manage and publish blog posts from the{' '}
              <Link href="/admin/blog" className="text-sky-400 underline">Admin Panel → Blog</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
