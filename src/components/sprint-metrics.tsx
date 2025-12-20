"use client"

import { Target, TrendingUp, DollarSign, Briefcase, Award, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

export function SprintMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Objetivo IMR Mes</p>
            <p className="text-2xl font-bold text-foreground">$105K MXN</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-2/10">
            <TrendingUp className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">IMR Ganado este Mes</p>
            <p className="text-2xl font-bold text-foreground">
              $16K MXN <span className="text-sm text-chart-2">(15%)</span>
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-3/10">
            <DollarSign className="h-5 w-5 text-chart-3" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pipeline Abierto con Potencial Cierre Mes</p>
            <p className="text-2xl font-bold text-foreground">$438K MXN</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-4/10">
            <Briefcase className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Oportunidades Abiertas con Potencial Cierre Mes</p>
            <p className="text-2xl font-bold text-foreground">27</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Award className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Deals Ganados Este Mes</p>
            <p className="text-2xl font-bold text-foreground">3</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Clock className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Velocity</p>
            <p className="text-2xl font-bold text-foreground">54 días</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
