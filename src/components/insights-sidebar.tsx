"use client"

import {
  Calendar,
  Zap,
  AlertTriangle,
  TrendingUp,
  Brain,
  Target,
  Lightbulb,
  BarChart3,
  BookOpen,
  FileText,
  Award,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"

interface InsightsSidebarProps {
  deals: Deal[]
  selectedCoach: "insights" | "metodologico" | "estrategico" | "performance"
  onSelectCoach: (coach: "insights" | "metodologico" | "estrategico" | "performance") => void
}

const weeklyCoaches = [
  { id: "insights" as const, icon: Brain, label: "Coach Insights", gradient: "from-blue-500 to-cyan-500" },
  { id: "metodologico" as const, icon: Target, label: "Coach Metodológico", gradient: "from-purple-500 to-pink-500" },
  { id: "estrategico" as const, icon: Lightbulb, label: "Coach Estratégico", gradient: "from-orange-500 to-red-500" },
  {
    id: "performance" as const,
    icon: BarChart3,
    label: "Coach Performance",
    gradient: "from-green-500 to-emerald-500",
  },
]

const contentLibrary = [
  { icon: Target, label: "Metodologías", count: 12 },
  { icon: FileText, label: "Scripts & Templates", count: 24 },
  { icon: BookOpen, label: "Best Practices", count: 18 },
  { icon: Award, label: "Success Stories", count: 8 },
]

export function InsightsSidebar({ deals, selectedCoach, onSelectCoach }: InsightsSidebarProps) {
  const favoriteDeals = deals.filter((d) => d.isFavorite)
  const alertDeals = favoriteDeals.filter((d) => d.daysInStage > 21)

  return (
    <Card className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Quick Planning */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            QUICK PLANNING
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 h-9 bg-background" size="sm">
              <Calendar className="h-4 w-4" />
              Esta Semana
              <Badge variant="secondary" className="ml-auto">
                {favoriteDeals.length}
              </Badge>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-9 bg-background" size="sm">
              <Zap className="h-4 w-4 text-amber-500" />
              Prioridades
              <Badge variant="secondary" className="ml-auto">
                3
              </Badge>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-9 bg-background" size="sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Alertas
              <Badge variant="destructive" className="ml-auto">
                {alertDeals.length}
              </Badge>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 h-9 bg-background" size="sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Métricas Clave
            </Button>
          </div>
        </div>

        {/* Weekly Coaches */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            WEEKLY COACHES
          </h3>
          <div className="space-y-2">
            {weeklyCoaches.map((coach) => (
              <Button
                key={coach.id}
                variant={selectedCoach === coach.id ? "default" : "outline"}
                className={cn("w-full justify-start gap-3 h-10", selectedCoach !== coach.id && "bg-background")}
                onClick={() => onSelectCoach(coach.id)}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-br",
                    coach.gradient,
                  )}
                >
                  <coach.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm truncate">{coach.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Library */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            CONTENT LIBRARY
          </h3>
          <div className="space-y-2">
            {contentLibrary.map((item) => (
              <Button
                key={item.label}
                variant="outline"
                className="w-full justify-start gap-2 h-9 bg-background"
                size="sm"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
