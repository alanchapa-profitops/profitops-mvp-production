"use client"

import { Calendar, Clock, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/types/deal"

interface WeeklyPlannerProps {
  deals: Deal[]
}

export function WeeklyPlanner({ deals }: WeeklyPlannerProps) {
  const favoriteDeals = deals.filter((d) => d.isFavorite).slice(0, 3)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Plan de Trabajo</h2>
            <p className="text-sm text-muted-foreground">Semana 16-22 Dec</p>
          </div>
        </div>
        <Button size="sm" variant="outline">
          Ver Timeline Completo
        </Button>
      </div>

      <div className="space-y-3">
        {favoriteDeals.map((deal) => {
          const isAlert = deal.daysInStage > 21
          const calculatedTCV = deal.imrValue * deal.contractDurationMonths

          return (
            <div
              key={deal.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{deal.company}</span>
                  <Badge variant="outline" className="text-xs">
                    {deal.stage}
                  </Badge>
                  {isAlert && (
                    <Badge variant="destructive" className="text-xs gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {deal.daysInStage} días
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-green-600 dark:text-green-500">
                    ${(deal.imrValue / 1000).toFixed(0)}K IMR
                  </span>
                  <span>${(calculatedTCV / 1000).toFixed(0)}K TCV</span>
                  {deal.nextActivity && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {deal.nextActivity}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Quick Actions
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
