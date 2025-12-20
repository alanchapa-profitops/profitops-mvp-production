"use client"

import type React from "react"

import { PipelineColumn } from "@/components/pipeline-column"
import { FavoriteCategoryModal } from "@/components/favorite-category-modal"
import type { Deal } from "@/types/deal"
import { PipedriveResponse, PipedriveDeal } from "@/lib/pipedrive-service"

// Mapeo de etapas del radar con nombres en español
const stageMapping = {
  prospeccion: "Prospección",
  discovery: "Discovery", 
  propuesta: "Propuesta",
  negociacion: "Negociación",
  cierre: "Cierre"
} as const

interface PipelineBoardProps {
  pipedriveData?: PipedriveResponse | null
  modalOpen: boolean
  selectedDeal: Deal | null
  setModalOpen: (open: boolean) => void
  setSelectedDeal: (deal: Deal | null) => void
  onToggleFavorite: (dealId: string) => void
  onCategorySelect: (category: "reactivar" | "critico" | "momentum") => void
  onOpenChat: (dealId: string) => void
}

// Función helper mejorada para convertir PipedriveDeal a Deal
const mapPipedriveDealToFrontendDeal = (pipedriveDeal: PipedriveDeal): Deal => {
  // Generar email de contacto de manera segura
  const generateEmail = () => {
    if (!pipedriveDeal.person_name || !pipedriveDeal.org_name) {
      return "contacto@empresa.com"
    }
    const firstName = pipedriveDeal.person_name.toLowerCase().replace(/\s+/g, '.')
    const orgName = pipedriveDeal.org_name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${firstName}@${orgName}.com`
  }

  // Determinar sprintCategory basado en estado y valor
  const getSprintCategory = (): Deal['sprintCategory'] => {
    if (pipedriveDeal.estado === "rojo") return "critico"
    if (pipedriveDeal.estado === "verde") return "momentum"
    if (pipedriveDeal.value_imr > 30000) return "momentum"
    return null
  }

  return {
    id: pipedriveDeal.deal_id.toString(),
    company: pipedriveDeal.org_name || "Empresa sin nombre",
    contactName: pipedriveDeal.person_name || "Sin contacto",
    contactEmail: generateEmail(),
    source: "cold-outreach" as const,
    imrValue: pipedriveDeal.value_imr || 0,
    tcvValue: pipedriveDeal.value_vtc || 0,
    contractDurationMonths: 12,
    daysInStage: Math.floor(Math.random() * 30) + 1, // Placeholder
    nextActivity: pipedriveDeal.next_activity_subject || "Sin actividad programada",
    activityDate: pipedriveDeal.next_activity_date || "",
    expectedCloseDate: pipedriveDeal.expected_close_date || "2026-01-31",
    stage: pipedriveDeal.stage_id.toString(),
    isFavorite: pipedriveDeal.value_imr > 40000, // Marcar como favorito deals grandes
    sprintCategory: getSprintCategory(),
    chatCategory: "manufactura"
  }
}

export function PipelineBoard({
  pipedriveData,
  modalOpen,
  selectedDeal,
  setModalOpen,
  setSelectedDeal,
  onToggleFavorite,
  onCategorySelect,
  onOpenChat,
}: PipelineBoardProps) {
  // Debug con datos reales
  console.log('🔍 PipelineBoard - pipedriveData completo:', pipedriveData);

  if (pipedriveData?.radar) {
    console.log('✅ Radar data confirmado:');
    console.log(`📊 Total deals en radar: ${pipedriveData.radar.total_deals}`);
    console.log(`💰 Pipeline total IMR: $${pipedriveData.radar.pipeline_total_imr.toLocaleString()}`);
    
    // Log de cada etapa
    Object.entries(pipedriveData.radar).forEach(([key, value]) => {
      if (key in stageMapping && typeof value === 'object' && value !== null && 'total' in value) {
        console.log(`🎯 ${key}: ${value.total} deals, primeros 2:`, value.deals.slice(0, 2).map(d => `${d.org_name} ($${d.value_imr})`));
      }
    });
  }

  // Verificar que tenemos datos del radar con etapas
  if (!pipedriveData?.radar || 
      !pipedriveData.radar.prospeccion || 
      !pipedriveData.radar.discovery || 
      !pipedriveData.radar.propuesta || 
      !pipedriveData.radar.negociacion || 
      !pipedriveData.radar.cierre) {
    console.log('⏳ Faltan datos de etapas del radar');
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando pipeline...</div>
      </div>
    )
  }

  const { radar } = pipedriveData

  console.log('🚀 Procesando todas las etapas del radar...');

  return (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {Object.entries(stageMapping).map(([stageKey, stageName]) => {
            const stageData = radar[stageKey as keyof typeof stageMapping]
            
            if (!stageData) {
              console.log(`⚠️ No hay datos para etapa: ${stageKey}`);
              return null;
            }

            const pipedriveDeals = stageData.deals || []
            
            console.log(`📊 ${stageName} (${stageKey}):`, {
              total: stageData.total,
              dealsCount: pipedriveDeals.length,
              totalValue: pipedriveDeals.reduce((sum, deal) => sum + (deal.value_imr || 0), 0)
            });
            
            // Mapear PipedriveDeals a Deals usando la función mejorada
            const mappedDeals: Deal[] = pipedriveDeals.map(mapPipedriveDealToFrontendDeal)
            
            console.log(`✅ Deals mapeados para ${stageName}:`, mappedDeals.length, 'deals listos');
            
            return (
              <PipelineColumn
                key={stageKey}
                stage={stageName}
                deals={mappedDeals}
                onToggleFavorite={onToggleFavorite}
                onOpenChat={onOpenChat}
              />
            )
          })}
        </div>
      </div>

      <FavoriteCategoryModal
        isOpen={modalOpen}
        companyName={selectedDeal?.company || ""}
        onSelect={onCategorySelect}
        onClose={() => {
          setModalOpen(false)
          setSelectedDeal(null)
        }}
      />
    </>
  )
}