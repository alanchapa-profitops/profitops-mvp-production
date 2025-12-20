"use client"

import { TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/types/deal"

interface PerformanceCoachingProps {
  deals: Deal[]
}

const insightCards = [
  {
    icon: TrendingUp,
    color: "text-green-500",
    title: "Tu win rate subió 15% aplicando Challenger",
    description: "Expandamos esta metodología a deals tech - tienes 2 prospectos ideales en Discovery",
    action: "Ver deals recomendados",
  },
  {
    icon: AlertTriangle,
    color: "text-amber-500",
    title: "3 deals >21 días sin actividad",
    description: "Entheospace, MTE Global y Datatechnic necesitan reactivación - aquí tienes scripts personalizados",
    action: "Ver scripts de reactivación",
  },
  {
    icon: Target,
    color: "text-blue-500",
    title: "Patrón detectado: deals manufactura cierran 20% más rápido",
    description: "Cuando incluyes demos técnicas en Discovery. Aplica esto a CBS Compresores esta semana",
    action: "Aplicar estrategia",
  },
]

export function PerformanceCoaching({ deals }: PerformanceCoachingProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Coaching Personalizado</h2>
          <p className="text-sm text-muted-foreground">Insights basados en tu performance</p>
        </div>
      </div>

      <div className="grid gap-4">
        {insightCards.map((insight, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div
              className={`h-10 w-10 rounded-lg bg-background flex items-center justify-center shrink-0 ${insight.color}`}
            >
              <insight.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{insight.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
              <Button size="sm" variant="outline">
                {insight.action}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
