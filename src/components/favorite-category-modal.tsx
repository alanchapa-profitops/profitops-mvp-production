"use client"

import { AlertCircle, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FavoriteCategoryModalProps {
  isOpen: boolean
  companyName: string
  onSelect: (category: "reactivar" | "critico" | "momentum") => void
  onClose: () => void
}

export function FavoriteCategoryModal({ isOpen, companyName, onSelect, onClose }: FavoriteCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">¿Cómo categorizar {companyName}?</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full h-auto py-4 px-4 flex items-start gap-3 hover:bg-red-500/10 hover:border-red-500 group bg-transparent"
            onClick={() => onSelect("reactivar")}
          >
            <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Reactivar</p>
              <p className="text-xs text-muted-foreground">Deals que necesitan seguimiento urgente</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-auto py-4 px-4 flex items-start gap-3 hover:bg-amber-500/10 hover:border-amber-500 group bg-transparent"
            onClick={() => onSelect("critico")}
          >
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Crítico</p>
              <p className="text-xs text-muted-foreground">Deals en riesgo que requieren atención</p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full h-auto py-4 px-4 flex items-start gap-3 hover:bg-emerald-500/10 hover:border-emerald-500 group bg-transparent"
            onClick={() => onSelect("momentum")}
          >
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Momentum</p>
              <p className="text-xs text-muted-foreground">Deals con buen progreso</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
