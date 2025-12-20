"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Download } from "lucide-react"
import { DealsPerformance } from "@/components/deals-performance"
import { VisualCharts } from "@/components/visual-charts"
import { DetailedBreakdown } from "@/components/detailed-breakdown"

type Period = "week" | "month" | "quarter"

export function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month")
  const [dateRange, setDateRange] = useState("Últimos 3 meses")

  const handleExport = () => {
    // Backend will handle CSV export
    console.log("[v0] Exporting data to CSV...")
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Period Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={selectedPeriod === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
                className="text-xs"
              >
                Semana
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
                className="text-xs"
              >
                Mes
              </Button>
              <Button
                variant={selectedPeriod === "quarter" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("quarter")}
                className="text-xs"
              >
                Trimestre
              </Button>
            </div>

            {/* Date Picker */}
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{dateRange}</span>
            </Button>
          </div>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </Card>

      {/* Deals Performance */}
      <DealsPerformance />

      {/* Visual Charts */}
      <VisualCharts />

      {/* Detailed Breakdown */}
      <DetailedBreakdown />
    </div>
  )
}
