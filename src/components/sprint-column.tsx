"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DealCard } from "@/components/deal-card"
import type { Deal } from "@/types/deal"
import { cn } from "@/lib/utils"

interface SprintColumnProps {
  stage: string
  color: "red" | "yellow" | "green"
  deals: Deal[]
  maxDeals?: number
  onOpenChat: (dealId: string) => void
}

export function SprintColumn({ stage, color, deals, maxDeals = 3, onOpenChat }: SprintColumnProps) {
  const colorConfig = {
    red: {
      border: "border-l-4 border-red-500",
      text: "text-red-600 dark:text-red-400",
      badge: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
    },
    yellow: {
      border: "border-l-4 border-orange-500",
      text: "text-orange-600 dark:text-orange-400",
      badge: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
    },
    green: {
      border: "border-l-4 border-green-500",
      text: "text-green-600 dark:text-green-400",
      badge: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
    },
  }

  const config = colorConfig[color]

  return (
    <div className="flex-1 min-w-0">
      <Card className={cn("p-4 h-full bg-card", config.border)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("font-semibold", config.text)}>
            {stage}{" "}
            <span className="text-muted-foreground">
              ({deals.length}/{maxDeals})
            </span>
          </h3>
          <Badge variant="outline" className={config.badge}>
            {deals.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onToggleFavorite={() => {}} onOpenChat={() => onOpenChat(deal.id)} />
          ))}
          {deals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No hay deals en esta categoría</p>
          )}
        </div>
      </Card>
    </div>
  )
}
