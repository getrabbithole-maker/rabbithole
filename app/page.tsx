'use client'

import { useState, useEffect } from 'react'
import { Share2, Hourglass, Brain, BarChart3, Headphones } from 'lucide-react'
import Image from 'next/image'
import { Locale, translations } from '@/lib/translations'
import type { Plan } from '@/types/waitlist'
import StarField from '@/components/StarField'
import SpotCounter from '@/components/SpotCounter'
import PricingToggle from '@/components/PricingToggle'
import PricingDisplay from '@/components/PricingDisplay'
import EmailForm from '@/components/EmailForm'
import SessionPreview from '@/components/SessionPreview'
import FeaturesGrid from '@/components/FeaturesGrid'
import { useScrollRevealAll } from '@/hooks/useScrollReveal'

const TOTAL_SPOTS = 100

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en')
  const [billingPeriod, setBillingPeriod] = useState<Plan>('monthly')
  const [waitlistCount, setWaitlistCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  const t = translations[locale]

  // Enable scroll reveal animations
  useScrollRevealAll(0.15)

  // Fetch initial count and set up real-time subscription
  useEffect(() => {
    let channel: any | null = null

    const setupRealtimeSubscription = async () => {
      try {
        // Fetch initial count
        const countRes = await fetch('/api/waitlist-count')
        const countData = await countRes.json()
        setWaitlistCount(countData.count || 0)
        setIsLoading(false)

        // Set up real-time subscription to Supabase
        const { createClient } = await import('@supabase/supabase-js')

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createClient(supabaseUrl, supabaseAnonKey)

          channel = supabase
            .channel('waitlist_changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'waitlist',
              },
              (payload) => {
                console.log('Waitlist change detected:', payload)
                // Refetch count when changes occur
                fetch('/api/waitlist-count')
                  .then((res) => res.json())
                  .then((data) => {
                    setWaitlistCount(data.count || 0)
                  })
              }
            )
            .subscribe()
        }
      } catch (error) {
        console.error('Error setting up real-time subscription:', error)
        setIsLoading(false)
      }
    }

    setupRealtimeSubscription()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [])

  // Scroll progress indicator
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  const displayTaken = Math.min(waitlistCount, TOTAL_SPOTS)
  const displayWaiting = waitlistCount
  const spotsLeft = TOTAL_SPOTS - displayTaken

  return (
    <>
      <StarField />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-rh-acc via-rh-acc-soft to-rh-rest transition-all duration-150 ease-out"
          style={{ width: `${Math.min(scrollProgress, 100)}%` }}
        />
      </div>

      {/* Ambient glow behind hero */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-rh-acc opacity-[0.07] blur-[120px]" />
      </div>

      <main className="relative z-10 min-h-screen">

        {/* ── Navigation ── */}
        <nav className="max-w-[1100px] mx-auto px-6 pt-8 pb-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="rabbithole"
              width={120}
              height={120}
              className="object-contain"
            />
            <span className="font-display text-4xl font-bold tracking-tight text-white">rabbithole</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all duration-300 ${
                  locale === 'en'
                    ? 'text-white bg-white/8 border border-white/12 scale-105'
                    : 'text-white/30 hover:text-white/60 border border-transparent hover:scale-105'
                }`}
              >
                EN
              </button>
              <span className="text-white/10 text-xs">|</span>
              <button
                onClick={() => setLocale('th')}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded transition-all duration-300 font-thai ${
                  locale === 'th'
                    ? 'text-white bg-white/8 border border-white/12 scale-105'
                    : 'text-white/30 hover:text-white/60 border border-transparent hover:scale-105'
                }`}
              >
                TH
              </button>
            </div>

            {/* Live spots badge */}
            {!isLoading && spotsLeft > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/8 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rh-rest animate-pulse-slow" />
                <span className="font-mono text-xs text-white/40">{spotsLeft} {t.spotsLeft}</span>
              </div>
            )}
          </div>
        </nav>

        {/* Top border line */}
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        {/* ── Hero Section ── */}
        <section className="max-w-[1100px] mx-auto px-6 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-start">

            {/* Left — Copy */}
            <div className="space-y-8 opacity-0 animate-fade-up">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-px bg-rh-acc" />
                <span className="font-mono text-[11px] text-white/40 uppercase tracking-[0.15em]">
                  {t.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-display font-800 leading-[1.0] tracking-tight text-white"
                style={{ fontSize: 'clamp(52px, 8vw, 84px)', letterSpacing: '-3px' }}
              >
                {t.headline.split('\n').map((line, i) => (
                  <span key={i} className="block">
                    {i === 1 ? <span className="rh-gradient-text">{line}</span> : line}
                  </span>
                ))}
              </h1>

              {/* Campaign — italic subheadline */}
              <p className={`font-display text-xl italic text-white/40 ${locale === 'th' ? 'font-thai' : ''}`}>
                {t.campaign}
              </p>

              {/* Body description */}
              <p className={`text-base text-white/55 leading-relaxed max-w-[440px] ${locale === 'th' ? 'font-thai' : ''}`}>
                {t.heroDescription}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.values(t.tags).map((tag, i) => (
                  <span key={i} className="rh-tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Right — Waitlist Card */}
            <div className="opacity-0 animate-fade-up animation-delay-200">
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/8 rounded-2xl p-8 shadow-2xl rh-glow-hover">
                {/* Card Top */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.18em]">
                    {t.earlyAccessLabel}
                  </span>
                  <span className="px-2.5 py-1 bg-rh-rest/10 text-rh-rest text-[11px] font-mono rounded border border-rh-rest/20 animate-pulse-slow">
                    {t.foundingMember}
                  </span>
                </div>

                {/* Spot Counter */}
                {!isLoading && (
                  <SpotCounter
                    locale={locale}
                    spotsTaken={displayTaken}
                    spotsLeft={spotsLeft}
                    peopleWaiting={displayWaiting}
                  />
                )}

                {/* Pricing Toggle */}
                <div className="mt-5">
                  <PricingToggle
                    locale={locale}
                    billingPeriod={billingPeriod}
                    onBillingChange={setBillingPeriod}
                  />
                </div>

                {/* Price */}
                <PricingDisplay locale={locale} billingPeriod={billingPeriod} />

                {/* Divider */}
                <div className="h-px bg-white/6 my-5" />

                {/* Email Form */}
                <EmailForm
                  locale={locale}
                  billingPeriod={billingPeriod}
                  spotsLeft={spotsLeft}
                />

                {/* Early Access Benefits */}
                <div className="mt-5 space-y-2">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.15em] mb-3">
                    {t.earlyAccessBenefits.title}
                  </p>
                  {Object.values(t.earlyAccessBenefits).filter((v) => typeof v === 'string' && v !== t.earlyAccessBenefits.title).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm rh-card-hover p-2 rounded-lg">
                      <div className="w-1 h-1 rounded-full bg-rh-acc-soft" />
                      <span className={locale === 'th' ? 'font-thai' : ''}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section Divider: Session Preview ── */}
        <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-12 scroll-reveal">
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm font-medium text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">{t.section1Label}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        {/* ── Session Preview ── */}
        <section className="max-w-[1100px] mx-auto px-6 pb-20 scroll-reveal">
          <SessionPreview locale={locale} />
        </section>

        {/* ── Section Divider: Benefits ── */}
        <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-12 scroll-reveal">
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm font-medium text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">{t.section2Label}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        {/* ── Benefits Section ── */}
        <section className="max-w-[1100px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { Icon: Hourglass, en: t.benefit1, th: t.benefit1 },
              { Icon: Brain, en: t.benefit2, th: t.benefit2 },
              { Icon: BarChart3, en: t.benefit3, th: t.benefit3 },
              { Icon: Headphones, en: t.benefit4, th: t.benefit4 },
            ].map((b, i) => (
              <div key={i} className="rh-card-hover flex items-start gap-4 p-5 border border-white/6 rounded-xl bg-white/[0.02] group cursor-default scroll-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-rh-acc/10 border border-rh-acc/15 text-rh-acc-soft shrink-0 group-hover:bg-rh-acc/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <b.Icon size={20} strokeWidth={1.5} />
                </div>
                <p className={`text-white/70 text-sm leading-relaxed pt-1.5 ${locale === 'th' ? 'font-thai' : ''}`}>
                  {b.en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section Divider: Features ── */}
        <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-12 scroll-reveal">
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm font-medium text-white/50 uppercase tracking-[0.15em] whitespace-nowrap">{t.section3Label}</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        </div>

        {/* ── Features Grid ── */}
        <section className="max-w-[1100px] mx-auto px-6 pb-20 scroll-reveal">
          <FeaturesGrid locale={locale} />
        </section>

        {/* ── Footer ── */}
        <footer className="max-w-[1100px] mx-auto px-6 py-12 scroll-reveal">
          <div className="h-px bg-white/6 mb-10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="rabbithole" width={22} height={22} className="object-contain opacity-60" />
              <span className="font-mono text-xs text-white/30">rabbithole</span>
            </div>

            {/* Tagline */}
            <p className={`font-mono text-xs text-white/20 ${locale === 'th' ? 'font-thai' : ''}`}>
              {t.footer}
            </p>

            {/* Built by + © */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 bg-white shrink-0">
                  <Image src="/namwaaok.png" alt="Namwaaok" width={24} height={24} className="object-cover w-full h-full" />
                </div>
                <span className="font-mono text-xs text-white/30">Built by Namwaaok</span>
              </div>
              <span className="text-white/15 font-mono text-xs">·</span>
              <p className="font-mono text-xs text-white/20">© 2025</p>
            </div>
          </div>
        </footer>


      </main>
    </>
  )
}

