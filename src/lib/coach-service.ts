// Coach Service - Conecta frontend con el coach de ventas AI en n8n
import type { Deal } from "@/types/deal"

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CoachRequest {
  message: string;
  context: string;
  history: string;
  system: string;
}

// URL del webhook del Chat Coach en ProfitOps-Dev
const COACH_WEBHOOK_URL = "https://profitops.app.n8n.cloud/webhook/b20184ee-ca4c-475c-ae24-3c84d08c4203";

export class CoachService {
  /**
   * Sends message to AI Coach with deal context
   */
  static async sendMessage(
    message: string, 
    selectedDeal?: Deal,
    conversationHistory: CoachMessage[] = []
  ): Promise<string> {
    try {
      console.log('🤖 Sending message to AI Coach...');
      
      const context = this.buildDealContext(selectedDeal);
      const history = this.buildConversationHistory(conversationHistory);
      const systemPrompt = this.buildSystemPrompt();

      const requestBody: CoachRequest = {
        message,
        context,
        history,
        system: systemPrompt
      };

      const response = await fetch(COACH_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      
      // Parse and clean the response
      let cleanResponse = data;
      try {
        // If response is JSON, extract the text content
        const jsonResponse = JSON.parse(data);
        if (jsonResponse.content && Array.isArray(jsonResponse.content)) {
          cleanResponse = jsonResponse.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('');
        }
      } catch (e) {
        // If not JSON, use as-is (which is what we want)
        cleanResponse = data;
      }
      
      console.log('✅ Coach response received');
      return cleanResponse;
    } catch (error) {
      console.error('❌ Error communicating with coach:', error);
      throw new Error('Failed to get response from AI Coach');
    }
  }

  /**
   * Builds deal context for the coach
   */
  private static buildDealContext(deal?: Deal): string {
    if (!deal) {
      return "CONTEXTO: Conversación general de coaching de ventas. No hay deal específico seleccionado.";
    }

    return `CONTEXTO DEL DEAL:
- Empresa: ${deal.company}
- Contacto: ${deal.contactName}
- Email: ${deal.contactEmail}
- Valor IMR: $${deal.imrValue?.toLocaleString()} MXN
- Valor TCV: $${deal.tcvValue?.toLocaleString()} MXN
- Etapa actual: ${deal.stage}
- Próxima actividad: ${deal.nextActivity || "Sin actividad programada"}
- Fecha de actividad: ${deal.activityDate || "Sin fecha"}
- Fecha esperada de cierre: ${deal.expectedCloseDate}
- Días en etapa: ${deal.daysInStage}
- Duración contrato: ${deal.contractDurationMonths} meses
- Fuente: ${deal.source}
- Categoría sprint: ${deal.sprintCategory || "Sin categoría"}
- Es favorito: ${deal.isFavorite ? "Sí" : "No"}`;
  }

  /**
   * Builds conversation history for context
   */
  private static buildConversationHistory(history: CoachMessage[]): string {
    if (history.length === 0) {
      return "HISTORIAL: Primera interacción en esta sesión.";
    }

    return "HISTORIAL DE CONVERSACIÓN:\n" + 
      history.map((msg, index) => 
        `${index + 1}. ${msg.role === "user" ? "Usuario" : "Coach"}: ${msg.content}`
      ).join("\n");
  }

  /**
   * Builds system prompt for the coach
   */
  private static buildSystemPrompt(): string {
    return `Eres un coach de ventas B2B experto especializado en el mercado mexicano. Tu rol es ayudar a vendedores a maximizar sus resultados mediante coaching estratégico y táctico.

ESPECIALIDADES:
- Metodologías de venta: SPIN Selling, Challenger Sale, MEDDIC, Sandler
- Análisis de pipeline y gestión de oportunidades  
- Coaching de actividades y próximos pasos
- Optimización de procesos comerciales
- Estrategias para el mercado B2B mexicano

ESTILO DE COMUNICACIÓN:
- Directo pero empático
- Preguntas estratégicas que generen reflexión
- Recomendaciones específicas y accionables
- Enfoque en resultados medibles

CUANDO ANALICES UN DEAL:
1. Identifica fortalezas y áreas de mejora
2. Sugiere próximos pasos específicos
3. Pregunta sobre información faltante crítica
4. Recomienda estrategias basadas en la etapa actual
5. Alerta sobre riesgos potenciales

Responde siempre en español mexicano profesional.`;
  }
}