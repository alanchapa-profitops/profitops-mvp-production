"use client"

import { useState } from "react"
import type { Deal } from "@/types/deal"
import { InsightsSidebar } from "./insights-sidebar"
import { WeeklyPlanner } from "./weekly-planner"
import { PerformanceCoaching } from "./performance-coaching"
import { WeeklyCoachesChat } from "./weekly-coaches-chat"

interface InsightsViewProps {
  deals: Deal[]
}

export function InsightsView({ deals }: InsightsViewProps) {
  const [selectedCoach, setSelectedCoach] = useState<"insights" | "metodologico" | "estrategico" | "performance">(
    "insights",
  )

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      {/* Main Area - 75% */}
      <div className="flex-[3] flex flex-col gap-6 overflow-y-auto">
        <WeeklyPlanner deals={deals} />
        <PerformanceCoaching deals={deals} />
        <WeeklyCoachesChat selectedCoach={selectedCoach} onCoachChange={setSelectedCoach} />
      </div>

      {/* Right Sidebar - 25% */}
      <div className="flex-[1]">
        <InsightsSidebar deals={deals} selectedCoach={selectedCoach} onSelectCoach={setSelectedCoach} />
      </div>
    </div>
  )
}
