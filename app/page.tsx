import { supabase, CATEGORIES } from '@/lib/supabase'

export const revalidate = 60

const CATEGORY_IMAGES: Record<string, string> = {
  art: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  poem: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  window_display: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  photography: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  art: 'Original works celebrating the maple harvest',
  poem: "Written tributes to Vermont's sweetest season",
  window_display: 'Storefront displays honoring the festival',
  photography: 'Images capturing the spirit of maple season',
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data } = await supabase.from('entries').select('category')
  const counts: Record<string, number> = {}
  data?.forEach(e => { counts[e.category] = (counts[e.category] ?? 0) + 1 })
  return counts
}

export default async function HomePage() {
  const counts = await getCategoryCounts()
  return (
    <main id="main-content">
      <div style={{ background: '#1a3d1b', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'Source Serif 4, serif' }}>St. Albans, Vermont · April 24–26, 2026</span>
          <a href="https://vtmaplefestival.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'Source Serif 4, serif' }}>vtmaplefestival.org ↗</a>
        </div>
      </div>

      <header style={{ background: 'linear-gradient(180deg, #1a3d1b 0%, #2C5F2E 70%, #3d7a40 100%)', borderBottom: '4px solid #C4871A', padding: 'clamp(40px, 8vw, 80px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05, pointerEvents: 'none' }}>
          <svg viewBox="0 0 200 200" width="500" height="500" fill="white"><path d="M100 10 L115 60 L170 45 L140 85 L185 100 L140 115 L170 155 L115 140 L100 190 L85 140 L30 155 L60 115 L15 100 L60 85 L30 45 L85 60 Z"/></svg>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src="https://static.wixstatic.com/media/d0a5af_c5385218979244fe9172bfcd4a9b5aa3~mv2.png/v1/fill/w_234,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20Project%20(3)_edited.png" alt="Vermont Maple Festival" style={{ height: 'clamp(60px, 10vw, 90px)', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </div>
          <p style={{ color: 'rgba(212,160,23,0.9)', fontFamily: 'Source Serif 4, serif', letterSpacing: '0.3em', fontSize: '11px', textTransform: 'uppercase', marginBottom: '12px' }}>Vermont Maple Festival</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, color: 'white', lineHeight: 1.1, margin: '0 0 8px' }}>
            People&apos;s Choice<br /><span style={{ color: '#D4A017' }}>Awards</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Source Serif 4, serif', fontStyle: 'italic', fontSize: 'clamp(14px, 3vw, 16px)', maxWidth: '480px', margin: '16px auto 0', lineHeight: 1.6 }}>
            Thank you to everyone who voted!
          </p>
        </div>
      </header>

      {/* Voting Closed Banner */}
      <div style={{ background: '#C4871A', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: 'white', fontFamily: 'Source Serif 4, serif', fontSize: 'clamp(14px, 2vw, 16px)', margin: 0, fontWeight: 600 }}>
          🍁 Voting is now closed · Winners will be announced on our{' '}
          <a href="https://www.facebook.com/VermontMapleFestival" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'underline' }}>
            Facebook page
          </a>
        </p>
      </div>

      <section id="categories" aria-label="Contest categories" style={{ background: '#FAF7F0', padding: 'clamp(32px, 6vw, 60px) clamp(16px, 4vw, 24px)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: 'clamp(16px, 3vw, 28px)' }}>
            {CATEGORIES.map(cat => {
              const count = counts[cat.id] ?? 0
              return (
                <article key={cat.id} style={{ borderRadius: '4px', overflow: 'hidden', background: 'white', border: '1px solid rgba(44,95,46,0.12)', boxShadow: '0 4px 20px rgba(44,95,46,0.08)', opacity: 0.75 }}>
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#2C5F2E' }}>
                    <img src={CATEGORY_IMAGES[cat.id]} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'grayscale(40%)' }} />
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,61,27,0.7) 0%, transparent 60%)' }} />
                    <div aria-hidden="true" style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '28px' }}>{cat.icon}</div>
                    {count > 0 && (
                      <div aria-hidden="true" style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(26,61,27,0.85)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Source Serif 4, serif' }}>
                        {count} {count === 1 ? 'entry' : 'entries'}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                    <h2 className="font-display" style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#1a2e1a', marginBottom: '8px' }}>{cat.label}</h2>
                    <p style={{ fontSize: '14px', color: '#4a6b4c', fontFamily: 'Source Serif 4, serif', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>{CATEGORY_DESCRIPTIONS[cat.id]}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 24px', background: '#9ab89b', color: 'white', borderRadius: '2px', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: 600, cursor: 'default' }}>
                      Voting Closed
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <footer role="contentinfo" style={{ background: '#1a3d1b', borderTop: '4px solid #C4871A', padding: '32px 16px', textAlign: 'center' }}>
        <img src="https://static.wixstatic.com/media/d0a5af_c5385218979244fe9172bfcd4a9b5aa3~mv2.png/v1/fill/w_234,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20Project%20(3)_edited.png" alt="Vermont Maple Festival" style={{ height: '48px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.6, margin: '0 auto 12px', display: 'block' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '12px' }}>Vermont Maple Festival · People&apos;s Choice Awards · 2026</p>
        <p style={{ marginTop: '4px' }}><a href="https://vtmaplefestival.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>vtmaplefestival.org</a></p>
      </footer>
    </main>
  )
}
