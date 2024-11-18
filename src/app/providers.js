'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import ThemeToggle from "@/components/ThemeToggle"
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <NextUIProvider>
          <ThemeToggle />
          {children}
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
