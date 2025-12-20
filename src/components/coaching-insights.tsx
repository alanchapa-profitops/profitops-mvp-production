"use client"

import { useState } from "react"
import { TrendingUp, AlertTriangle, Lightbulb, Target, Trophy, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"

interface Insight {
  id: string
  type: "analysis" | "alert" | "tip" | "improvement" | "pattern"
  icon: typeof TrendingUp
  title: string
  description?: string
  expanded: boolean
}

interface CoachingInsightsProps {
  deals: Deal[]
}

export function CoachingInsights({ deals }: CoachingInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      type: "analysis",
      icon: TrendingUp,
      title: "Análisis semana pasada: Aplicaste SPIN en 7/10 calls, mejora en preguntas Implication",
      description:
        "Tus preguntas de situación e implicación mejoraron 30% comparado con la semana anterior. Enfócate en profundizar más en las preguntas de necesidad.",
      expanded: false,
    },
    {
      id: "2",
      type: "alert",
      icon: AlertTriangle,
      title: "Pattern alert: 60% de tus deals stalled están en Discovery >21 días - review qualification",
      description:
        "Identifica si estos deals realmente cumplen con MEDDIC. Considera hacer una revisión de qualification con tu manager.",
      expanded: false,
    },
    {
      id: "3",
      type: "tip",
      icon: Lightbulb,
      title: "Insight de transcripciones: Mencionas ROI en 40% de calls, incrementar a 80% mejora close rate",
      description:
        "Los deals donde mencionaste ROI específico en las primeras 2 calls tienen un 45% más de probabilidad de cerrar.",
      expanded: false,
    },
    {
      id: "4",
      type: "improvement",
      icon: Target,
      title: "Área de mejora: Objection handling en precio - 3 deals lost por pricing pushback",
      description:
        "Considera usar el framework de valor antes de mencionar precio. Revisar templates de ROI en Learning Center.",
      expanded: false,
    },
    {
      id: "5",
      type: "pattern",
      icon: Trophy,
      title: "Win pattern: Demos técnicas + CFO involvement = 85% win rate en manufactura",
      description: "Replica este patrón en tus otros deals de manufactura. Involucra a CFO temprano en el ciclo.",
      expanded: false,
    },
  ])

  const toggleInsight = (id: string) => {
    setInsights((prev) => prev.map((ins) => (ins.id === id ? { ...ins, expanded: !ins.expanded } : ins)))
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Coaching Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">Smart insights basados en data y transcripciones</p>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
          >
            <button
              onClick={() => toggleInsight(insight.id)}
              className="w-full flex items-start gap-3 p-4 text-left hover:bg-accent/50 transition-colors"
            >
              <div
                className={cn(
                  "p-2 rounded-md shrink-0",
                  insight.type === "analysis" && "bg-blue-500/10 text-blue-500",
                  insight.type === "alert" && "bg-amber-500/10 text-amber-500",
                  insight.type === "tip" && "bg-purple-500/10 text-purple-500",
                  insight.type === "improvement" && "bg-orange-500/10 text-orange-500",
                  insight.type === "pattern" && "bg-green-500/10 text-green-500",
                )}
              >
                <insight.icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{insight.title}</p>
                {insight.expanded && insight.description && (
                  <p className="text-sm text-muted-foreground mt-2">{insight.description}</p>
                )}
              </div>

              {insight.expanded ? (
                <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}
