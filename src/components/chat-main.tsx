"use client"

import { useState } from "react"
import { Send, Mic, Paperclip, Target, Zap, Dices, CheckCircle2, Calendar, RefreshCw, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"

interface ChatMainProps {
  selectedDeal: Deal | null
  selectedCoach: "deal" | "tactico" | "metodologico"
  onCoachChange: (coach: "deal" | "tactico" | "metodologico") => void
  chatType: "deal" | "weekly"
  weeklyCoachType?: "insights" | "metodologico" | "estrategico" | "performance"
}

const coaches = [
  { id: "deal" as const, icon: Target, label: "Deal Coach", color: "text-blue-500" },
  { id: "tactico" as const, icon: Zap, label: "Táctico", color: "text-amber-500" },
  { id: "metodologico" as const, icon: Dices, label: "Metodológico", color: "text-purple-500" },
]

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  coach?: "deal" | "tactico" | "metodologico"
}

const sampleMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "¿Cómo acelerar este deal?",
  },
  {
    id: "2",
    type: "assistant",
    coach: "deal",
    content:
      "Basado en los 28 días que llevas en Discovery con Entheospace y considerando que es manufactura, te recomiendo: 1) Agendar una demo técnica específica para su línea de producción, 2) Involucrar a su CFO en la siguiente reunión para discutir ROI, 3) Preparar un business case con métricas de su industria.",
  },
  {
    id: "3",
    type: "user",
    content: "Dame script de email para reactivar",
  },
  {
    id: "4",
    type: "assistant",
    coach: "tactico",
    content:
      'Para reactivar Entheospace específicamente después de 28 días en Discovery:\n\nAsunto: "Entheospace + [Tu Empresa] - Próximos pasos técnicos"\n\nHola [Nombre],\n\nHace algunas semanas discutimos cómo optimizar su línea de producción. He preparado una demo técnica personalizada que muestra exactamente cómo empresas similares han logrado reducir tiempos de ciclo en un 34%.\n\n¿Te viene bien el jueves 21 a las 10am para revisar estos casos específicos de manufactura?\n\nSaludos,\n[Tu nombre]',
  },
]

export function ChatMain({ selectedDeal, selectedCoach, onCoachChange, chatType, weeklyCoachType }: ChatMainProps) {
  const [messages] = useState<Message[]>(sampleMessages)
  const [inputValue, setInputValue] = useState("")

  const calculatedTCV = selectedDeal ? selectedDeal.imrValue * selectedDeal.contractDurationMonths : 0

  const getHeaderTitle = () => {
    if (chatType === "deal" && selectedDeal) {
      return `Deal: ${selectedDeal.company}`
    }

    // Weekly coaches - show only coach name
    if (chatType === "weekly") {
      switch (weeklyCoachType) {
        case "insights":
          return "Coach Insights"
        case "metodologico":
          return "Coach Metodológico"
        case "estrategico":
          return "Coach Estratégico"
        case "performance":
          return "Coach Performance"
        default:
          return "Weekly Coach"
      }
    }

    return "Coach"
  }

  return (
    <Card className="flex flex-col h-full">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
      </div>

      {chatType === "deal" && selectedDeal && (
        <div className="border-b border-border px-4 py-3 bg-muted/30">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="font-semibold text-base">{selectedDeal.company}</span>
            <span className="text-muted-foreground">|</span>
            <span className="font-semibold text-green-600 dark:text-green-500">
              ${(selectedDeal.imrValue / 1000).toFixed(0)}K IMR
            </span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">${(calculatedTCV / 1000).toFixed(0)}K TCV</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{selectedDeal.contractDurationMonths} meses</span>
            <span className="text-muted-foreground">|</span>
            <Badge variant="outline" className="font-normal">
              {selectedDeal.stage}
            </Badge>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">
              Cierre:{" "}
              {selectedDeal.expectedCloseDate
                ? new Date(selectedDeal.expectedCloseDate).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })
                : "N/A"}
            </span>
            {selectedDeal.nextActivity && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-foreground">{selectedDeal.nextActivity}</span>
              </>
            )}
          </div>
        </div>
      )}

      {chatType === "deal" && (
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
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground border border-border",
              )}
            >
              {message.type === "assistant" && message.coach && (
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

      <div className="border-t border-border p-4 space-y-3">
        {/* Quick Actions */}
        {chatType === "deal" && selectedDeal && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-background">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completar actividad
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-background">
              <Calendar className="h-3.5 w-3.5" />
              Programar call
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-background">
              <RefreshCw className="h-3.5 w-3.5" />
              Cambiar etapa
            </Button>
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs bg-background">
              <FileText className="h-3.5 w-3.5" />
              Agregar nota
            </Button>
          </div>
        )}

        {/* Chat Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder={
              chatType === "deal" && selectedDeal ? `Pregunta sobre ${selectedDeal.company}...` : "Pregunta al coach..."
            }
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
