"use client"

import { useState } from "react"
import { Send, Mic, Paperclip, Brain, Target, Lightbulb, BarChart3, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface WeeklyCoachesChatProps {
  selectedCoach: "insights" | "metodologico" | "estrategico" | "performance"
  onCoachChange: (coach: "insights" | "metodologico" | "estrategico" | "performance") => void
}

const coaches = [
  { id: "insights" as const, icon: Brain, label: "Coach Insights", gradient: "from-blue-500 to-cyan-500" },
  { id: "metodologico" as const, icon: Target, label: "Metodológico", gradient: "from-purple-500 to-pink-500" },
  { id: "estrategico" as const, icon: Lightbulb, label: "Estratégico", gradient: "from-orange-500 to-red-500" },
  { id: "performance" as const, icon: BarChart3, label: "Performance", gradient: "from-green-500 to-emerald-500" },
]

const sampleMessages = [
  {
    id: "1",
    type: "user" as const,
    content: "¿Cómo priorizar esta semana?",
  },
  {
    id: "2",
    type: "assistant" as const,
    coach: "estrategico" as const,
    content:
      "Basado en tu pipeline, prioriza:\n\n1) Entheospace ($130K IMR) - Crítico: 28 días stalled, necesita reactivación urgente con demo técnica\n\n2) TRUMPF ($85K IMR) - Momentum: Demo mañana, prepara business case específico para manufactura\n\n3) CBS Compresores ($60K IMR) - Momentum: 8 días en Propuesta, acelera presentación esta semana\n\nEstos 3 deals representan $275K IMR y tienen mayor probabilidad de cierre en Q1.",
  },
]

export function WeeklyCoachesChat({ selectedCoach, onCoachChange }: WeeklyCoachesChatProps) {
  const [inputValue, setInputValue] = useState("")

  return (
    <Card className="flex flex-col h-[500px]">
      {/* Breadcrumb */}
      <div className="border-b border-border px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>Dashboard</span>
          <ChevronRight className="h-3 w-3" />
          <span>Insights</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Weekly Coaches</span>
        </div>
      </div>

      {/* Coach Selector */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-2">
          {coaches.map((coach) => (
            <Button
              key={coach.id}
              variant={selectedCoach === coach.id ? "default" : "outline"}
              size="sm"
              className={cn("gap-2", selectedCoach === coach.id ? "" : "bg-background")}
              onClick={() => onCoachChange(coach.id)}
            >
              <coach.icon className="h-4 w-4" />
              {coach.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sampleMessages.map((message) => (
          <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border",
              )}
            >
              {message.type === "assistant" && "coach" in message && (
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  {coaches.find((c) => c.id === message.coach)?.icon && (
                    <>
                      {(() => {
                        const CoachIcon = coaches.find((c) => c.id === message.coach)!.icon
                        return <CoachIcon className="h-4 w-4" />
                      })()}
                    </>
                  )}
                  <span>{coaches.find((c) => c.id === message.coach)?.label}</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Pregunta sobre strategy, performance, metodologías..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="shrink-0">
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
