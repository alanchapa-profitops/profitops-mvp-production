// Pipedrive Update Service - Actualiza deals en Pipedrive vía n8n webhook

/**
 * Interface para las actualizaciones de un deal
 */
export interface DealUpdates {
  mrr?: number;
  stage_id?: number; // 1-6 (se mapea automáticamente a IDs de Pipedrive)
  probabilidad?: number; // 0-100
  fecha_cierre?: string; // Formato: YYYY-MM-DD
  nota?: string;
}

/**
 * Interface para crear una actividad
 */
export interface DealActivity {
  titulo: string;
  tipo: 'call' | 'meeting' | 'task' | 'deadline' | 'email' | 'lunch';
  fecha: string; // Formato: YYYY-MM-DD
}

/**
 * Request completo para actualizar un deal
 */
export interface UpdateDealRequest {
  deal: string; // Nombre exacto del deal en Pipedrive
  updates?: DealUpdates;
  actividad?: DealActivity;
  completar_actividad?: boolean;
}

/**
 * Respuesta del webhook de actualización
 */
export interface UpdateDealResponse {
  success: boolean;
  message: string;
  deal?: {
    id: number;
    title: string;
    actualizaciones_aplicadas: {
      mrr: boolean;
      etapa: boolean;
      probabilidad: boolean;
      fecha_cierre: boolean;
      nota_agregada: boolean;
      actividad_creada: boolean;
      actividades_completadas: boolean;
    };
  };
  error?: string;
  timestamp: string;
}

// URL del webhook de actualización de Pipedrive
const UPDATE_WEBHOOK_URL = "https://profitops.app.n8n.cloud/webhook/7f477b94-4cb6-4f41-938a-5e987e7f1254";

/**
 * Servicio para actualizar deals en Pipedrive
 */
