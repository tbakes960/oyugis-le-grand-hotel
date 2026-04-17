import { NextResponse } from 'next/server'
import { append, getAll } from '@/lib/store'
import { requireRole } from '@/lib/auth'

// Only URL-safe characters: letters, digits, hyphens (no dots, slashes, etc.)
const SLUG_RE = /^[a-z0-9-]{1,100}$/

const VALID_STATUSES  = ['DRAFT', 'PUBLISHED']
const VALID_CATEGORIES = [
  'Hotel News', 'Travel Tips', 'Dining & Cuisine', 'Events',
  'Local Culture', 'Sustainability', 'Wellness', 'Other',
]

/** GET /api/blog — return all published blog posts (public) */
export async function GET() {
  const posts = await getAll('blog')
  return NextResponse.json([...posts].reverse())
}

/** POST /api/blog — create a blog post (admin only) */
export async function POST(request) {
  const auth = await requireRole(request, ['ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, authorName, status, metaTitle, metaDesc } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 })
    }

    if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 200) {
      return NextResponse.json({ error: 'Title must be 3–200 characters' }, { status: 400 })
    }

    const cleanSlug = String(slug).toLowerCase().trim()
    if (!SLUG_RE.test(cleanSlug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase letters, digits, and hyphens only (max 100 chars)' },
        { status: 400 }
      )
    }

    if (typeof content !== 'string' || content.trim().length < 10) {
      return NextResponse.json({ error: 'Content is too short' }, { status: 400 })
    }

    const parsedStatus   = VALID_STATUSES.includes(status) ? status : 'DRAFT'
    const parsedCategory = VALID_CATEGORIES.includes(category) ? category : 'Hotel News'

    const post = {
      id:          crypto.randomUUID(),
      title:       title.trim().slice(0, 200),
      slug:        cleanSlug,
      excerpt:     excerpt     ? String(excerpt).trim().slice(0, 500)     : '',
      content:     content.trim().slice(0, 100_000),
      category:    parsedCategory,
      authorName:  authorName  ? String(authorName).trim().slice(0, 100)  : 'Hotel Team',
      status:      parsedStatus,
      metaTitle:   metaTitle   ? String(metaTitle).trim().slice(0, 200)   : '',
      metaDesc:    metaDesc    ? String(metaDesc).trim().slice(0, 300)    : '',
      publishedAt: parsedStatus === 'PUBLISHED' ? new Date().toISOString() : null,
      createdAt:   new Date().toISOString(),
    }

    await append('blog', post)

    return NextResponse.json({ id: post.id, slug: post.slug }, { status: 201 })
  } catch (err) {
    console.error('[blog POST]', err)
    return NextResponse.json({ error: 'Failed to save post.' }, { status: 500 })
  }
}
