"use client"

import type { Deal } from "@/types/deal"
import { WeeklyActivities } from "./weekly-activities"
import { CoachingInsights } from "./coaching-insights"
import { LearningCenter } from "./learning-center"

interface IntelligenceViewProps {
  deals: Deal[]
}

export function IntelligenceView({ deals }: IntelligenceViewProps) {
  return (
    <div className="space-y-6 h-[calc(100vh-140px)] overflow-y-auto">
      <WeeklyActivities deals={deals} />
      <CoachingInsights deals={deals} />
      <LearningCenter deals={deals} />
    </div>
  )
}
