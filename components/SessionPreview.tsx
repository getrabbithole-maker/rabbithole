'use client'

import { useState, useEffect } from 'react'
import { Calendar, Target, Flame, Clock, Zap } from 'lucide-react'
import { Locale, translations } from '@/lib/translations'

interface SessionPreviewProps {
  locale: Locale
}

type ViewMode = 'focus' | 'dashboard'

export default function SessionPreview({ locale }: SessionPreviewProps) {
  const t = translations[locale]
  const [viewMode, setViewMode] = useState<ViewMode>('focus')
  const [timeLeft, setTimeLeft] = useState(47 * 60 + 23)
  const [sessionNumber] = useState(8)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 47 * 60 + 23 : prev - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalSessionTime = 47 * 60 + 23
  const elapsedTime = totalSessionTime - timeLeft
  const progressPercent = (elapsedTime / totalSessionTime) * 100
  const filledSegments = Math.round((progressPercent / 100) * 12)

  return (
    <div className="space-y-6">
      {/* View Toggle Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-white/[0.03] rounded-lg border border-white/8 w-fit mx-auto">
        <button
          onClick={() => setViewMode('dashboard')}
          className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'dashboard'
              ? 'bg-white/10 text-white shadow-sm scale-[1.02]'
              : 'text-white/40 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          <Calendar size={16} strokeWidth={1.5} />
          {locale === 'th' ? 'แดชบอร์ด' : 'Dashboard'}
        </button>
        <button
          onClick={() => setViewMode('focus')}
          className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'focus'
              ? 'bg-white/10 text-white shadow-sm scale-[1.02]'
              : 'text-white/40 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          <Target size={16} strokeWidth={1.5} />
          {locale === 'th' ? 'โฟกัส' : 'Focus'}
        </button>
      </div>

      {/* View Description */}
      <p className="text-center text-sm text-white/40 max-w-md mx-auto">
        {viewMode === 'dashboard'
          ? locale === 'th'
            ? 'ติดตามสถิติการทำงานเชิงลึก เห็นความก้าวหน้า และสร้างนิสัยที่ยั่งยืน'
            : 'Track your deep work stats, see your progress, and build lasting habits.'
          : locale === 'th'
            ? 'เข้าสู่โหมดโฟกัสเชิงลึก ตัดขาดจากสิ่งรบกวน และทำงานของคุณให้ดีที่สุด'
            : 'Enter deep focus mode, eliminate distractions, and do your best work.'}
      </p>

      {/* Content */}
      {viewMode === 'dashboard' ? (
        // Dashboard View
        <div className="border border-white/8 rounded-xl overflow-hidden">
          {/* Terminal top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/[0.015]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[11px] text-white/25 tracking-wider">
              rabbithole — dashboard
            </span>
            <div className="w-16" />
          </div>

          {/* Dashboard Content */}
          <div className="p-8 md:p-10 space-y-8" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(78,201,148,0.06) 0%, transparent 70%)' }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/[0.02] border border-white/6">
                <Flame className="w-5 h-5 mx-auto mb-2 text-orange-400/70" />
                <div className="font-display font-bold text-2xl text-white/90">8</div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">
                  {locale === 'th' ? 'วันติดต่อกัน' : 'Day Streak'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.02] border border-white/6">
                <Clock className="w-5 h-5 mx-auto mb-2 text-rh-acc-soft" />
                <div className="font-display font-bold text-2xl text-white/90">24.5</div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">
                  {locale === 'th' ? 'ชั่วโมงในสัปดาห์' : 'Hours This Week'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.02] border border-white/6">
                <Target className="w-5 h-5 mx-auto mb-2 text-rh-rest" />
                <div className="font-display font-bold text-2xl text-white/90">47</div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">
                  {locale === 'th' ? 'เซสชันทั้งหมด' : 'Total Sessions'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/[0.02] border border-white/6">
                <Zap className="w-5 h-5 mx-auto mb-2 text-yellow-400/70" />
                <div className="font-display font-bold text-2xl text-white/90">92%</div>
                <div className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">
                  {locale === 'th' ? 'อัตราสำเร็จ' : 'Success Rate'}
                </div>
              </div>
            </div>

            {/* Stacked Bar Chart - Deep Work Sessions Per Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs text-white/40 uppercase tracking-wider">
                  {locale === 'th' ? 'เซสชันต่อวัน' : 'Sessions Per Day'}
                </h3>
                <div className="font-mono text-[10px] text-white/30">
                  {locale === 'th' ? 'แต่ละบล็อก = 1 เซสชัน' : 'Each block = 1 session'}
                </div>
              </div>

              {/* Stacked Session Bars */}
              <div className="space-y-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  // Session counts per day (each session = ~25% width)
                  const sessions = [3, 4, 3, 5, 4, 2, 2]
                  const isToday = i === 4
                  const sessionCount = sessions[i]
                  // Alternate colors: dark purple, light sepia purple
                  const colors = ['bg-rh-acc', 'bg-[#9B7DB8]']

                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className={`font-mono text-[10px] w-4 ${isToday ? 'text-white/60' : 'text-white/25'}`}>{day}</span>
                      <div className="flex-1 h-5 rounded-md overflow-hidden flex gap-0.5 bg-white/[0.03]">
                        {Array.from({ length: sessionCount }).map((_, sessionIndex) => (
                          <div
                            key={sessionIndex}
                            className={`flex-1 ${colors[sessionIndex % 2]} transition-all duration-300 hover:opacity-80 first:rounded-l-md last:rounded-r-md`}
                            style={{
                              opacity: isToday ? 1 : 0.5 + (sessionIndex * 0.08),
                            }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-white/30 w-10 text-right">
                        {sessionCount}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Focus View (Original)
        <div className="border border-white/8 rounded-xl overflow-hidden">
          {/* Terminal top bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/[0.015]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[11px] text-white/25 tracking-wider">
              rabbithole — deep work session
            </span>
            <div className="w-16" />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-10" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(123,79,190,0.08) 0%, transparent 70%)' }}>
            {/* Session meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rh-acc animate-pulse-slow" />
                <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                  {t.focusLabel}
                </span>
                <span className="text-white/15">·</span>
                <span className="font-mono text-xs text-white/35">
                  {t.sessionLabel} {String(sessionNumber).padStart(2, '0')}
                </span>
              </div>
              <span className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
                {locale === 'th' ? 'เซสชัน' : 'Session'} 8 of 12
              </span>
            </div>

            {/* Giant timer */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 blur-[60px] bg-rh-acc/20 rounded-full" />
                <div
                  className="relative font-display font-bold leading-none text-white/90"
                  style={{ fontSize: 'clamp(80px, 14vw, 136px)', letterSpacing: '-4px' }}
                >
                  {minutes}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
              <div className="font-mono text-xs text-white/25 uppercase tracking-[0.3em] mt-5">
                {t.remainingLabel}
              </div>
            </div>

            {/* Task */}
            <div className="text-center">
              <p className="text-white/40 text-base leading-relaxed">
                &ldquo;{t.defaultTask}&rdquo;
              </p>
            </div>

            {/* Waveform decoration */}
            <div className="flex items-center justify-center gap-[3px] h-8 opacity-30">
              {Array.from({ length: 40 }).map((_, i) => {
                const h = 4 + Math.abs(Math.sin(i * 0.7) * 20) + Math.abs(Math.sin(i * 0.3) * 10)
                return (
                  <div
                    key={i}
                    className="w-[2px] rounded-full bg-rh-acc-soft"
                    style={{ height: `${h}px` }}
                  />
                )
              })}
            </div>

            {/* Progress track */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] text-white/25 uppercase tracking-wider">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-0.5 rounded-full transition-all duration-1000"
                    style={{
                      background: i < filledSegments
                        ? 'linear-gradient(to right, #7B4FBE, #B47FE8)'
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between font-mono text-[10px] text-white/20">
                <span>{locale === 'th' ? '0 สิ่งรบกวน' : '0 distractions'}</span>
                <span>{locale === 'th' ? 'โฟกัสลึก' : 'Deep focus'}</span>
              </div>
            </div>

            {/* Music indicator */}
            <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-rh-acc-soft animate-pulse-slow" />
              <span className="font-mono text-xs text-white/30">
                {t.musicLabel} · 14:22
              </span>
              <span className="text-white/10">|</span>
              <span className="font-mono text-xs text-white/30">Deep Space</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
