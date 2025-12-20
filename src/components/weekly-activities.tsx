"use client"

import { useState } from "react"
import { Calendar, AlertTriangle, Phone, Target, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"
import { ScheduleActivityModal } from "./schedule-activity-modal"

interface Activity {
  id: string
  type: "scheduled" | "missing" | "overdue" | "pending"
  icon: typeof Calendar
  title: string
  date?: string
  completed: boolean
  deal?: Deal
  dealName?: string
  isMissing?: boolean
}

interface WeeklyActivitiesProps {
  deals: Deal[]
}

export function WeeklyActivities({ deals }: WeeklyActivitiesProps) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedActivityDeal, setSelectedActivityDeal] = useState<string>("")
  const [isSchedulingFromMissing, setIsSchedulingFromMissing] = useState(false)

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "scheduled",
      icon: Calendar,
      title: "Demo Entheospace - 16 Dec 2pm",
      date: "2024-12-16",
      completed: false,
      dealName: "Entheospace",
      isMissing: false,
    },
    {
      id: "2",
      type: "overdue",
      icon: Phone,
      title: "Call TRUMPF stakeholders - vencido 14 Dec",
      date: "2024-12-14",
      completed: false,
      dealName: "TRUMPF",
      isMissing: false,
    },
    {
      id: "3",
      type: "missing",
      icon: AlertTriangle,
      title: "Sin actividad: CBS Compresores (21 días)",
      completed: false,
      dealName: "CBS Compresores",
      isMissing: true,
    },
    {
      id: "4",
      type: "missing",
      icon: AlertTriangle,
      title: "Sin actividad: MTE Global (12 días)",
      completed: false,
      dealName: "MTE Global",
      isMissing: true,
    },
  ])

  const toggleActivity = (id: string) => {
    const activity = activities.find((act) => act.id === id)
    if (activity && !activity.completed) {
      setSelectedActivityDeal(activity.dealName || "")
      setIsSchedulingFromMissing(false)
      setScheduleModalOpen(true)
      setActivities((prev) => prev.map((act) => (act.id === id ? { ...act, completed: true } : act)))
    } else {
      // Uncheck - just toggle
      setActivities((prev) => prev.map((act) => (act.id === id ? { ...act, completed: false } : act)))
    }
  }

  const handleAddActivity = (dealName: string) => {
    setSelectedActivityDeal(dealName)
    setIsSchedulingFromMissing(true)
    setScheduleModalOpen(true)
  }

  const handleScheduleActivity = (activityData: {
    title: string
    type: string
    date: string
    time: string
    note: string
  }) => {
    console.log("[v0] Scheduling new activity:", activityData)
    const newActivity: Activity = {
      id: `new-${Date.now()}`,
      type: "pending",
      icon: Calendar,
      title: `${activityData.title} - ${activityData.date}`,
      date: activityData.date,
      completed: false,
      dealName: selectedActivityDeal,
      isMissing: false,
    }
    setActivities((prev) => [...prev, newActivity])
  }

  const handleSkipSchedule = () => {
    console.log("[v0] Activity marked complete without scheduling next")
    // Activity is already marked as complete, just close modal
  }

  const completedCount = activities.filter((a) => a.completed).length
  const totalScheduled = activities.filter((a) => !a.isMissing).length

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Weekly Activities Summary</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>
              Esta semana: {totalScheduled} actividades programadas, {completedCount} completadas
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-lg border transition-colors",
                activity.completed ? "bg-muted/50 border-muted" : "bg-card border-border hover:border-primary/50",
                activity.isMissing && "border-amber-500/30 bg-amber-500/5",
              )}
            >
              {!activity.isMissing && (
                <Checkbox
                  checked={activity.completed}
                  onCheckedChange={() => toggleActivity(activity.id)}
                  className="mt-0.5"
                />
              )}

              <div className="flex-1 flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-md",
                    activity.type === "scheduled" && "bg-blue-500/10 text-blue-500",
                    activity.type === "missing" && "bg-amber-500/10 text-amber-500",
                    activity.type === "overdue" && "bg-red-500/10 text-red-500",
                    activity.type === "pending" && "bg-purple-500/10 text-purple-500",
                  )}
                >
                  <activity.icon className="h-4 w-4" />
                </div>

                <div className="flex-1">
                  <p className={cn("text-sm font-medium", activity.completed && "line-through text-muted-foreground")}>
                    {activity.title}
                  </p>
                  {activity.date && !activity.isMissing && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>

                {activity.isMissing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 bg-transparent border-amber-500/30 hover:bg-amber-500/10"
                    onClick={() => handleAddActivity(activity.dealName || "")}
                  >
                    <Plus className="h-3 w-3" />
                    Agregar Actividad
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ScheduleActivityModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        dealName={selectedActivityDeal}
        onConfirm={handleScheduleActivity}
        onSkip={handleSkipSchedule}
      />
    </>
  )
}
