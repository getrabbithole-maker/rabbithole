'use client'

import { Locale, translations } from '@/lib/translations'

interface SpotCounterProps {
  locale: Locale
  spotsTaken: number
  spotsLeft: number
  peopleWaiting: number
}

const TOTAL_SEGMENTS = 10

export default function SpotCounter({
  locale,
  spotsTaken,
  spotsLeft,
  peopleWaiting,
}: SpotCounterProps) {
  const t = translations[locale]
  const filledSegments = Math.round((spotsTaken / 100) * TOTAL_SEGMENTS)

  return (
    <div className="space-y-4">
      {/* Live indicator + count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rh-rest animate-pulse-slow" />
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Live</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-white/70">
            <span className="text-white font-medium">{peopleWaiting}</span>
            {' '}{t.peopleWaiting}
          </span>
          <span className="text-white/20">·</span>
          <span className="text-rh-rest font-medium">{spotsLeft} {t.spotsLeft}</span>
        </div>
      </div>

      {/* Segmented progress track */}
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-sm transition-all duration-500"
            style={{
              background: i < filledSegments
                ? 'linear-gradient(to right, #7B4FBE, #B47FE8)'
                : 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>

      {/* Progress label */}
      <p className="font-mono text-[10px] text-white/20 uppercase tracking-wider">
        {spotsTaken}/100 {locale === 'th' ? 'จองแล้ว' : 'spots claimed'}
      </p>
    </div>
  )
}
