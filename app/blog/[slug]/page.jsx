import Link from 'next/link'
import { getAll } from '@/lib/store'
import { notFound } from 'next/navigation'
import { Calendar, ArrowLeft, User } from 'lucide-react'

export async function generateMetadata({ params }) {
  const posts = await getAll('blog')
  const post  = posts.find(p => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title:       post.metaTitle   || post.title,
    description: post.metaDesc    || post.excerpt,
  }
}

export default async function BlogPostPage({ params }) {
  const posts = await getAll('blog')
  const post  = posts.find(p => p.slug === params.slug && p.status === 'PUBLISHED')

  if (!post) notFound()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ backgroundImage: "url('/images/Side%20View.jpg')", backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="page-hero-overlay" />
        <div className="page-hero-content max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-gold-400 mb-2">{post.category}</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-snug">{post.title}</h1>
          <div className="flex items-center justify-center gap-5 mt-4 text-white/50 text-xs">
            {date && (
              <span className="flex items-center gap-1.5"><Calendar size={12} />{date}</span>
            )}
            {post.authorName && (
              <span className="flex items-center gap-1.5"><User size={12} />{post.authorName}</span>
            )}
          </div>
        </div>
      </div>

      <section className="py-20 bg-hotel-surface">
        <div className="max-w-3xl mx-auto px-6">
          <article className="bg-white rounded-2xl shadow-card p-10
                              prose prose-sm max-w-none
                              [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-hotel-dark [&_h2]:mt-8 [&_h2]:mb-4
                              [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-hotel-dark
                              [&_p]:text-hotel-muted [&_p]:leading-relaxed [&_p]:mb-4
                              [&_ul]:text-hotel-muted [&_ul]:leading-relaxed
                              [&_strong]:text-hotel-dark">
            {post.excerpt && (
              <p className="text-base text-hotel-muted border-l-4 border-gold-400 pl-4 mb-8 not-prose">
                {post.excerpt}
              </p>
            )}
            {/* Content is plain text from the admin panel — render with line breaks preserved */}
            {post.content.split('\n').map((line, i) =>
              line.trim() ? <p key={i}>{line}</p> : <br key={i} />
            )}
          </article>

          <div className="mt-10 text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sky-400 text-sm hover:underline">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
