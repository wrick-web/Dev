'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  FolderOpen,
  BookmarkSquare,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/entries', label: 'Entries', icon: BookOpen },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/resources', label: 'Resources', icon: BookmarkSquare },
]

/**
 * Left sidebar navigation menu.
 * Uses usePathname to highlight the current active route.
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-muted-foreground">Menu</h2>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