export class PipedriveUpdateService {
  /**
   * Actualiza un deal en Pipedrive
   *
   * @param dealName - Nombre exacto del deal en Pipedrive
   * @param updates - Campos a actualizar
   * @param activity - Actividad a crear (opcional)
   * @param completeActivities - Si debe completar actividades pendientes
   * @returns Respuesta del servidor
   *
   * @example
   * ```typescript
   * // Actualizar solo el MRR
   * await PipedriveUpdateService.updateDeal("Datatechnic México", { mrr: 40000 });
   *
   * // Cambiar etapa y agregar nota
   * await PipedriveUpdateService.updateDeal("Datatechnic México", {
   *   stage_id: 4,
   *   nota: "Demo exitoso"
   * });
   *
   * // Actualización completa con actividad
   * await PipedriveUpdateService.updateDeal(
   *   "Datatechnic México",
   *   {
   *     mrr: 45000,
   *     stage_id: 4,
   *     probabilidad: 75,
   *     fecha_cierre: "2025-02-15",
   *     nota: "Negociación avanzada"
   *   },
   *   {
   *     titulo: "Seguimiento",
   *     tipo: "call",
   *     fecha: "2025-01-15"
   *   },
   *   true
   * );
   * ```
   */
  static async updateDeal(
    dealName: string,
    updates?: DealUpdates,
    activity?: DealActivity,
    completeActivities: boolean = false
  ): Promise<UpdateDealResponse> {
    try {
      console.log(`🔄 Actualizando deal "${dealName}" en Pipedrive...`);

      const requestBody: UpdateDealRequest = {
        deal: dealName,
        updates,
        actividad: activity,
        completar_actividad: completeActivities
      };

      const response = await fetch(UPDATE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UpdateDealResponse = await response.json();

      if (data.success) {
        console.log('✅ Deal actualizado exitosamente:', data.deal?.title);
        console.log('📊 Actualizaciones aplicadas:', data.deal?.actualizaciones_aplicadas);
      } else {
        console.error('❌ Error en la actualización:', data.error);
      }

      return data;
    } catch (error) {
      console.error('❌ Error comunicándose con el webhook:', error);
      throw new Error('Failed to update deal in Pipedrive');
    }
  }

  /**
   * Actualiza solo el valor (MRR) de un deal
   */
  static async updateMRR(dealName: string, mrr: number): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, { mrr });
  }

  /**
   * Cambia la etapa de un deal
   *
   * @param dealName - Nombre del deal
   * @param stageId - Etapa (1=Prospección, 2=Discovery, 3=Propuesta, 4=Negociación, 5=Cierre, 6=Ganado/Perdido)
   */
  static async updateStage(dealName: string, stageId: number): Promise<UpdateDealResponse> {
    if (stageId < 1 || stageId > 6) {
      throw new Error('Stage ID debe estar entre 1 y 6');
    }
    return this.updateDeal(dealName, { stage_id: stageId });
  }

  /**
   * Agrega una nota a un deal
   */
  static async addNote(dealName: string, nota: string): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, { nota });
  }

  /**
   * Actualiza la probabilidad de cierre
   *
   * @param dealName - Nombre del deal
   * @param probabilidad - Probabilidad de 0 a 100
   */
  static async updateProbability(dealName: string, probabilidad: number): Promise<UpdateDealResponse> {
    if (probabilidad < 0 || probabilidad > 100) {
      throw new Error('Probabilidad debe estar entre 0 y 100');
    }
    return this.updateDeal(dealName, { probabilidad });
  }

  /**
   * Actualiza la fecha de cierre esperada
   *
   * @param dealName - Nombre del deal
   * @param fecha - Fecha en formato YYYY-MM-DD
   */
  static async updateCloseDate(dealName: string, fecha: string): Promise<UpdateDealResponse> {
    // Validar formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new Error('Fecha debe estar en formato YYYY-MM-DD');
    }
    return this.updateDeal(dealName, { fecha_cierre: fecha });
  }

  /**
   * Crea una actividad de seguimiento
   */
  static async createActivity(
    dealName: string,
    activity: DealActivity
  ): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, undefined, activity);
  }

  /**
   * Completa todas las actividades pendientes de un deal
   */
  static async completeAllActivities(dealName: string): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, undefined, undefined, true);
  }

  /**
   * Mueve un deal a la siguiente etapa
   */
  static async moveToNextStage(dealName: string, currentStage: number): Promise<UpdateDealResponse> {
    const nextStage = Math.min(currentStage + 1, 6);
    return this.updateStage(dealName, nextStage);
  }

  /**
   * Marca un deal como ganado
   */
  static async markAsWon(dealName: string, mrr: number): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, {
      stage_id: 6,
      probabilidad: 100,
      mrr,
      nota: "Deal cerrado - Ganado"
    });
  }

  /**
   * Marca un deal como perdido
   */
  static async markAsLost(dealName: string, razon?: string): Promise<UpdateDealResponse> {
    return this.updateDeal(dealName, {
      stage_id: 6,
      probabilidad: 0,
      nota: razon ? `Deal cerrado - Perdido. Razón: ${razon}` : "Deal cerrado - Perdido"
    });
  }

  /**
   * Helper: Valida el nombre del deal
   */
  private static validateDealName(dealName: string): boolean {
    return dealName && dealName.trim().length > 0;
  }

  /**
   * Helper: Mapeo de etapas a nombres
   */
  static getStageName(stageId: number): string {
    const stages: { [key: number]: string } = {
      1: "Prospección",
      2: "Discovery",
      3: "Propuesta",
      4: "Negociación",
      5: "Cierre",
      6: "Ganado/Perdido"
    };
    return stages[stageId] || "Desconocida";
  }
}

/**
 * Ejemplos de uso:
 *
 * // Actualizar solo el MRR
 * await PipedriveUpdateService.updateMRR("Datatechnic México", 40000);
 *
 * // Cambiar a etapa de Negociación
 * await PipedriveUpdateService.updateStage("Datatechnic México", 4);
 *
 * // Agregar una nota
 * await PipedriveUpdateService.addNote("Datatechnic México", "Cliente muy interesado");
 *
 * // Crear actividad de seguimiento
 * await PipedriveUpdateService.createActivity("Datatechnic México", {
 *   titulo: "Llamada de seguimiento",
 *   tipo: "call",
 *   fecha: "2025-01-15"
 * });
 *
 * // Actualización completa
 * await PipedriveUpdateService.updateDeal(
 *   "Datatechnic México",
 *   {
 *     mrr: 45000,
 *     stage_id: 4,
 *     probabilidad: 75,
 *     fecha_cierre: "2025-02-15",
 *     nota: "Negociación avanzada"
 *   },
 *   {
 *     titulo: "Reunión de cierre",
 *     tipo: "meeting",
 *     fecha: "2025-02-01"
 *   }
 * );
 *
 * // Marcar como ganado
 * await PipedriveUpdateService.markAsWon("Datatechnic México", 50000);
 */
