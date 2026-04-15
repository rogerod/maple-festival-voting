'use client'
import { useState, useEffect } from 'react'
import { Entry, Category, CATEGORIES } from '@/lib/supabase'
import CategorySection from './CategorySection'

interface VotingTabsProps {
  entriesByCategory: Record<string, Entry[]>
}

export default function VotingTabs({ entriesByCategory }: VotingTabsProps) {
  const [activeTab, setActiveTab] = useState<Category>('art')
  const [votedCategories, setVotedCategories] = useState<Set<Category>>(new Set())

  useEffect(() => {
    const voted = new Set<Category>()
    CATEGORIES.forEach(cat => {
      if (localStorage.getItem(`vmf_vote_${cat.id}`)) voted.add(cat.id)
    })
    setVotedCategories(voted)
  }, [])

  function handleVote(category: Category) {
    setVotedCategories(prev => new Set([...prev, category]))
  }

  const totalVoted = votedCategories.size
  const totalCategories = CATEGORIES.length

  return (
    <div style={{ background: '#FAF7F0', minHeight: '60vh' }}>
      <div style={{ background: '#2C5F2E', padding: '12px 24px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontFamily: 'Source Serif 4, serif', fontStyle: 'italic', margin: 0 }}>
            {totalVoted === 0 ? "Pick a category below to start voting" : totalVoted === totalCategories ? "🏆 You've voted in all categories!" : `Voted in ${totalVoted} of ${totalCategories} categories`}
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} style={{ width: '10px', height: '10px', borderRadius: '50%', background: votedCategories.has(cat.id) ? '#D4A017' : 'rgba(255,255,255,0.3)', transition: 'background 0.3s ease' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: 'white', borderBottom: '2px solid rgba(44,95,46,0.12)', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(44,95,46,0.08)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeTab === cat.id
              const hasVoted = votedCategories.has(cat.id)
              const entryCount = entriesByCategory[cat.id]?.length ?? 0
              return (
                <button key={cat.id} onClick={() => setActiveTab(cat.id)} style={{ padding: '16px 24px', border: 'none', borderBottom: isActive ? '3px solid #2C5F2E' : '3px solid transparent', background: 'transparent', fontFamily: 'Source Serif 4, serif', fontSize: '14px', fontWeight: isActive ? 700 : 400, color: isActive ? '#2C5F2E' : '#4a6b4c', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s ease', flexShrink: 0 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {hasVoted && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A017', flexShrink: 0 }} />}
                  {entryCount > 0 && <span style={{ fontSize: '11px', background: isActive ? '#2C5F2E' : 'rgba(44,95,46,0.12)', color: isActive ? 'white' : '#4a6b4c', padding: '1px 7px', borderRadius: '10px', fontWeight: 600 }}>{entryCount}</span>}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {CATEGORIES.map(cat => (
          <div key={cat.id} style={{ display: activeTab === cat.id ? 'block' : 'none' }}>
            <CategorySection categoryId={cat.id} label={cat.label} icon={cat.icon} entries={entriesByCategory[cat.id] ?? []} onVote={() => handleVote(cat.id)} />
          </div>
        ))}
        {(() => {
          const currentIndex = CATEGORIES.findIndex(c => c.id === activeTab)
          const nextCat = CATEGORIES[currentIndex + 1]
          if (!nextCat) return null
          return (
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(44,95,46,0.1)' }}>
              <button onClick={() => { setActiveTab(nextCat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ padding: '14px 40px', background: '#2C5F2E', color: 'white', border: 'none', borderRadius: '2px', fontFamily: 'Source Serif 4, serif', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                Next: {nextCat.icon} {nextCat.label} →
              </button>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
