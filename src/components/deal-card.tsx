"use client"

import { Star, MessageSquare, Calendar, Target, AlertTriangle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/types/deal"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  onToggleFavorite: () => void
  onOpenChat?: (dealId: string) => void  // ✅ Acepta dealId como parámetro
}

export function DealCard({ deal, onToggleFavorite, onOpenChat }: DealCardProps) {
  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  }

  const hasNoActivity = !deal.nextActivity || !deal.activityDate

  return (
    <Card
      className={cn(
        "p-4 bg-card border-border cursor-pointer transition-all hover:shadow-lg hover:border-primary/50",
        "group relative",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-2 text-pretty">{deal.company}</h4>
            <p className="text-2xl font-bold text-primary">{formatValue(deal.imrValue)} IMR</p>
            <p className="text-sm text-muted-foreground">TCV: {formatValue(deal.tcvValue)}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Duración: {deal.contractDurationMonths} meses</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                deal.isFavorite ? "fill-chart-4 text-chart-4" : "text-muted-foreground",
              )}
            />
          </Button>
        </div>

        {!hasNoActivity && (
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {deal.nextActivity} - {formatDate(deal.activityDate)}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 text-sm">
          <Target className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-muted-foreground leading-relaxed">Cierre esperado: {formatDate(deal.expectedCloseDate)}</p>
        </div>

        {hasNoActivity && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 text-destructive border border-destructive/30">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium">Sin actividad programada</p>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onOpenChat?.(deal.id)  // ✅ Pasa el dealId
          }}
        >
          <MessageSquare className="h-4 w-4" />
          Abrir Chat
        </Button>
      </div>
    </Card>
  )
}
