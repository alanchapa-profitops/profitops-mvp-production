"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    label: "Deals Ganados",
    value: "8",
    change: "+25%",
    isPositive: true,
  },
  {
    label: "Deals Perdidos",
    value: "3",
    change: "-40%",
    isPositive: true,
  },
  {
    label: "Deals Agregados",
    value: "15",
    change: "+12%",
    isPositive: true,
  },
  {
    label: "Win Rate",
    value: "73%",
    change: "+8%",
    isPositive: true,
  },
  {
    label: "Pipeline Generado",
    value: "$890K",
    change: "+15%",
    isPositive: true,
  },
]

export function DealsPerformance() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Deals Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-1">
                {metric.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={cn("text-sm font-medium", metric.isPositive ? "text-green-500" : "text-red-500")}>
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">vs período anterior</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
