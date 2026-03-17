'use client'

import { useState, useTransition } from 'react'
import { joinWaitlist } from '@/app/actions/waitlist'
import { Locale, translations } from '@/lib/translations'
import type { Plan } from '@/types/waitlist'

interface EmailFormProps {
  locale: Locale
  billingPeriod: Plan
  spotsLeft: number
}

export default function EmailForm({ locale, billingPeriod, spotsLeft }: EmailFormProps) {
  const t = translations[locale]
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !email.includes('@')) {
      setError(locale === 'th' ? 'กรุณากรอกอีเมลที่ถูกต้อง' : 'Please enter a valid email')
      return
    }
    startTransition(async () => {
      const result = await joinWaitlist({ email, plan: billingPeriod, locale })
      if (result.success) {
        setSuccess(true)
      } else if (result.alreadyExists) {
        setError(result.error || t.alreadyOnList)
      } else {
        setError(result.error || 'Something went wrong')
      }
    })
  }

  if (success) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rh-rest/10 rounded border border-rh-rest/20 text-rh-rest text-xs font-mono">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {locale === 'th' ? 'ยืนยันแล้ว' : 'Confirmed'}
        </div>
        <p className="font-display text-xl font-semibold text-white">{t.successHeadline}</p>
        <p className="text-white/50 text-sm">
          {t.successConfirm} <span className="text-white/80">{email}</span>
        </p>
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider">{t.successSub}</p>
      </div>
    )
  }

  if (spotsLeft <= 0) {
    return (
      <div className="space-y-3">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
            <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium">{locale === 'th' ? 'เต็มแล้ว' : 'Fully Booked'}</p>
          <p className="text-white/25 text-xs mt-1">{locale === 'th' ? 'ทุก 100 ที่ถูกจองไปแล้ว' : 'All 100 spots have been claimed'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className="w-full bg-white/[0.04] border border-white/8 px-4 py-3 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-rh-acc/40 focus:ring-1 focus:ring-rh-acc/10 transition-all duration-300 hover:border-white/12 hover:bg-white/[0.06]"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !email}
          className="w-full py-3 bg-gradient-to-r from-rh-acc to-rh-acc-soft hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white text-sm font-semibold tracking-wide transition-all rh-btn-shimmer hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rh-acc/20 hover:shadow-xl hover:shadow-rh-acc/30"
        >
          {isPending ? <span className="opacity-70">...</span> : t.cta}
        </button>
      </form>

      {error && (
        <p className="text-red-400 text-xs font-mono bg-red-400/8 px-3 py-2 rounded border border-red-400/15">{error}</p>
      )}

      <p className="font-mono text-[10px] text-white/25 text-center pt-1">
        {locale === 'th' ? 'ไม่ต้องใช้บัตรเครดิต · ยกเลิกได้ทุกเมื่อ' : 'No credit card · Cancel anytime'}
      </p>
    </div>
  )
}
