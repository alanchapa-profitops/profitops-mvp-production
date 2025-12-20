"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react"
import { CoachService, CoachMessage } from "@/lib/coach-service"
import type { Deal } from "@/types/deal"

interface ChatViewProps {
  deals: Deal[]
  onUpdateDeal: (dealId: string, updates: Partial<Deal>) => void
  onCreateDeal: (dealData: any) => void
  initialDealId?: string | null
  onDealSelect?: () => void
}

export function ChatView({ deals, onUpdateDeal, onCreateDeal, initialDealId, onDealSelect }: ChatViewProps) {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(initialDealId)
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize selectedDealId from initialDealId and clear messages
  useEffect(() => {
    if (initialDealId && initialDealId !== selectedDealId) {
      setSelectedDealId(initialDealId)
      setMessages([]) // Reset messages when switching deals via navigation
    }
  }, [initialDealId])

  // Clear messages when manually changing deals via selector
  useEffect(() => {
    if (selectedDealId && !initialDealId) {
      setMessages([])
    }
  }, [selectedDealId])

  // Send initial greeting when deal is selected
  useEffect(() => {
    if (selectedDealId && messages.length === 0) {
      const selectedDeal = deals.find(d => d.id === selectedDealId)
      if (selectedDeal) {
        const greetingMessage: CoachMessage = {
          role: "assistant",
          content: `¡Hola! Soy tu coach de ventas AI. Veo que quieres trabajar en el deal de **${selectedDeal.company}** (${selectedDeal.contactName}). 

📊 **Contexto rápido:**
- Valor: $${selectedDeal.imrValue?.toLocaleString()} IMR
- Etapa: ${selectedDeal.stage}
- Próxima actividad: ${selectedDeal.nextActivity || "Sin actividad programada"}

¿En qué te puedo ayudar con esta oportunidad? Puedo ayudarte con estrategia, próximos pasos, análisis del deal, o cualquier desafío que tengas.`,
          timestamp: new Date()
        }
        setMessages([greetingMessage])
      }
    }
  }, [selectedDealId, deals, messages.length])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: CoachMessage = {
      role: "user",
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    try {
      // Find selected deal
      const selectedDeal = deals.find(d => d.id === selectedDealId)
      
      const response = await CoachService.sendMessage(
        userMessage.content,
        selectedDeal,
        messages
      )

      const assistantMessage: CoachMessage = {
        role: "assistant", 
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: CoachMessage = {
        role: "assistant",
        content: "Lo siento, hubo un error conectando con el coach. Por favor intenta nuevamente.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedDeal = deals.find(d => d.id === selectedDealId)

  return (
    <div className="space-y-6">
      {/* Deal Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Coach de Ventas AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Deal seleccionado:</label>
            <Select value={selectedDealId || ""} onValueChange={setSelectedDealId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un deal para coaching" />
              </SelectTrigger>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.company} - ${deal.imrValue?.toLocaleString()} IMR
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDeal && (
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p><strong>Empresa:</strong> {selectedDeal.company}</p>
              <p><strong>Contacto:</strong> {selectedDeal.contactName}</p>
              <p><strong>Etapa:</strong> {selectedDeal.stage}</p>
              <p><strong>Valor IMR:</strong> ${selectedDeal.imrValue?.toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedDealId && (
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">
              Coaching: {selectedDeal?.company}
            </CardTitle>
          </CardHeader>
          
          {/* Messages */}
          <CardContent className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-600" : "bg-green-600"
                    }`}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta sobre este deal..."
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}