import { Button } from "@nextui-org/react"
import { FaMoon, FaSun } from "react-icons/fa"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      isIconOnly
      variant="flat"
      size="md"
      aria-label="Toggle theme"
      className="fixed bottom-4 right-4 z-50 dark:bg-content"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <FaMoon className="text-lg text-blue-500" />
      ) : (
        <FaSun className="text-lg text-amber-500" />
      )}
    </Button>
  )
}
