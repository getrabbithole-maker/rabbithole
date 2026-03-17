'use client'

import {
  Timer,
  Palette,
  BellOff,
  BarChart2,
  Sparkles,
  Share2,
} from 'lucide-react'
import { Locale, translations } from '@/lib/translations'

interface FeaturesGridProps {
  locale: Locale
}

const featureIcons = [Timer, Palette, BellOff, BarChart2, Sparkles, Share2]
const featureKeys = ['ritual', 'atmospheres', 'aiGuide', 'weather', 'rabbitSpeaks', 'shareCard'] as const

export default function FeaturesGrid({ locale }: FeaturesGridProps) {
  const t = translations[locale]

  const features = featureKeys.map((key, i) => ({
    Icon: featureIcons[i],
    key,
    data: t.features[key],
  }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-white/6 border border-white/6 rounded-xl overflow-hidden">
      {features.map(({ Icon, key, data }) => (
        <div
          key={key}
          className="rh-card-hover bg-rh-bg p-6 space-y-4 cursor-default group"
        >
          <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/8 flex items-center justify-center text-rh-acc-soft group-hover:bg-rh-acc/10 group-hover:border-rh-acc/20 transition-all duration-300">
            <Icon size={18} strokeWidth={1.5} />
          </div>
          <div className="space-y-1.5">
            <h3 className={`font-display text-base font-semibold text-white/90 ${locale === 'th' ? 'font-thai' : ''}`}>
              {data.title}
            </h3>
            <p className={`text-sm text-white/40 leading-relaxed ${locale === 'th' ? 'font-thai' : ''}`}>
              {data.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
