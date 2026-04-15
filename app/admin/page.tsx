'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase, Entry, Category, CATEGORIES } from '@/lib/supabase'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<Category>('art')
  const [uploading, setUploading] = useState(false)

  // Form state
  const [form, setForm] = useState({
    category: 'art' as Category,
    title: '',
    contestant_name: '',
    description: '',
    poem_text: '',
    display_order: 0,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function login() {
    // Simple password check — not a full auth system
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'maplesyrup2025') {
      setAuthed(true)
      fetchEntries()
    } else {
      setMessage('Incorrect password')
    }
  }

  async function fetchEntries() {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('category')
      .order('display_order')
    setEntries(data ?? [])
  }

  async function handleSubmit() {
    setLoading(true)
    setMessage('')

    let image_url = ''

    // Upload image if provided
    if (imageFile) {
      setUploading(true)
      const ext = imageFile.name.split('.').pop()
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contest-images')
        .upload(filename, imageFile, { cacheControl: '3600', upsert: false })

      if (uploadError) {
        setMessage(`Image upload failed: ${uploadError.message}`)
        setLoading(false)
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('contest-images')
        .getPublicUrl(filename)
      image_url = urlData.publicUrl
      setUploading(false)
    }

    const payload: Record<string, unknown> = {
      category: form.category,
      title: form.title,
      contestant_name: form.contestant_name,
      description: form.description || null,
      display_order: form.display_order,
    }

    if (form.category === 'poem') {
      payload.poem_text = form.poem_text
    } else {
      payload.image_url = image_url || null
    }

    const { error } = await supabase.from('entries').insert(payload)

    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Entry added successfully!')
      setForm({ category: form.category, title: '', contestant_name: '', description: '', poem_text: '', display_order: 0 })
      setImageFile(null)
      if (fileRef.current) fileRef.current.value = ''
      fetchEntries()
    }
    setLoading(false)
  }

  async function deleteEntry(id: string) {
    if (!confirm('Delete this entry and all its votes?')) return
    await supabase.from('entries').delete().eq('id', id)
    fetchEntries()
    setMessage('Entry deleted.')
  }

  const filteredEntries = entries.filter(e => e.category === activeTab)

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid rgba(74,44,10,0.25)',
    borderRadius: '2px',
    background: 'white',
    fontFamily: 'Source Serif 4, serif',
    fontSize: '14px',
    color: 'var(--maple-dark)',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--maple-brown)',
    marginBottom: '4px',
    fontFamily: 'Source Serif 4, serif',
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--maple-cream)' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '4px', width: '360px', boxShadow: '0 4px 24px rgba(74,44,10,0.12)' }}>
          <h1 className="font-display text-2xl font-bold text-center mb-6" style={{ color: 'var(--maple-dark)' }}>
            🍁 Admin Login
          </h1>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ ...inputStyle, marginBottom: '16px' }}
          />
          {message && <p className="text-sm mb-3" style={{ color: 'var(--maple-red)' }}>{message}</p>}
          <button
            onClick={login}
            style={{
              width: '100%',
              padding: '10px',
              background: 'var(--maple-red)',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              fontFamily: 'Source Serif 4, serif',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            Enter Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--maple-cream)', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--maple-dark)' }}>
            🍁 Contest Admin
          </h1>
          <a href="/" target="_blank" style={{ fontSize: '13px', color: 'var(--maple-amber)' }}>
            View Public Page ↗
          </a>
        </div>

        {/* Add Entry Form */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '4px', marginBottom: '32px', boxShadow: '0 2px 12px rgba(74,44,10,0.08)' }}>
          <h2 className="font-display text-xl font-bold mb-5" style={{ color: 'var(--maple-dark)' }}>
            Add New Entry
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as Category })}
                style={inputStyle}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Entry Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Morning Mist"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Contestant Name</label>
              <input
                type="text"
                value={form.contestant_name}
                onChange={e => setForm({ ...form, contestant_name: e.target.value })}
                placeholder="e.g. Sarah Johnson"
                style={inputStyle}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description (optional)</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Short description or media/technique"
                style={inputStyle}
              />
            </div>

            {form.category === 'poem' ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Poem Text</label>
                <textarea
                  value={form.poem_text}
                  onChange={e => setForm({ ...form, poem_text: e.target.value })}
                  rows={6}
                  placeholder="Paste poem here..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                  style={{ ...inputStyle, padding: '6px 12px' }}
                />
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  JPG, PNG, WebP. Recommended: at least 1200px wide.
                </p>
              </div>
            )}
          </div>

          {message && (
            <p className="mt-3 text-sm" style={{ color: message.includes('Error') || message.includes('failed') ? 'var(--maple-red)' : '#2d6a2d' }}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || uploading || !form.title || !form.contestant_name}
            style={{
              marginTop: '20px',
              padding: '10px 28px',
              background: loading ? '#ccc' : '#2C5F2E',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              fontFamily: 'Source Serif 4, serif',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            {uploading ? 'Uploading image…' : loading ? 'Saving…' : 'Add Entry'}
          </button>
        </div>

        {/* Entries list */}
        <div style={{ background: 'white', padding: '28px', borderRadius: '4px', boxShadow: '0 2px 12px rgba(74,44,10,0.08)' }}>
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--maple-dark)' }}>
            Current Entries
          </h2>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(74,44,10,0.1)', paddingBottom: '0' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderBottom: activeTab === cat.id ? '2px solid var(--maple-amber)' : '2px solid transparent',
                  background: 'transparent',
                  fontFamily: 'Source Serif 4, serif',
                  fontSize: '13px',
                  cursor: 'pointer',
                  color: activeTab === cat.id ? 'var(--maple-amber)' : 'var(--text-secondary)',
                  fontWeight: activeTab === cat.id ? 600 : 400,
                  marginBottom: '-1px',
                }}
              >
                {cat.icon} {cat.label} ({entries.filter(e => e.category === cat.id).length})
              </button>
            ))}
          </div>

          {filteredEntries.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '14px' }}>
              No entries yet in this category.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredEntries.map(entry => (
                <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', background: '#faf3e0', borderRadius: '2px' }}>
                  {entry.image_url && (
                    <img src={entry.image_url} alt={entry.title} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
                  )}
                  {entry.poem_text && (
                    <div style={{ width: '64px', height: '48px', background: '#e8d5b0', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>
                      📜
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', fontFamily: 'Playfair Display, serif', color: 'var(--maple-dark)' }}>{entry.title}</p>
                    <p style={{ fontSize: '12px', color: 'var(--maple-amber)' }}>{entry.contestant_name}</p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'right' }}>
                    Order: {entry.display_order}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      padding: '4px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(139,26,26,0.3)',
                      color: 'var(--maple-red)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'Source Serif 4, serif',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
