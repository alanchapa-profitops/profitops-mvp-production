# Integración del Coach AI con Pipedrive Update

## Descripción General

Este documento muestra cómo integrar el servicio de actualización de Pipedrive con el Coach AI para que pueda actualizar deals automáticamente basándose en las conversaciones con el usuario.

---

## Arquitectura

```
Usuario → Frontend → Coach AI (n8n)
                         ↓
                   Detecta intención de actualizar
                         ↓
                   Llama a PipedriveUpdateService
                         ↓
                   Webhook n8n → Pipedrive API
                         ↓
                   Respuesta → Usuario
```

---

## Implementación en el Coach AI

### Opción 1: Detección Automática de Intenciones

El coach AI puede detectar automáticamente cuando el usuario quiere actualizar un deal y hacerlo por él.

**Actualizar el System Prompt del Coach** (`src/lib/coach-service.ts`):

```typescript
private static buildSystemPrompt(): string {
  return `Eres un coach de ventas B2B experto especializado en el mercado mexicano. Tu rol es ayudar a vendedores a maximizar sus resultados mediante coaching estratégico y táctico.

ESPECIALIDADES:
- Metodologías de venta: SPIN Selling, Challenger Sale, MEDDIC, Sandler
- Análisis de pipeline y gestión de oportunidades
- Coaching de actividades y próximos pasos
- Optimización de procesos comerciales
- Estrategias para el mercado B2B mexicano
- **ACTUALIZACIÓN AUTOMÁTICA DE DEALS EN PIPEDRIVE**

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
6. **ACTUALIZA EL DEAL EN PIPEDRIVE AUTOMÁTICAMENTE SI ES NECESARIO**

CAPACIDADES DE ACTUALIZACIÓN DE PIPEDRIVE:
Puedes actualizar deals en Pipedrive cuando el usuario:
- Menciona que cerró un trato
- Dice que avanzó a la siguiente etapa
- Actualiza el valor del deal
- Quiere agregar una nota importante
- Necesita programar un seguimiento
- Completa una actividad

FORMATO DE ACTUALIZACIÓN:
Cuando detectes que necesitas actualizar un deal, responde en este formato JSON al final de tu mensaje:

PIPEDRIVE_UPDATE:
{
  "deal": "Nombre del Deal",
  "updates": {
    "mrr": 40000,
    "stage_id": 4,
    "probabilidad": 75,
    "nota": "Texto de la nota"
  },
  "actividad": {
    "titulo": "Seguimiento",
    "tipo": "call",
    "fecha": "2025-01-15"
  }
}

El sistema detectará este JSON y ejecutará la actualización automáticamente.

Responde siempre en español mexicano profesional.`;
}
```

---

### Opción 2: Actualización Explícita con Comandos

El usuario puede pedirle explícitamente al coach que actualice un deal.

**Ejemplos de comandos del usuario**:

```
Usuario: "Actualiza el deal de Datatechnic con MRR de 40,000"
Usuario: "Mueve el deal de Acme a la etapa de negociación"
Usuario: "Agrega una nota al deal de BLK: cliente pidió descuento"
Usuario: "Programa un seguimiento para el 15 de enero"
```

**Procesamiento en el Frontend**:

```typescript
// En el componente del chat del coach
import { PipedriveUpdateService } from '@/lib/pipedrive-update-service';

async function handleCoachResponse(response: string) {
  // Detectar si la respuesta incluye un comando de actualización
  const updateMatch = response.match(/PIPEDRIVE_UPDATE:\s*(\{[\s\S]*?\})/);

  if (updateMatch) {
    try {
      const updateData = JSON.parse(updateMatch[1]);

      // Ejecutar la actualización
      const result = await PipedriveUpdateService.updateDeal(
        updateData.deal,
        updateData.updates,
        updateData.actividad,
        updateData.completar_actividad
      );

      if (result.success) {
        // Mostrar confirmación al usuario
        const confirmation = `✅ Deal actualizado exitosamente: ${result.deal?.title}`;

        // Agregar mensaje del sistema al chat
        addSystemMessage(confirmation);

        // Opcional: Refrescar los datos del dashboard
        await refreshDashboardData();
      }
    } catch (error) {
      console.error('Error actualizando deal:', error);
      addSystemMessage('❌ Error actualizando el deal en Pipedrive');
    }

    // Remover el JSON de la respuesta antes de mostrarlo
    response = response.replace(/PIPEDRIVE_UPDATE:[\s\S]*/, '').trim();
  }

  // Mostrar la respuesta del coach (sin el JSON)
  return response;
}
```

---

## Ejemplos de Uso en el Coach

### Ejemplo 1: Usuario cierra un deal

**Usuario**:
> "Acabo de cerrar el deal con Datatechnic por $50,000 MRR!"

**Coach AI**:
> ¡Excelente noticia! Felicidades por cerrar ese deal. $50,000 MRR es un gran logro.
>
> Déjame actualizar el deal en Pipedrive para reflejar este cierre exitoso.
>
> PIPEDRIVE_UPDATE:
> ```json
> {
>   "deal": "Datatechnic México",
>   "updates": {
>     "mrr": 50000,
>     "stage_id": 6,
>     "probabilidad": 100,
>     "nota": "Deal cerrado exitosamente por $50,000 MRR"
>   }
> }
> ```
>
> ¿Cuáles fueron los factores clave que ayudaron a cerrar este deal?

