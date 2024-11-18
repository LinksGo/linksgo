'use client'

import { NextUIProvider } from "@nextui-org/react"

export default function DashboardLayout({ children }) {
  return (
    <NextUIProvider>
      <div className="dashboard">
        {children}
      </div>
    </NextUIProvider>
  )
}
