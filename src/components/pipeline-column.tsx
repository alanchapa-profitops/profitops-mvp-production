"use client"

import { Card } from "@/components/ui/card"
import { DealCard } from "@/components/deal-card"
import type { Deal } from "@/types/deal"

interface PipelineColumnProps {
  stage: string
  deals: Deal[]
  onToggleFavorite: (dealId: string) => void
  onOpenChat: (dealId: string) => void
}

export function PipelineColumn({ stage, deals, onToggleFavorite, onOpenChat }: PipelineColumnProps) {
  // Manejar tanto datos del frontend como datos reales de Pipedrive
  const getTotalValue = (deals: Deal[]) => {
    return deals.reduce((sum, deal) => {
      // Intentar múltiples campos para el valor
      const value = deal.imrValue || deal.value || deal.weighted_value || 0
      return sum + (typeof value === 'number' ? value : 0)
    }, 0)
  }

  const totalValue = getTotalValue(deals)
  const count = deals?.length || 0

  return (
    <div className="flex flex-col gap-3 min-w-[320px]">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
          <span className="text-xs text-muted-foreground">{count}</span>
        </div>
        <p className="text-lg font-bold text-foreground">
          ${totalValue > 1000 ? `${(totalValue / 1000).toFixed(0)}K` : totalValue.toFixed(0)}
        </p>
      </Card>

      <div className="space-y-3">
        {deals && deals.length > 0 ? (
          deals.map((deal, index) => (
            <DealCard
              key={deal.id || `deal-${index}`}
              deal={deal}
              onToggleFavorite={() => onToggleFavorite(deal.id || `deal-${index}`)}
              onOpenChat={() => onOpenChat(deal.id || `deal-${index}`)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay deals en esta etapa
          </div>
        )}
      </div>
    </div>
  )
}