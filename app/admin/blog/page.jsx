'use client'

import { useState } from 'react'
import { FileText, Plus, Pencil, Eye, Trash2 } from 'lucide-react'

export default function AdminBlogPage() {
  const [posts] = useState([]) // REPLACE: fetch from DB
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: 'Hotel News',
    authorName: '', status: 'DRAFT', metaTitle: '', metaDesc: ''
  })

  const CATEGORIES = ['Travel', 'Food', 'Local Experiences', 'Hotel News']

  const handleSave = async (status) => {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status }),
    })
    if (res.ok) {
      alert('Post saved!')
      setShowForm(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-hotel-dark">Blog</h1>
          <p className="text-hotel-muted text-sm mt-1">Create and manage blog posts</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2.5">
          <Plus size={14} /> New Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-card p-8 mb-8">
          <h3 className="font-heading text-lg font-semibold text-hotel-dark mb-6">New Blog Post</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title}
                  onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') })) }}
                  placeholder="Blog post title" />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">URL Slug</label>
                <input className="form-input font-mono text-sm" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Author Name</label>
                <input className="form-input" value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} placeholder="e.g. Hotel Team" />
              </div>
            </div>
            <div>
              <label className="form-label">Excerpt</label>
              <textarea className="form-input" rows="2" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary of the post..." />
            </div>
            <div>
              <label className="form-label">Content *</label>
              <textarea className="form-input" rows="10" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your blog post content here (Markdown supported)..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">SEO Title</label>
                <input className="form-input" value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))} placeholder="Optional override for browser title" />
              </div>
              <div>
                <label className="form-label">SEO Description</label>
                <input className="form-input" value={form.metaDesc} onChange={e => setForm(f => ({ ...f, metaDesc: e.target.value }))} placeholder="For search engine snippets" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleSave('DRAFT')} className="btn-outline-dark text-xs py-2.5">Save Draft</button>
              <button onClick={() => handleSave('PUBLISHED')} className="btn-primary text-xs py-2.5">Publish</button>
              <button onClick={() => setShowForm(false)} className="text-sm text-hotel-muted hover:text-hotel-dark ml-2">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-hotel-muted">
                  <FileText size={28} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No blog posts yet. Click "New Post" to create one.</p>
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id}>
                  <td className="font-medium max-w-xs truncate">{post.title}</td>
                  <td>{post.category}</td>
                  <td>{post.authorName}</td>
                  <td><span className={`badge ${post.status === 'PUBLISHED' ? 'badge-green' : 'badge-yellow'}`}>{post.status}</span></td>
                  <td>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}</td>
                  <td className="flex gap-2">
                    <button className="text-sky-400 hover:text-sky-600"><Eye size={14} /></button>
                    <button className="text-hotel-muted hover:text-hotel-dark"><Pencil size={14} /></button>
                    <button className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
