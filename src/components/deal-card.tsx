"use client"

import { Star, MessageSquare, Calendar, Target, AlertTriangle, Clock, Zap, RefreshCw, TrendingUp, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Deal } from "@/types/deal"
import { cn } from "@/lib/utils"

interface DealCardProps {
  deal: Deal
  onToggleFavorite: () => void
  onOpenChat?: (dealId: string) => void
}

const categoryConfig = {
  critico: {
    label: "Crítico",
    icon: Zap,
    className: "category-critico",
    borderColor: "border-l-[var(--alert-yellow)]",
    badgeBg: "bg-[var(--alert-yellow)]/10",
    badgeText: "text-[var(--alert-yellow)]",
  },
  reactivar: {
    label: "Reactivar",
    icon: RefreshCw,
    className: "category-reactivar",
    borderColor: "border-l-[var(--alert-red)]",
    badgeBg: "bg-[var(--alert-red)]/10",
    badgeText: "text-[var(--alert-red)]",
  },
  momentum: {
    label: "Momentum",
    icon: TrendingUp,
    className: "category-momentum",
    borderColor: "border-l-[var(--alert-green)]",
    badgeBg: "bg-[var(--alert-green)]/10",
    badgeText: "text-[var(--alert-green)]",
  },
}

export function DealCard({ deal, onToggleFavorite, onOpenChat }: DealCardProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
  }

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Mañana"
    if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
    return formatDate(dateString)
  }

  const hasNoActivity = !deal.nextActivity || !deal.activityDate
  const category = deal.sprintCategory ? categoryConfig[deal.sprintCategory] : null
  const CategoryIcon = category?.icon

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] card-lift gradient-border",
        "p-0",
        category && `border-l-4 ${category.borderColor}`,
        category?.className
      )}
    >
      <div className="p-5 space-y-4">
        {/* Header: Category Badge + Star */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Category Badge */}
            {category && CategoryIcon && (
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                category.badgeBg,
                category.badgeText
              )}>
                <CategoryIcon className="h-3 w-3" />
                {category.label}
              </div>
            )}

            {/* Company Name */}
            <h4 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
              {deal.company}
            </h4>

            {/* Contact Info */}
            {(deal.contactName || deal.contactEmail) && (
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                {deal.contactName && <span>{deal.contactName}</span>}
                {deal.contactName && deal.contactEmail && <span>•</span>}
                {deal.contactEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {deal.contactEmail}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Favorite Star */}
          <button
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
              deal.isFavorite
                ? "bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite()
            }}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-all duration-300",
                deal.isFavorite && "fill-current scale-110"
              )}
            />
          </button>
        </div>

        {/* Value Display - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* IMR Card */}
          <div className="bg-[var(--bg-secondary)]/50 rounded-xl p-3 border border-[var(--border-color)]/30">
            <p className="text-2xl font-bold gradient-text">{formatValue(deal.imrValue)}</p>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-0.5">IMR</p>
          </div>

          {/* TCV Card */}
          <div className="bg-[var(--bg-secondary)]/50 rounded-xl p-3 border border-[var(--border-color)]/30">
            <p className="text-2xl font-bold text-[var(--text-primary)]">{formatValue(deal.tcvValue)}</p>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-0.5">TCV</p>
          </div>
        </div>

        {/* Contract Duration */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock className="h-4 w-4 text-[var(--text-muted)]" />
          <span>{deal.contractDurationMonths} meses de contrato</span>
        </div>

        {/* Timeline Section */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]/30">
          {/* Next Activity */}
          {!hasNoActivity && (
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-[var(--accent-cyan)]/10 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-[var(--accent-cyan)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)] truncate">{deal.nextActivity}</p>
                <p className="text-xs text-[var(--text-muted)]">{getRelativeTime(deal.activityDate)}</p>
              </div>
            </div>
          )}

          {/* Expected Close */}
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--accent-blue)]/10 flex items-center justify-center shrink-0">
              <Target className="h-4 w-4 text-[var(--accent-blue)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-primary)]">Cierre esperado</p>
              <p className="text-xs text-[var(--text-muted)]">{formatDate(deal.expectedCloseDate)}</p>
            </div>
          </div>
        </div>

        {/* Warning State - Softer */}
        {hasNoActivity && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--alert-yellow)]/5 border border-[var(--alert-yellow)]/20">
            <div className="relative">
              <AlertTriangle className="h-4 w-4 text-[var(--alert-yellow)]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--alert-yellow)] animate-pulse-custom" />
            </div>
            <p className="text-sm text-[var(--alert-yellow)]/90">Sin actividad programada</p>
          </div>
        )}

        {/* Action Button */}
        <button
          className="w-full gradient-button rounded-xl py-3 flex items-center justify-center gap-2 text-sm"
          onClick={(e) => {
            e.stopPropagation()
            onOpenChat?.(deal.id)
          }}
        >
          <MessageSquare className="h-4 w-4" />
          Abrir Chat
        </button>
      </div>
    </Card>
  )
}
