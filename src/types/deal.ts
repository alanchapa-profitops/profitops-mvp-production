export type DealCategory = "manufactura" | "tecnologia" | "servicios" | "deals" | string

export interface Deal {
  id: string
  company: string
  contactName?: string // Added contact fields for new deal creation
  contactEmail?: string
  source?: "referido" | "cold-outreach" | "inbound" | "partner" | "evento" | "otro"
  imrValue: number
  tcvValue: number
  contractDurationMonths: number
  daysInStage: number
  nextActivity: string
  activityDate: string
  expectedCloseDate: string
  stage: string
  isFavorite: boolean
  sprintCategory: "reactivar" | "critico" | "momentum" | null
  chatCategory?: DealCategory
}
