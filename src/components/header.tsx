"use client"

import { BarChart3, Target, Bot, Brain, FileText, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
      description: "Deals prioritarios"
    },
    {
      id: "radar" as const,
      label: "Radar", 
      icon: BarChart3,
      description: "Pipeline por etapas"
    },
    {
      id: "coach" as const,
      label: "Coach",
      icon: Bot,
      description: "Coaching AI"
    },
    {
      id: "intelligence" as const,
      label: "Intelligence",
      icon: Brain,
      description: "Analytics & Insights"
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: FileText,
      description: "Reportes"
    }
  ]

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ProfitOps</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center gap-2",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="h-9 w-9"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}