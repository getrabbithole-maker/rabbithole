'use client'

import { useEffect, useState, useRef } from 'react'

export default function StarField() {
  const [stars, setStars] = useState<Array<{ id: number; style: React.CSSProperties; speed: number }>>([])
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Reduce star count significantly on mobile for performance
    const starCount = isMobile ? 15 : 60
    const generatedStars = Array.from({ length: starCount }, (_, i) => {
      const x = Math.random() * 100
      const y = Math.random() * 100
      const size = Math.random() * 2 + 1
      const delay = Math.random() * 3
      const duration = Math.random() * 2 + 2
      const speed = Math.random() * 0.3 + 0.1 // Parallax speed factor

      return {
        id: i,
        speed,
        style: {
          left: `${x}%`,
          top: `${y}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        },
      }
    })

    setStars(generatedStars)
  }, [isMobile])

  useEffect(() => {
    // Disable parallax on mobile for better performance
    if (isMobile) return

    let ticking = false

    const updateScroll = () => {
      setScrollY(window.scrollY)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white/8 animate-twinkle"
          style={{
            ...star.style,
            // Only apply parallax on desktop - use translate3d for hardware acceleration
            transform: isMobile ? 'none' : `translate3d(0, ${scrollY * star.speed}px, 0)`,
            willChange: isMobile ? 'auto' : 'transform',
          }}
        />
      ))}
    </div>
  )
}
