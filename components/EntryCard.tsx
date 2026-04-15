'use client'
import { useState } from 'react'
import { supabase, Entry } from '@/lib/supabase'
import Lightbox from './Lightbox'

interface EntryCardProps {
  entry: Entry
  hasVoted: boolean
  onVote: (entryId: string) => void
  votedEntryId?: string
}

export default function EntryCard({ entry, hasVoted, onVote, votedEntryId }: EntryCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [voting, setVoting] = useState(false)
  const [localVoteCount, setLocalVoteCount] = useState(entry.vote_count ?? 0)
  const [pulseKey, setPulseKey] = useState(0)
  const isMyVote = votedEntryId === entry.id

  async function handleVote() {
    if (hasVoted || voting) return
    setVoting(true)
    let fingerprint = localStorage.getItem('vmf_voter_id')
    if (!fingerprint) { fingerprint = crypto.randomUUID(); localStorage.setItem('vmf_voter_id', fingerprint) }
    const { error } = await supabase.from('votes').insert({ entry_id: entry.id, category: entry.category, voter_fingerprint: fingerprint })
    if (!error) { setLocalVoteCount(c => c + 1); setPulseKey(k => k + 1); onVote(entry.id) }
    setVoting(false)
  }

  return (
    <>
      <article aria-label={`${entry.title} by ${entry.contestant_name}${isMyVote ? ' — your vote' : ''}`} className="entry-card" style={{ borderRadius: '4px', overflow: 'hidden', background: 'white', border: isMyVote ? '2px solid #C4871A' : '2px solid rgba(44,95,46,0.1)', boxShadow: isMyVote ? '0 4px 20px rgba(196,135,26,0.2)' : '0 2px 12px rgba(44,95,46,0.08)' }}>
        {entry.image_url && (
          <button onClick={() => setLightboxOpen(true)} aria-label={`Enlarge image: ${entry.title} by ${entry.contestant_name}`} style={{ display: 'block', width: '100%', border: 'none', padding: 0, cursor: 'zoom-in', position: 'relative', aspectRatio: '4/3', background: '#f5ede0', overflow: 'hidden' }}>
            <img src={entry.image_url} alt={`${entry.title} by ${entry.contestant_name}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(28,18,8,0.35)', opacity: 0, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'} onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
              <span style={{ color: 'white', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Source Serif 4, serif' }}>Enlarge ↗</span>
            </div>
          </button>
        )}
        {entry.poem_text && (
          <div style={{ padding: '20px', background: 'linear-gradient(135deg, #faf3e0, #f5e8c8)', borderBottom: '1px solid rgba(196,135,26,0.2)', fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.8, color: '#1a2e1a', whiteSpace: 'pre-wrap', minHeight: '120px' }}>
            {entry.poem_text}
          </div>
        )}
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px' }}>
            <h3 className="font-display" style={{ fontSize: '16px', fontWeight: 700, color: '#1a2e1a', lineHeight: 1.3, margin: '0 0 4px' }}>{entry.title}</h3>
            <p style={{ fontSize: '12px', color: '#C4871A', margin: 0 }}>{entry.contestant_name}</p>
            {entry.description && <p style={{ fontSize: '12px', color: '#4a6b4c', marginTop: '6px', lineHeight: 1.5 }}>{entry.description}</p>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#4a6b4c' }} aria-live="polite" aria-atomic="true">
              <span key={pulseKey} className={pulseKey > 0 ? 'voted-pulse' : ''} style={{ fontWeight: 600, color: '#C4871A' }}>{localVoteCount}</span>{' '}{localVoteCount === 1 ? 'vote' : 'votes'}
            </span>
            <button onClick={handleVote} disabled={hasVoted || voting} aria-label={isMyVote ? `Your vote for ${entry.title}` : hasVoted ? 'You have already voted in this category' : `Vote for ${entry.title} by ${entry.contestant_name}`} aria-pressed={isMyVote} style={{ padding: '10px 20px', borderRadius: '2px', fontSize: '13px', fontWeight: 600, fontFamily: 'Source Serif 4, serif', cursor: hasVoted ? 'default' : 'pointer', opacity: voting ? 0.7 : 1, border: hasVoted && !isMyVote ? '1px solid rgba(44,95,46,0.3)' : 'none', background: isMyVote ? '#C4871A' : hasVoted ? 'transparent' : '#2C5F2E', color: isMyVote ? 'white' : hasVoted ? '#4a6b4c' : 'white', minWidth: '90px', textAlign: 'center' }}>
              {isMyVote ? '★ Your Vote' : hasVoted ? 'Voted' : voting ? '…' : '♥ Vote'}
            </button>
          </div>
        </div>
      </article>
      {lightboxOpen && entry.image_url && <Lightbox src={entry.image_url} alt={`${entry.title} by ${entry.contestant_name}`} onClose={() => setLightboxOpen(false)} />}
    </>
  )
}
