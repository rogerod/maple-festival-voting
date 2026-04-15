'use client'
import { useState, useEffect } from 'react'
import { Entry, Category } from '@/lib/supabase'
import EntryCard from './EntryCard'

interface CategorySectionProps {
  categoryId: Category
  label: string
  icon: string
  entries: Entry[]
  onVote?: () => void
}

export default function CategorySection({ categoryId, label, icon, entries, onVote }: CategorySectionProps) {
  const [votedEntryId, setVotedEntryId] = useState<string | undefined>()

  useEffect(() => {
    const stored = localStorage.getItem(`vmf_vote_${categoryId}`)
    if (stored) setVotedEntryId(stored)
  }, [categoryId])

  function handleVote(entryId: string) {
    localStorage.setItem(`vmf_vote_${categoryId}`, entryId)
    setVotedEntryId(entryId)
    onVote?.()
  }

  const hasVoted = !!votedEntryId

  if (entries.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <p style={{ color: '#4a6b4c', fontStyle: 'italic', fontSize: '16px', fontFamily: 'Source Serif 4, serif' }}>No entries yet in this category.</p>
    </div>
  )

  return (
    <section>
      <div className="mb-8 text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h2 className="font-display text-3xl font-bold" style={{ color: '#1a2e1a' }}>{label}</h2>
        {hasVoted ? (
          <p className="mt-2 text-sm" style={{ color: '#2C5F2E', fontStyle: 'italic' }}>Your vote has been cast ✓</p>
        ) : (
          <p className="mt-2 text-sm" style={{ color: '#4a6b4c', fontStyle: 'italic' }}>Cast your vote for the best entry</p>
        )}
      </div>
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {entries.map(entry => (
          <EntryCard key={entry.id} entry={entry} hasVoted={hasVoted} onVote={handleVote} votedEntryId={votedEntryId} />
        ))}
      </div>
    </section>
  )
}
