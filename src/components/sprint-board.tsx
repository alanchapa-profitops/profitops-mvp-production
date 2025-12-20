"use client"

import { SprintColumn } from "@/components/sprint-column"
import type { Deal } from "@/types/deal"

interface SprintBoardProps {
  deals: Deal[]
  onOpenChat: (dealId: string) => void
}

export function SprintBoard({ deals, onOpenChat }: SprintBoardProps) {
  const reactivar = deals.filter((deal) => deal.isFavorite && deal.sprintCategory === "reactivar")
  const criticos = deals.filter((deal) => deal.isFavorite && deal.sprintCategory === "critico")
  const momentum = deals.filter((deal) => deal.isFavorite && deal.sprintCategory === "momentum")

  return (
    <div className="w-full">
      <div className="flex gap-6">
        <SprintColumn stage="Deals para Reactivar" color="red" deals={reactivar} maxDeals={3} onOpenChat={onOpenChat} />
        <SprintColumn stage="Deals Críticos" color="yellow" deals={criticos} maxDeals={3} onOpenChat={onOpenChat} />
        <SprintColumn stage="Deals con Momentum" color="green" deals={momentum} maxDeals={3} onOpenChat={onOpenChat} />
      </div>
    </div>
  )
}
