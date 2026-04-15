import { supabase, CATEGORIES, Entry } from '@/lib/supabase'
import CategorySection from '@/components/CategorySection'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ category: cat.id }))
}

async function getEntriesWithVotes(category: string): Promise<Entry[]> {
  const { data: entries } = await supabase.from('entries').select('*').eq('category', category).order('display_order', { ascending: true })
  const { data: votes } = await supabase.from('votes').select('entry_id')
  const voteCounts: Record<string, number> = {}
  votes?.forEach(v => { voteCounts[v.entry_id] = (voteCounts[v.entry_id] ?? 0) + 1 })
  return (entries ?? []).map(e => ({ ...e, vote_count: voteCounts[e.id] ?? 0 }))
}

export default async function VoteCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = CATEGORIES.find(c => c.id === category)
  if (!cat) notFound()
  const entries = await getEntriesWithVotes(category)
  const currentIndex = CATEGORIES.findIndex(c => c.id === category)
  const prevCat = CATEGORIES[currentIndex - 1]
  const nextCat = CATEGORIES[currentIndex + 1]

  return (
    <main className="min-h-screen">
      <div style={{ background: '#1a3d1b', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: 'Source Serif 4, serif', textDecoration: 'none' }}>← All Categories</Link>
          <a href="https://vtmaplefestival.org" target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Source Serif 4, serif' }}>vtmaplefestival.org ↗</a>
        </div>
      </div>
      <header className="py-10 text-center" style={{ background: 'linear-gradient(180deg, #1a3d1b 0%, #2C5F2E 100%)', borderBottom: '4px solid #C4871A' }}>
        <div className="px-4">
          <div className="flex justify-center mb-4">
            <img src="https://static.wixstatic.com/media/d0a5af_c5385218979244fe9172bfcd4a9b5aa3~mv2.png/v1/fill/w_234,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Untitled%20Project%20(3)_edited.png" alt="Vermont Maple Festival" style={{ height: '56px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }} />
          </div>
          <p className="text-xs uppercase mb-2" style={{ color: 'rgba(212,160,23,0.9)', fontFamily: 'Source Serif 4, serif', letterSpacing: '0.3em' }}>People&apos;s Choice Awards</p>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white">{cat.icon} {cat.label}</h1>
          <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Source Serif 4, serif', fontStyle: 'italic' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · Cast your vote below
          </p>
        </div>
      </header>
      <div style={{ background: '#FAF7F0', padding: '48px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <CategorySection categoryId={cat.id as any} label={cat.label} icon={cat.icon} entries={entries} />
        </div>
      </div>
      <div style={{ background: 'white', borderTop: '1px solid rgba(44,95,46,0.1)', padding: '24px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {prevCat ? (
            <Link href={`/vote/${prevCat.id}`} style={{ padding: '10px 20px', border: '1px solid rgba(44,95,46,0.3)', borderRadius: '2px', color: '#2C5F2E', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← {prevCat.icon} {prevCat.label}</Link>
          ) : (
            <Link href="/" style={{ padding: '10px 20px', border: '1px solid rgba(44,95,46,0.3)', borderRadius: '2px', color: '#2C5F2E', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← All Categories</Link>
          )}
          <Link href="/" style={{ color: '#4a6b4c', fontFamily: 'Source Serif 4, serif', fontSize: '13px', textDecoration: 'none', fontStyle: 'italic' }}>All Categories</Link>
          {nextCat ? (
            <Link href={`/vote/${nextCat.id}`} style={{ padding: '10px 20px', background: '#2C5F2E', borderRadius: '2px', color: 'white', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>{nextCat.icon} {nextCat.label} →</Link>
          ) : (
            <Link href="/" style={{ padding: '10px 20px', background: '#2C5F2E', borderRadius: '2px', color: 'white', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Done — All Categories →</Link>
          )}
        </div>
      </div>
      <footer className="py-6 text-center" style={{ background: '#1a3d1b' }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Vermont Maple Festival · People&apos;s Choice Awards</p>
      </footer>
    </main>
  )
}
