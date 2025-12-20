export interface Deal {
  deal_title: string;
  org_name: string;
  person_name?: string;
  value_imr?: number;
  value_vtc?: number;
  expected_close_date?: string;
  next_activity_date?: string;
  next_activity_subject?: string;
  estado?: string;
  estado_mensaje?: string;
}

export interface Metricas {
  pipeline_generado_imr: number;
  deals_abiertos: number;
  cierres_esta_semana: number;
  objetivo_imr: number;
  ganado_imr_mes: number;
  mes_objetivo: string;
}

export interface PipelineData {
  metricas: Metricas;
  accion_inmediata: Deal[];
  proximos_cierres: Deal[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AttachedFile {
  name: string;
  content: string;
  type: 'text' | 'image';
}
