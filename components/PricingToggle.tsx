'use client'

import { Locale, translations } from '@/lib/translations'

const MONTHLY_PRICE = 29
const YEARLY_PRICE = 290

interface PricingToggleProps {
  locale: Locale
  billingPeriod: 'monthly' | 'yearly'
  onBillingChange: (period: 'monthly' | 'yearly') => void
}

export default function PricingToggle({
  locale,
  billingPeriod,
  onBillingChange,
}: PricingToggleProps) {
  const t = translations[locale]

  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
      <button
        type="button"
        onClick={() => onBillingChange('monthly')}
        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
          billingPeriod === 'monthly'
            ? 'bg-white/10 text-white shadow-sm scale-[1.02]'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5 hover:scale-[1.02]'
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onBillingChange('yearly')}
        className={`relative flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-300 ${
          billingPeriod === 'yearly'
            ? 'bg-white/10 text-white shadow-sm scale-[1.02]'
            : 'text-white/50 hover:text-white/70 hover:bg-white/5 hover:scale-[1.02]'
        }`}
      >
        Yearly
        {billingPeriod === 'yearly' && (
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-rh-rest to-rh-rest/80 text-rh-bg rounded shadow-sm animate-pulse-slow">
            {t.saveBadge}
          </span>
        )}
      </button>
    </div>
  )
}
