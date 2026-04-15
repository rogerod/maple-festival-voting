import { supabase, CATEGORIES, Entry } from '@/lib/supabase'

export const revalidate = 60

async function getResults(): Promise<Record<string, Entry[]>> {
  const { data: entries } = await supabase.from('entries').select('*')
  const { data: votes } = await supabase.from('votes').select('entry_id')

  const voteCounts: Record<string, number> = {}
  votes?.forEach(v => { voteCounts[v.entry_id] = (voteCounts[v.entry_id] ?? 0) + 1 })

  const grouped: Record<string, Entry[]> = {}
  entries?.forEach(entry => {
    const e = { ...entry, vote_count: voteCounts[entry.id] ?? 0 }
    if (!grouped[entry.category]) grouped[entry.category] = []
    grouped[entry.category].push(e)
  })

  // Sort each category by votes desc
  Object.keys(grouped).forEach(cat => {
    grouped[cat].sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
  })

  return grouped
}

export default async function ResultsPage() {
  const results = await getResults()

  return (
    <main style={{ background: 'var(--maple-cream)', minHeight: '100vh' }}>
      <header className="py-12 text-center"
        style={{ background: 'linear-gradient(180deg, #3d1505 0%, #8B1A1A 100%)', borderBottom: '4px solid var(--maple-gold)' }}>
        <p className="text-xs tracking-widest uppercase mb-2"
          style={{ color: 'rgba(212,160,23,0.8)', fontFamily: 'Source Serif 4, serif', letterSpacing: '0.3em' }}>
          Vermont Maple Festival
        </p>
        <h1 className="font-display text-4xl font-black text-white">
          People's Choice <span style={{ color: 'var(--maple-gold)' }}>Results</span>
        </h1>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
        {CATEGORIES.map(cat => {
          const catEntries = results[cat.id] ?? []
          const winner = catEntries[0]
          if (!winner) return null

          return (
            <div key={cat.id} style={{
              background: 'white',
              borderRadius: '4px',
              padding: '28px',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(74,44,10,0.08)',
              border: '1px solid rgba(196,115,26,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                <h2 className="font-display text-xl font-bold" style={{ color: 'var(--maple-dark)' }}>
                  {cat.label}
                </h2>
              </div>

              {/* Winner */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: '#faf3e0', borderRadius: '4px', borderLeft: '4px solid var(--maple-gold)' }}>
                {winner.image_url && (
                  <img src={winner.image_url} alt={winner.title}
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--maple-gold)', fontWeight: 700, marginBottom: '2px' }}>
                    🏆 Winner
                  </p>
                  <p className="font-display font-bold" style={{ fontSize: '18px', color: 'var(--maple-dark)' }}>{winner.title}</p>
                  <p style={{ fontSize: '13px', color: 'var(--maple-amber)' }}>{winner.contestant_name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {winner.vote_count} {winner.vote_count === 1 ? 'vote' : 'votes'}
                  </p>
                </div>
              </div>

              {/* Runners up */}
              {catEntries.slice(1).map((entry, i) => (
                <div key={entry.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(74,44,10,0.06)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', minWidth: '20px' }}>
                    {i + 2}.
                  </span>
                  <div style={{ flex: 1 }}>
                    <span className="font-display" style={{ fontSize: '14px', color: 'var(--maple-dark)' }}>{entry.title}</span>
                    <span style={{ fontSize: '12px', color: 'var(--maple-amber)', marginLeft: '8px' }}>— {entry.contestant_name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entry.vote_count} votes</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </main>
  )
}
