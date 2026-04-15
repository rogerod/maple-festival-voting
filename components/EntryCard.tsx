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

    // Get/create voter fingerprint
    let fingerprint = localStorage.getItem('vmf_voter_id')
    if (!fingerprint) {
      fingerprint = crypto.randomUUID()
      localStorage.setItem('vmf_voter_id', fingerprint)
    }

    const { error } = await supabase.from('votes').insert({
      entry_id: entry.id,
      category: entry.category,
      voter_fingerprint: fingerprint,
    })

    if (!error) {
      setLocalVoteCount(c => c + 1)
      setPulseKey(k => k + 1)
      onVote(entry.id)
    }
    setVoting(false)
  }

  return (
    <>
      <div
        className="entry-card rounded-sm overflow-hidden"
        style={{
          background: 'white',
          border: isMyVote ? '2px solid var(--maple-amber)' : '2px solid rgba(74,44,10,0.1)',
          boxShadow: isMyVote
            ? '0 4px 20px rgba(196,115,26,0.25)'
            : '0 2px 12px rgba(74,44,10,0.08)',
        }}
      >
        {/* Image entries */}
        {entry.image_url && (
          <div
            className="relative cursor-zoom-in overflow-hidden group"
            style={{ aspectRatio: '4/3', background: '#f5ede0' }}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={entry.image_url}
              alt={entry.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(28,18,8,0.35)' }}>
              <span className="text-white text-sm tracking-widest uppercase"
                style={{ fontFamily: 'Source Serif 4, serif', letterSpacing: '0.15em' }}>
                Enlarge ↗
              </span>
            </div>
          </div>
        )}

        {/* Poem entries */}
        {entry.poem_text && (
          <div
            className="p-5 italic leading-relaxed text-sm"
            style={{
              background: 'linear-gradient(135deg, #faf3e0, #f5e8c8)',
              borderBottom: '1px solid rgba(196,115,26,0.2)',
              fontFamily: 'Playfair Display, Georgia, serif',
              color: 'var(--maple-dark)',
              minHeight: '140px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {entry.poem_text}
          </div>
        )}

        {/* Card footer */}
        <div className="p-4">
          <div className="mb-3">
            <h3
              className="font-display font-bold text-base leading-tight"
              style={{ color: 'var(--maple-dark)' }}
            >
              {entry.title}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--maple-amber)' }}>
              {entry.contestant_name}
            </p>
            {entry.description && (
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {entry.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {/* Vote count */}
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span
                key={pulseKey}
                className={pulseKey > 0 ? 'voted-pulse inline-block' : ''}
                style={{ fontWeight: 600, color: 'var(--maple-amber)' }}
              >
                {localVoteCount}
              </span>{' '}
              {localVoteCount === 1 ? 'vote' : 'votes'}
            </span>

            {/* Vote button */}
            <button
              onClick={handleVote}
              disabled={hasVoted || voting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold transition-all duration-200"
              style={{
                fontFamily: 'Source Serif 4, serif',
                letterSpacing: '0.06em',
                background: isMyVote
                  ? 'var(--maple-amber)'
                  : hasVoted
                  ? 'transparent'
                  : '#2C5F2E',
                color: isMyVote
                  ? 'white'
                  : hasVoted
                  ? 'var(--maple-brown)'
                  : 'white',
                border: hasVoted && !isMyVote ? '1px solid var(--maple-brown)' : 'none',
                cursor: hasVoted ? 'default' : 'pointer',
                opacity: voting ? 0.7 : 1,
              }}
            >
              {isMyVote ? '★ Your Vote' : hasVoted ? 'Voted' : voting ? '…' : '♥ Vote'}
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && entry.image_url && (
        <Lightbox
          src={entry.image_url}
          alt={`${entry.title} by ${entry.contestant_name}`}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
