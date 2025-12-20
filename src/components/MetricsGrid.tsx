'use client';

import { Metricas } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface MetricsGridProps {
  metricas: Metricas | null;
}

export function MetricsGrid({ metricas }: MetricsGridProps) {
  const objetivo = metricas?.objetivo_imr || 0;
  const ganado = metricas?.ganado_imr_mes || 0;
  const mes = metricas?.mes_objetivo || 'Mes';

  return (
    <div className="grid grid-cols-4 gap-[15px] mb-[25px] max-[1200px]:grid-cols-2">
      <MetricCard
        label="Pipeline Generado (IMR)"
        value={metricas ? formatCurrency(metricas.pipeline_generado_imr) : '--'}
      />
      <MetricCard
        label="Deals Abiertos"
        value={metricas?.deals_abiertos?.toString() ?? '--'}
      />
      <MetricCard
        label="Cierres Esta Semana"
        value={metricas?.cierres_esta_semana?.toString() ?? '--'}
      />
      <MetricCard
        label={`Objetivo ${mes} (IMR)`}
        value={metricas ? `${formatCurrency(ganado)} / ${formatCurrency(objetivo)}` : '--'}
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-[18px] transition-all duration-300 hover:border-[var(--accent-cyan)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5">
      <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
        {label}
      </div>
      <div className="text-[26px] font-bold gradient-text">{value}</div>
    </div>
  );
}
