"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { DealCategory, Deal } from "@/types/deal"

interface NewDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateDeal: (dealData: {
    company: string
    contactName: string
    contactEmail: string
    source: Deal["source"]
    imrValue: number
    tcvValue: number
    contractDurationMonths: number
    expectedCloseDate: string
    stage: string
    chatCategory: string
  }) => void
}

const categoryOptions = [
  { value: "manufactura", label: "Manufactura Industrial" },
  { value: "tecnologia", label: "Tecnología" },
  { value: "servicios", label: "Servicios Especializados" },
  { value: "deals", label: "Sin categorizar" },
]

const sourceOptions = [
  { value: "referido", label: "Referido" },
  { value: "cold-outreach", label: "Cold Outreach" },
  { value: "inbound", label: "Inbound" },
  { value: "partner", label: "Partner" },
  { value: "evento", label: "Evento" },
  { value: "otro", label: "Otro" },
]

const stageOptions = [
  { value: "Prospección", label: "Prospección" },
  { value: "Discovery", label: "Discovery" },
  { value: "Propuesta", label: "Propuesta" },
]

export function NewDealModal({ open, onOpenChange, onCreateDeal }: NewDealModalProps) {
  const [company, setCompany] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [source, setSource] = useState<Deal["source"]>("inbound")
  const [imrValue, setImrValue] = useState("")
  const [contractDuration, setContractDuration] = useState("")
  const [expectedCloseDate, setExpectedCloseDate] = useState("")
  const [stage, setStage] = useState("Prospección")
  const [chatCategory, setChatCategory] = useState<DealCategory>("deals")

  const calculatedTCV =
    imrValue && contractDuration ? Number.parseFloat(imrValue) * Number.parseInt(contractDuration) : 0

  const handleCreate = () => {
    // Validate required fields
    if (!company || !contactName || !contactEmail || !imrValue || !contractDuration || !expectedCloseDate || !source) {
      return
    }

    onCreateDeal({
      company,
      contactName,
      contactEmail,
      source,
      imrValue: Number.parseFloat(imrValue),
      tcvValue: calculatedTCV,
      contractDurationMonths: Number.parseInt(contractDuration),
      expectedCloseDate,
      stage,
      chatCategory,
    })

    handleClose()
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset all fields
    setCompany("")
    setContactName("")
    setContactEmail("")
    setSource("inbound")
    setImrValue("")
    setContractDuration("")
    setExpectedCloseDate("")
    setStage("Prospección")
    setChatCategory("deals")
  }

  const isValid = company && contactName && contactEmail && imrValue && contractDuration && expectedCloseDate && source

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nuevo Deal</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Nombre Empresa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                placeholder="Ej: TRUMPF Manufacturing"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm font-medium">
                Nombre Contacto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactName"
                placeholder="Ej: Juan Pérez"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-sm font-medium">
                Email Contacto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="juan.perez@empresa.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage" className="text-sm font-medium">
                Etapa Inicial <span className="text-red-500">*</span>
              </Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger id="stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imrValue" className="text-sm font-medium">
                IMR Value ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="imrValue"
                type="number"
                placeholder="130000"
                value={imrValue}
                onChange={(e) => setImrValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractDuration" className="text-sm font-medium">
                Duración Contrato (meses) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contractDuration"
                type="number"
                placeholder="12"
                value={contractDuration}
                onChange={(e) => setContractDuration(e.target.value)}
              />
            </div>

            {calculatedTCV > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">TCV Calculado</Label>
                <div className="h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm flex items-center">
                  ${calculatedTCV.toLocaleString()}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium">
                Source/Fuente <span className="text-red-500">*</span>
              </Label>
              <Select value={source} onValueChange={(value) => setSource(value as Deal["source"])}>
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate" className="text-sm font-medium">
                Fecha Cierre Estimada <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
              />
            </div>
          </div>

          {/* Full Width - Chat Category */}
          <div className="col-span-2 space-y-2">
            <Label htmlFor="chatCategory" className="text-sm font-medium">
              Grupo Chat
            </Label>
            <Select value={chatCategory} onValueChange={(value) => setChatCategory(value as DealCategory)}>
              <SelectTrigger id="chatCategory">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selecciona el grupo donde aparecerá el deal cuando lo marques como favorito
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!isValid}>
            Crear Deal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
