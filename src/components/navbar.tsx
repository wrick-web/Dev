'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Top navigation bar with theme toggle.
 * Displayed above main content area in the layout.
 */
export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="border-b bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold text-lg">
          BuildDevLog
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </nav>
  )
}
