"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MetricsBar } from "@/components/metrics-bar"
import { PipelineBoard } from "@/components/pipeline-board"
import { SprintMetrics } from "@/components/sprint-metrics"
import { SprintBoard } from "@/components/sprint-board"
import { ChatView } from "@/components/chat-view"
import { IntelligenceView } from "@/components/intelligence-view"
import { ReportsView } from "@/components/reports-view"
import { PipedriveService, PipedriveResponse } from "@/lib/pipedrive-service"
import type { Deal } from "@/types/deal"

export default function HomePage() {
  const [activeView, setActiveView] = useState<"sprint" | "radar" | "coach" | "intelligence" | "reports">("sprint")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [deals, setDeals] = useState<Deal[]>([])
  const [pipedriveData, setPipedriveData] = useState<PipedriveResponse | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [chatDealId, setChatDealId] = useState<string | null>(null)

  // Load real data from Pipedrive on component mount
  useEffect(() => {
    loadPipedriveData()
  }, [])

  const loadPipedriveData = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Loading Pipedrive data...')
      
      const data = await PipedriveService.fetchPipelineData()
      setPipedriveData(data)
      
      // Map Sprint deals
      const sprintDeals = [
        ...data.sprint.deals_criticos,
        ...data.sprint.deals_con_momentum, 
        ...data.sprint.deals_para_reactivar
      ]
      
      // Map Radar deals
      const radarDeals = [
        ...data.radar.prospeccion.deals,
        ...data.radar.discovery.deals,
        ...data.radar.propuesta.deals,
        ...data.radar.negociacion.deals,
        ...data.radar.cierre.deals
      ]
      
      // Combine all deals and remove duplicates by deal_id
      const allDeals = [...sprintDeals, ...radarDeals]
      const uniqueDeals = allDeals.filter((deal, index, self) => 
        index === self.findIndex(d => d.deal_id === deal.deal_id)
      )
      
      const mappedDeals = uniqueDeals.map((deal, index) => PipedriveService.mapPipedriveDealToFrontend(deal, index))
      setDeals(mappedDeals)
      
      console.log('✅ Pipedrive data loaded successfully!')
      console.log(`📊 Total deals: ${mappedDeals.length}`)
      console.log(`📊 Sprint deals: ${sprintDeals.length}, Radar deals: ${radarDeals.length}, Combined unique: ${uniqueDeals.length}`)
    } catch (error) {
      console.error('❌ Error loading Pipedrive data:', error)
      // Keep empty array if error, don't crash the app
      setDeals([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId)
    if (!deal) return

    if (!deal.isFavorite) {
      setSelectedDeal(deal)
      setModalOpen(true)
    } else {
      setDeals((prevDeals) =>
        prevDeals.map((d) => (d.id === dealId ? { ...d, isFavorite: false, sprintCategory: null } : d)),
      )
    }
  }

  const handleCategorySelect = (category: "reactivar" | "critico" | "momentum") => {
    if (!selectedDeal) return

    setDeals((prevDeals) =>
      prevDeals.map((deal) =>
        deal.id === selectedDeal.id ? { ...deal, isFavorite: true, sprintCategory: category } : deal,
      ),
    )

    setModalOpen(false)
    setSelectedDeal(null)
  }

  const handleUpdateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals((prevDeals) => prevDeals.map((deal) => (deal.id === dealId ? { ...deal, ...updates } : deal)))
  }

  const handleCreateDeal = (dealData: {
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
  }) => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      company: dealData.company,
      contactName: dealData.contactName,
      contactEmail: dealData.contactEmail,
      source: dealData.source,
      imrValue: dealData.imrValue,
      tcvValue: dealData.tcvValue,
      contractDurationMonths: dealData.contractDurationMonths,
      daysInStage: 0,
      nextActivity: "",
      activityDate: "",
      expectedCloseDate: dealData.expectedCloseDate,
      stage: dealData.stage,
      isFavorite: false,
      sprintCategory: null,
      chatCategory: dealData.chatCategory,
    }

    setDeals((prevDeals) => [...prevDeals, newDeal])
  }

  const handleOpenChat = (dealId: string) => {
    console.log('🎯 handleOpenChat called with dealId:', dealId)
    setChatDealId(dealId)
    setActiveView("coach")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando datos de Pipedrive...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-background">
        <Header
          activeView={activeView}
          onViewChange={setActiveView}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        />
        
        {/* Real-time data indicator */}
        <div className="bg-green-600 text-white text-sm px-4 py-2 text-center">
          ✅ Conectado a Pipedrive - Datos en tiempo real 
          {pipedriveData && ` | ${pipedriveData.radar.total_deals} deals | Pipeline: $${pipedriveData.radar.pipeline_total_imr.toLocaleString()}`}
          <button 
            onClick={loadPipedriveData} 
            className="ml-4 px-2 py-1 bg-green-700 rounded text-xs hover:bg-green-800"
          >
            🔄 Actualizar
          </button>
        </div>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {activeView === "sprint" ? (
            <>
              <SprintMetrics />
              <SprintBoard deals={deals} onOpenChat={handleOpenChat} />
            </>
          ) : activeView === "coach" ? (
            <ChatView
              deals={deals}
              onUpdateDeal={handleUpdateDeal}
              onCreateDeal={handleCreateDeal}
              initialDealId={chatDealId}
              onDealSelect={() => setChatDealId(null)}
            />
          ) : activeView === "intelligence" ? (
            <IntelligenceView deals={deals} />
          ) : activeView === "reports" ? (
            <ReportsView />
          ) : (
            <>
              <MetricsBar />
              <PipelineBoard
                pipedriveData={pipedriveData}
                modalOpen={modalOpen}
                selectedDeal={selectedDeal}
                setModalOpen={setModalOpen}
                setSelectedDeal={setSelectedDeal}
                onToggleFavorite={toggleFavorite}
                onCategorySelect={handleCategorySelect}
                onOpenChat={handleOpenChat}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
