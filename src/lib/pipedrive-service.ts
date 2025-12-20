// Pipedrive Service - Conecta frontend con datos reales de n8n webhook
export interface PipedriveResponse {
  sprint: {
    objetivo_imr_mes: number;
    imr_ganado_mes: number;
    pipeline_con_potencial_cierre: number;
    oportunidades_abiertas: number;
    deals_ganados_mes: number;
    velocity_dias: number;
    win_rate_porcentaje: number;
    deals_para_reactivar: PipedriveDeal[];
    deals_criticos: PipedriveDeal[];
    deals_con_momentum: PipedriveDeal[];
    proximos_cierres: PipedriveDeal[];
  };
  radar: {
    prospeccion: { total: number; deals: PipedriveDeal[] };
    discovery: { total: number; deals: PipedriveDeal[] };
    propuesta: { total: number; deals: PipedriveDeal[] };
    negociacion: { total: number; deals: PipedriveDeal[] };
    cierre: { total: number; deals: PipedriveDeal[] };
    pipeline_total_imr: number;
    total_deals: number;
  };
  fecha_actualizacion: string;
  embudo: string;
}

export interface PipedriveDeal {
  deal_id: number;
  deal_title: string;
  org_name: string;
  person_name: string;
  owner_name: string;
  value_imr: number;
  value_vtc: number;
  expected_close_date: string;
  status: string;
  stage_id: number;
  stage_order_nr: number;
  next_activity_subject: string | null;
  next_activity_date: string | null;
  estado: "rojo" | "verde" | "gris";
  estado_mensaje: string;
  cierra_en_7_dias: boolean;
  cierra_en_14_dias: boolean;
}

// URL del webhook de tu proyecto ProfitOps-Dev
const PIPEDRIVE_WEBHOOK_URL = "https://profitops.app.n8n.cloud/webhook/7fa1a7d3-c45b-4548-941e-1c16e397db0b";

export class PipedriveService {
  static async fetchPipelineData(): Promise<PipedriveResponse> {
    try {
      console.log('🔄 Fetching data from Pipedrive...');
      
      const response = await fetch(PIPEDRIVE_WEBHOOK_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PipedriveResponse = await response.json();
      
      console.log('✅ Pipeline data fetched successfully');
      return data;
    } catch (error) {
      console.error('❌ Error fetching pipeline data:', error);
      throw new Error('Failed to fetch pipeline data from Pipedrive');
    }
  }

static mapPipedriveDealToFrontend(pipedriveDeal: PipedriveDeal, index: number = 0) {    return {
      id: pipedriveDeal.deal_id.toString(),
      company: pipedriveDeal.org_name,
      contactName: pipedriveDeal.person_name || 'No contact',
      contactEmail: `${pipedriveDeal.person_name?.toLowerCase().replace(' ', '.')}@${pipedriveDeal.org_name.toLowerCase().replace(' ', '')}.com`,
      source: "pipedrive" as const,
      imrValue: pipedriveDeal.value_imr,
      tcvValue: pipedriveDeal.value_vtc,
      contractDurationMonths: 12,
      daysInStage: 0,
      nextActivity: pipedriveDeal.next_activity_subject || "",
      activityDate: pipedriveDeal.next_activity_date || "",
      expectedCloseDate: pipedriveDeal.expected_close_date,
      stage: "Prospección",
      isFavorite: pipedriveDeal.value_imr > 30000,
      sprintCategory: pipedriveDeal.estado === "rojo" ? "critico" as const : null,
      chatCategory: "manufactura" as const,
    };
  }
}