"use client"

import { BarChart3, Target, Bot, Brain, FileText, Moon, Sun, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  activeView: "sprint" | "radar" | "coach" | "intelligence" | "reports"
  onViewChange: (view: "sprint" | "radar" | "coach" | "intelligence" | "reports") => void
  isDarkMode: boolean
  onThemeToggle: () => void
}

export function Header({ activeView, onViewChange, isDarkMode, onThemeToggle }: HeaderProps) {
  const navigationItems = [
    {
      id: "sprint" as const,
      label: "Sprint",
      icon: Target,
    },
    {
      id: "radar" as const,
      label: "Radar",
      icon: BarChart3,
    },
    {
      id: "coach" as const,
      label: "Coach",
      icon: Bot,
    },
    {
      id: "intelligence" as const,
      label: "Intelligence",
      icon: Brain,
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: FileText,
    }
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border-color)]">
      <div className="container mx-auto px-6">
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[var(--shadow-glow)] group-hover:scale-105"
              style={{ background: 'var(--accent-gradient)' }}
            >
              <BarChart3 className="h-5 w-5 text-[var(--bg-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">ProfitOps</span>
              <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">Sales Intelligence</span>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center">
            <div className="flex items-center gap-1 p-1.5 rounded-full bg-[var(--bg-secondary)]/60 backdrop-blur-sm border border-[var(--border-color)]/50">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isActive
                        ? "nav-pill-active"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              className="relative h-10 w-10 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="notification-dot" />
            </button>

            {/* Separator */}
            <div className="h-8 w-px bg-[var(--border-color)]/50 mx-1" />

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="h-10 w-10 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              aria-label="Toggle theme"
            >
              <div className="relative">
                <Sun className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isDarkMode ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
                )} />
                <Moon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isDarkMode ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100"
                )} />
              </div>
            </button>

            {/* User Avatar */}
            <div className="avatar-ring ml-1">
              <div className="h-9 w-9 rounded-full bg-[var(--bg-card)] flex items-center justify-center">
                <User className="h-4 w-4 text-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bottom border */}
      <div
        className="h-px w-full opacity-50"
        style={{ background: 'var(--accent-gradient)' }}
      />
    </header>
  )
}
