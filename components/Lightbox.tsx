'use client'
import { useEffect, useCallback } from 'react'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(28,18,8,0.92)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="lightbox-enter relative max-w-5xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-sm tracking-widest uppercase"
          style={{ fontFamily: 'Source Serif 4, serif' }}
        >
          Close ✕
        </button>

        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded-sm"
          style={{ maxHeight: '85vh', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        />

        <p
          className="text-center mt-3 text-white/60 text-sm italic"
          style={{ fontFamily: 'Source Serif 4, serif' }}
        >
          {alt}
        </p>
      </div>
    </div>
  )
}