**Frontend**: Ejecuta la actualización y muestra:
> ✅ Deal actualizado: Datatechnic México marcado como ganado

---

### Ejemplo 2: Usuario avanza a siguiente etapa

**Usuario**:
> "Tuve una demo muy buena con Acme Corp. Creo que están listos para una propuesta."

**Coach AI**:
> Eso suena muy prometedor. Si la demo fue exitosa y están listos para recibir una propuesta, es momento de avanzar a la siguiente etapa.
>
> Déjame mover el deal a la etapa de Propuesta y programar un seguimiento.
>
> PIPEDRIVE_UPDATE:
> ```json
> {
>   "deal": "Acme Corp",
>   "updates": {
>     "stage_id": 3,
>     "probabilidad": 60,
>     "nota": "Demo exitosa. Cliente listo para propuesta."
>   },
>   "actividad": {
>     "titulo": "Enviar propuesta formal",
>     "tipo": "task",
>     "fecha": "2025-01-12"
>   }
> }
> ```
>
> Recomendaciones para la propuesta:
> 1. Incluye los casos de uso específicos que discutieron en la demo
> 2. Agrega un ROI estimado basado en sus necesidades
> 3. Considera ofrecer una fase piloto

---

### Ejemplo 3: Usuario completa una actividad

**Usuario**:
> "Acabo de terminar la llamada de seguimiento con BLK. Todo bien, pero necesitan más tiempo."

**Coach AI**:
> Entiendo. Que necesiten más tiempo no es necesariamente malo, pero es importante mantener el momentum.
>
> Déjame completar esa actividad y programar el próximo seguimiento.
>
> PIPEDRIVE_UPDATE:
> ```json
> {
>   "deal": "BLK",
>   "updates": {
>     "nota": "Seguimiento completado. Cliente necesita más tiempo para decisión."
>   },
>   "actividad": {
>     "titulo": "Check-in BLK",
>     "tipo": "call",
>     "fecha": "2025-01-20"
>   },
>   "completar_actividad": true
> }
> ```
>
> Preguntas de coaching:
> - ¿Cuál es el motivo específico por el que necesitan más tiempo?
> - ¿Hay algún bloqueador que podamos ayudar a resolver?
> - ¿Cuál es el timeline que mencionaron?

---

## Integración Completa - Código Ejemplo

### Actualizar `coach-service.ts`

