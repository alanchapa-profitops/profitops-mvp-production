"use client"

import { useState } from "react"
import { MessageSquare, Brain, BarChart3, Zap, TrendingUp, ChevronRight, ChevronDown, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"
import { NewDealModal } from "./new-deal-modal"

interface ChatSidebarProps {
  deals: Deal[]
  selectedDealId: string | null
  onSelectDeal: (dealId: string) => void
  onSelectWeekly: (type: string) => void
  onCreateDeal: (dealData: {
    company: string
    contactName: string
    contactEmail: string
    imrValue: number
    tcvValue: number
    contractDurationMonths: number
    expectedCloseDate: string
    stage: string
    chatCategory: string
  }) => void
}

const weeklyCoaches = [
  {
    icon: Brain,
    label: "Coach Insights",
    type: "insights",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    label: "Coach Metodológico",
    type: "metodologico",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    label: "Coach Estratégico",
    type: "estrategico",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    label: "Coach Performance",
    type: "performance",
    gradient: "from-green-500 to-emerald-500",
  },
]

const categoryLabels: Record<string, string> = {
  manufactura: "MANUFACTURA INDUSTRIAL",
  tecnologia: "TECNOLOGÍA",
  servicios: "SERVICIOS ESPECIALIZADOS",
  deals: "DEALS",
}

export function ChatSidebar({ deals, selectedDealId, onSelectDeal, onSelectWeekly, onCreateDeal }: ChatSidebarProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [showNewDealModal, setShowNewDealModal] = useState(false)

  const favoriteDeals = deals.filter((d) => d.isFavorite)
  const dealsByCategory = favoriteDeals.reduce(
    (acc, deal) => {
      const category = deal.chatCategory || "deals"
      if (!acc[category]) acc[category] = []
      acc[category].push(deal)
      return acc
    },
    {} as Record<string, Deal[]>,
  )

  const toggleGroup = (group: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  return (
    <>
      <Card className="p-4 overflow-y-auto flex flex-col h-full">
        <div className="space-y-4 flex-1">
          {/* Weekly Coaches Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Weekly Coaches</h3>
            <div className="space-y-1">
              {weeklyCoaches.map((coach) => (
                <Button
                  key={coach.type}
                  variant="ghost"
                  className="w-full justify-start text-sm h-auto py-2.5 px-2 text-foreground hover:bg-accent"
                  onClick={() => onSelectWeekly(coach.type)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={cn("bg-gradient-to-br text-white", coach.gradient)}>
                        <coach.icon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate flex-1 text-left font-medium">{coach.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Deal Chats by Category */}
          {Object.entries(dealsByCategory).map(([category, categoryDeals]) => {
            const isCollapsed = collapsedGroups.has(category)
            const displayLabel = categoryLabels[category] || category.toUpperCase()

            return (
              <div key={category}>
                <button
                  onClick={() => toggleGroup(category)}
                  className="w-full flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 hover:text-foreground transition-colors"
                >
                  {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{displayLabel}</span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-1 ml-1">
                    {categoryDeals.map((deal) => (
                      <Button
                        key={deal.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm h-auto py-2.5 px-2 relative",
                          selectedDealId === deal.id
                            ? "bg-primary/10 text-primary hover:bg-primary/20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary"
                            : "text-foreground hover:bg-accent",
                        )}
                        onClick={() => onSelectDeal(deal.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <MessageSquare className="h-4 w-4 shrink-0" />
                          <span className="truncate flex-1 text-left">{deal.company}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* New Deal Button - Fixed at bottom */}
        <div className="pt-4 border-t border-border mt-4">
          <Button className="w-full gap-2 bg-primary hover:bg-primary/90" onClick={() => setShowNewDealModal(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Deal
          </Button>
        </div>
      </Card>

      <NewDealModal open={showNewDealModal} onOpenChange={setShowNewDealModal} onCreateDeal={onCreateDeal} />
    </>
  )
}
