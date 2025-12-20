"use client"

import { useState } from "react"
import { BookOpen, FileText, Trophy, Download, Bookmark, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Deal } from "@/types/deal"

interface LearningItem {
  id: string
  category: "recommended" | "templates" | "playbooks"
  title: string
  description: string
  read: boolean
  type: "article" | "template" | "playbook"
}

interface LearningCenterProps {
  deals: Deal[]
}

export function LearningCenter({ deals }: LearningCenterProps) {
  const [items, setItems] = useState<LearningItem[]>([
    {
      id: "1",
      category: "recommended",
      title: "MEDDIC Deep Dive - para mejorar qualification de deals tech",
      description: "Framework completo de qualification con ejemplos específicos del sector tecnología",
      read: false,
      type: "article",
    },
    {
      id: "2",
      category: "recommended",
      title: "Objection Handling Scripts - pricing pushback solutions",
      description: "Scripts probados para manejar objeciones de precio en deals B2B de manufactura",
      read: false,
      type: "article",
    },
    {
      id: "3",
      category: "recommended",
      title: "Discovery Call Framework - Manufacturing playbook",
      description: "Guía paso a paso para calls de discovery en sector manufactura",
      read: false,
      type: "article",
    },
    {
      id: "4",
      category: "templates",
      title: "Follow-up email - deals stalled >21 días",
      description: "Template para reactivar deals que llevan más de 3 semanas sin actividad",
      read: false,
      type: "template",
    },
    {
      id: "5",
      category: "templates",
      title: "Demo agenda template - technical stakeholders",
      description: "Agenda estructurada para demos con audiencias técnicas",
      read: false,
      type: "template",
    },
    {
      id: "6",
      category: "templates",
      title: "ROI presentation - manufacturing ROI calculator",
      description: "Calculadora de ROI personalizada para sector manufactura con ejemplos",
      read: false,
      type: "template",
    },
    {
      id: "7",
      category: "playbooks",
      title: "Entheospace case study - manufacturing deal breakdown",
      description: "Análisis completo de tu deal más exitoso de manufactura",
      read: false,
      type: "playbook",
    },
    {
      id: "8",
      category: "playbooks",
      title: "How to accelerate Discovery - your successful patterns",
      description: "Patrones identificados en tus deals que avanzaron más rápido de Discovery a Propuesta",
      read: false,
      type: "playbook",
    },
  ])

  const toggleRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)))
  }

  const recommended = items.filter((i) => i.category === "recommended")
  const templates = items.filter((i) => i.category === "templates")
  const playbooks = items.filter((i) => i.category === "playbooks")

  const renderItem = (item: LearningItem) => (
    <div
      key={item.id}
      className={cn(
        "flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors",
        item.read && "bg-muted/30",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h4 className={cn("text-sm font-medium", item.read && "text-muted-foreground")}>{item.title}</h4>
          {item.read && <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
        </div>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {item.type === "template" && (
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Download className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Bookmark className="h-3.5 w-3.5" />
        </Button>
        <Button size="sm" variant="outline" onClick={() => toggleRead(item.id)}>
          {item.read ? "Unmark" : "Mark as read"}
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Learning Center</h2>
        <p className="text-sm text-muted-foreground mt-1">Content curado actualizado semanalmente</p>
      </div>

      <div className="space-y-6">
        {/* Recommended This Week */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recomendado Esta Semana
            </h3>
          </div>
          <div className="space-y-2">{recommended.map(renderItem)}</div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Templates Personalizados
            </h3>
          </div>
          <div className="space-y-2">{templates.map(renderItem)}</div>
        </div>

        {/* Success Playbooks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Success Playbooks</h3>
          </div>
          <div className="space-y-2">{playbooks.map(renderItem)}</div>
        </div>
      </div>
    </Card>
  )
}
