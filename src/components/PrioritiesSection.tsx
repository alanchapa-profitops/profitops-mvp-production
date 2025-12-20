'use client';

import { Deal } from '@/types';
import { formatIMRVTC, formatDate } from '@/lib/utils';

interface PrioritiesSectionProps {
  deals: Deal[];
  isLoading: boolean;
}

export function PrioritiesSection({ deals, isLoading }: PrioritiesSectionProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
      {isLoading ? (
        <EmptyState icon="target" message="Cargando proximos cierres..." />
      ) : deals.length === 0 ? (
        <EmptyState icon="calendar" message="No hay cierres programados en los proximos 14 dias" />
      ) : (
        deals.map((deal, idx) => <PriorityItem key={idx} deal={deal} rank={idx + 1} />)
      )}
    </div>
  );
}

function PriorityItem({ deal, rank }: { deal: Deal; rank: number }) {
  const fechaCierre = formatDate(deal.expected_close_date);
  const estado = deal.estado || 'gris';

  let indicador = '';
  if (estado === 'rojo') indicador = '!';
  else if (estado === 'verde') indicador = 'OK';
  else indicador = '-';

  const activityDateStr = formatDate(deal.next_activity_date);
  const activityInfo = deal.next_activity_subject
    ? `${deal.next_activity_subject} - ${activityDateStr}`
    : deal.estado_mensaje;

  return (
    <div className="flex items-center gap-[15px] p-[15px] bg-[var(--bg-secondary)] rounded-[10px] mb-[10px] transition-all duration-200 hover:bg-[var(--bg-hover)] hover:translate-x-[5px]">
      <div className="w-[30px] h-[30px] bg-[var(--accent-gradient)] rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
        {rank}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm mb-[2px]">
          <span className="mr-1">{indicador === '!' ? '!' : indicador === 'OK' ? 'OK' : '-'}</span>
          {deal.deal_title}
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          {deal.org_name} - Cierre: {fechaCierre}
        </div>
        <div className="text-xs text-[var(--text-secondary)]">{activityInfo}</div>
      </div>
      <div className="font-mono text-sm font-semibold text-[var(--accent-cyan)]">
        {formatIMRVTC(deal.value_imr || 0, deal.value_vtc || 0)}
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-10 text-[var(--text-muted)]">
      <div className="text-5xl mb-[15px] opacity-50">
        {icon === 'target' ? '...' : 'Cal'}
      </div>
      <p>{message}</p>
    </div>
  );
}
