"use client"

import { TrendingUp, Calendar, CalendarRange } from "lucide-react"
import { Card } from "@/components/ui/card"

export function MetricsBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pipeline Mes Actual</p>
            <p className="text-2xl font-bold text-foreground">$438K</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cierre esperado este mes</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-2/10">
            <TrendingUp className="h-5 w-5 text-chart-2" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pipeline 3 Meses</p>
            <p className="text-2xl font-bold text-foreground">$890K</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cierre próximos 3 meses</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-3/10">
            <CalendarRange className="h-5 w-5 text-chart-3" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pipeline 6 Meses</p>
            <p className="text-2xl font-bold text-foreground">$1.2M</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cierre próximos 6 meses</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
