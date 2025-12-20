"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, Monitor, Handshake, FileText } from "lucide-react"

interface ScheduleActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealName: string
  onConfirm: (activity: {
    title: string
    type: string
    date: string
    time: string
    note: string
  }) => void
  onSkip: () => void
}

const activityTypes = [
  { value: "call", label: "Call", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "demo", label: "Demo", icon: Monitor },
  { value: "meeting", label: "Meeting", icon: Handshake },
  { value: "follow-up", label: "Follow-up", icon: FileText },
]

export function ScheduleActivityModal({ open, onOpenChange, dealName, onConfirm, onSkip }: ScheduleActivityModalProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    title: "",
    type: "call",
    date: defaultDate,
    time: "10:00",
    note: "",
  })

  const handleSubmit = () => {
    onConfirm(formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      title: "",
      type: "call",
      date: defaultDate,
      time: "10:00",
      note: "",
    })
  }

  const handleSkip = () => {
    onSkip()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Programar Siguiente Actividad</DialogTitle>
          <p className="text-sm text-muted-foreground">Para mantener momentum con {dealName}</p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título Actividad</Label>
              <Input
                id="title"
                placeholder="Llamada de seguimiento"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo Actividad</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal">Deal</Label>
              <Input id="deal" value={dealName} disabled className="bg-muted" />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Full width note */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="note">Nota</Label>
            <Textarea
              id="note"
              placeholder="Objetivo de la actividad..."
              rows={3}
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handleSkip}>
            Solo completar
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title}>
            Agendar actividad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