```typescript
import { PipedriveUpdateService, UpdateDealRequest } from './pipedrive-update-service';

export class CoachService {
  /**
   * Sends message to AI Coach with deal context and handles Pipedrive updates
   */
  static async sendMessage(
    message: string,
    selectedDeal?: Deal,
    conversationHistory: CoachMessage[] = []
  ): Promise<{ response: string; pipedriveUpdate?: any }> {
    try {
      console.log('🤖 Sending message to AI Coach...');

      const context = this.buildDealContext(selectedDeal);
      const history = this.buildConversationHistory(conversationHistory);
      const systemPrompt = this.buildSystemPromptWithPipedriveCapabilities();

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
      let cleanResponse = this.parseCoachResponse(data);

      // Detectar si hay una actualización de Pipedrive
      const updateResult = await this.detectAndExecutePipedriveUpdate(cleanResponse, selectedDeal);

      if (updateResult) {
        // Remover el JSON de actualización de la respuesta
        cleanResponse = cleanResponse.replace(/PIPEDRIVE_UPDATE:[\s\S]*?```/g, '').trim();

        return {
          response: cleanResponse,
          pipedriveUpdate: updateResult
        };
      }

      console.log('✅ Coach response received');
      return { response: cleanResponse };
    } catch (error) {
      console.error('❌ Error communicating with coach:', error);
      throw new Error('Failed to get response from AI Coach');
    }
  }

  /**
   * Detecta y ejecuta actualizaciones de Pipedrive en la respuesta del coach
   */
  private static async detectAndExecutePipedriveUpdate(
    response: string,
    selectedDeal?: Deal
  ): Promise<any> {
    const updateMatch = response.match(/PIPEDRIVE_UPDATE:\s*```json\s*(\{[\s\S]*?\})\s*```/);

    if (!updateMatch) {
      return null;
    }

    try {
      const updateData: UpdateDealRequest = JSON.parse(updateMatch[1]);

      // Si no se especificó un deal, usar el seleccionado
      if (!updateData.deal && selectedDeal) {
        updateData.deal = selectedDeal.company;
      }

      console.log('🔄 Ejecutando actualización de Pipedrive...', updateData);

      const result = await PipedriveUpdateService.updateDeal(
        updateData.deal,
        updateData.updates,
        updateData.actividad,
        updateData.completar_actividad
      );

      return result;
    } catch (error) {
      console.error('❌ Error ejecutando actualización de Pipedrive:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * System prompt con capacidades de actualización de Pipedrive
   */
  private static buildSystemPromptWithPipedriveCapabilities(): string {
    return `[... System prompt anterior ...]

CAPACIDADES DE ACTUALIZACIÓN DE PIPEDRIVE:
Cuando detectes que el usuario menciona cambios en un deal, puedes actualizarlo automáticamente.

Para actualizar un deal, incluye este formato al final de tu respuesta:

PIPEDRIVE_UPDATE:
\`\`\`json
{
  "deal": "Nombre exacto del deal",
  "updates": {
    "mrr": 40000,
    "stage_id": 4,
    "probabilidad": 75,
    "fecha_cierre": "2025-02-15",
    "nota": "Texto de la nota"
  },
  "actividad": {
    "titulo": "Título de la actividad",
    "tipo": "call",
    "fecha": "2025-01-15"
  },
  "completar_actividad": false
}
\`\`\`

ETAPAS (stage_id):
1 = Prospección
2 = Discovery
3 = Propuesta
4 = Negociación
5 = Cierre
6 = Ganado/Perdido

TIPOS DE ACTIVIDAD (tipo):
- call: Llamada
- meeting: Reunión
- task: Tarea
- email: Email
- deadline: Fecha límite

El sistema ejecutará esta actualización automáticamente.`;
  }

  // ... resto de métodos
}
```

---

## Actualización del Componente de Chat

```typescript
// En coaching-insights.tsx o donde esté el chat

const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: CoachMessage = {
    role: "user",
    content: inputMessage,
    timestamp: new Date(),
  };

  setMessages([...messages, userMessage]);
  setInputMessage("");
  setIsLoading(true);

  try {
    const result = await CoachService.sendMessage(
      inputMessage,
      selectedDeal,
      messages
    );

    const assistantMessage: CoachMessage = {
      role: "assistant",
      content: result.response,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, assistantMessage]);

    // Si hubo una actualización de Pipedrive, mostrar confirmación
    if (result.pipedriveUpdate) {
      const { success, deal, error } = result.pipedriveUpdate;

      const systemMessage: CoachMessage = {
        role: "assistant",
        content: success
          ? `✅ Deal actualizado: ${deal?.title}`
          : `❌ Error actualizando deal: ${error}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, systemMessage]);

      // Refrescar datos del dashboard si fue exitoso
      if (success) {
        await refreshDashboardData();
      }
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error comunicándose con el coach");
  } finally {
    setIsLoading(false);
  }
};
```

---

## Casos de Uso Avanzados

### 1. Actualización Múltiple de Deals

```typescript
// El coach puede actualizar múltiples deals a la vez
const batchUpdate = async (deals: string[]) => {
  const results = await Promise.all(
    deals.map(dealName =>
      PipedriveUpdateService.updateDeal(dealName, {
        nota: "Deal revisado por el coach AI"
      })
    )
  );

  return results;
};
```

### 2. Validación Antes de Actualizar

```typescript
// Pedir confirmación al usuario antes de actualizar
if (requiresConfirmation(updateData)) {
  const confirmed = await showConfirmationDialog(
    `¿Deseas actualizar el deal ${updateData.deal}?`,
    updateData.updates
  );

  if (confirmed) {
    await PipedriveUpdateService.updateDeal(...);
  }
}
```

### 3. Logging de Actividad del Coach

```typescript
// Registrar todas las actualizaciones del coach
const logCoachActivity = async (
  dealName: string,
  action: string,
  result: any
) => {
  await fetch('/api/coach-activity-log', {
    method: 'POST',
    body: JSON.stringify({
      deal: dealName,
      action,
      result,
      timestamp: new Date()
    })
  });
};
```

---

## Testing

### Probar la Integración

```typescript
// Test manual
const testCoachUpdate = async () => {
  const response = await CoachService.sendMessage(
    "Cerré el deal con Datatechnic por $50,000",
    {
      company: "Datatechnic México",
      // ... otros campos del deal
    },
    []
  );

  console.log('Response:', response.response);
  console.log('Pipedrive Update:', response.pipedriveUpdate);
};
```

---

## Próximos Pasos

1. **Implementar el system prompt mejorado** en `coach-service.ts`
2. **Agregar detección de actualizaciones** en el método `sendMessage`
3. **Actualizar el componente del chat** para mostrar confirmaciones
4. **Probar con el deal de Datatechnic** (ID 958)
5. **Validar durante el demo con BLK**

---

## Mejoras Futuras

- **Confirmación del usuario** antes de actualizar deals críticos
- **Historial de cambios** realizados por el coach
- **Sugerencias proactivas** del coach basadas en el estado del deal
- **Análisis de patterns** para mejorar las recomendaciones
- **Integración con notificaciones** para alertar al equipo

---

## ¡Listo para el Demo! 🚀

Con esta integración, el Coach AI podrá:

✅ Actualizar deals automáticamente basándose en conversaciones
✅ Mantener Pipedrive sincronizado en tiempo real
✅ Reducir trabajo manual del equipo de ventas
✅ Proporcionar una experiencia fluida y natural

**¡El demo con BLK será impresionante!**
