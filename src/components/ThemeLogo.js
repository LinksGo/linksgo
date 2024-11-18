'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ThemeLogo({ className = '', width = 40, height = 40 }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const logoSrc = currentTheme === 'dark' ? '/2.png' : '/1.png'

  return (
    <Image
      src={logoSrc}
      alt="LinksGo Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
