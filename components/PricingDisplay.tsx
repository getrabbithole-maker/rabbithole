'use client'

import { Locale, translations } from '@/lib/translations'

interface PricingDisplayProps {
  locale: Locale
  billingPeriod: 'monthly' | 'yearly'
}

export default function PricingDisplay({ locale, billingPeriod }: PricingDisplayProps) {
  const t = translations[locale]

  const isMonthly = billingPeriod === 'monthly'

  return (
    <div className="mt-6">
      {/* Price display with strikethrough */}
      <div className="space-y-3">
        {/* Regular price (strikethrough) */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl text-white/30 line-through font-display">
            {isMonthly ? t.regularMonthlyPrice : t.regularYearlyPrice}
          </span>
          <span className="text-sm text-white/30">
            {isMonthly ? t.perMonthLabel : t.perYearLabel}
          </span>
        </div>

        {/* Early access price */}
        <div className="flex items-baseline gap-3">
          <span className="text-[52px] font-bold leading-none bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {isMonthly ? t.earlyAccessMonthlyPrice : t.earlyAccessYearlyPrice}
          </span>
          <span className="text-lg text-white/50">
            {isMonthly ? t.monthlyLabel : t.yearlyLabel}
          </span>
        </div>

        {/* Goes to regular price message */}
        <div className="flex items-center gap-2 pt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="font-mono text-xs text-white/40 uppercase tracking-wider whitespace-nowrap">
            {t.goesToLabel} {isMonthly ? t.regularMonthlyPrice : t.regularYearlyPrice}
            {isMonthly ? t.perMonthLabel : t.perYearLabel} {t.afterLaunchLabel}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}
