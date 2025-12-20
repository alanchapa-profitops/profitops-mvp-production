'use client';

import { Deal } from '@/types';
import { formatIMRVTC, formatDate } from '@/lib/utils';

interface AlertsSectionProps {
  deals: Deal[];
  isLoading: boolean;
}

export function AlertsSection({ deals, isLoading }: AlertsSectionProps) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 mb-[25px]">
      <div className="flex justify-between items-center mb-[15px]">
        <span className="text-base font-semibold">Deals que Requieren Atencion</span>
        <span className="bg-[var(--alert-red)] text-white text-xs font-semibold px-[10px] py-1 rounded-[20px]">
          {deals.length}
        </span>
      </div>
      <div>
        {isLoading ? (
          <EmptyState icon="..." message="Cargando alertas del pipeline..." />
        ) : deals.length === 0 ? (
          <EmptyState icon="checkmark" message="No hay deals que requieran accion inmediata!" />
        ) : (
          deals.map((deal, idx) => <AlertItem key={idx} deal={deal} />)
        )}
      </div>
    </div>
  );
}

function AlertItem({ deal }: { deal: Deal }) {
  const estado = deal.estado || 'gris';
  let alertIcon = '';
  let alertClass = 'neutral';

  if (estado === 'rojo') {
    alertIcon = 'red';
    alertClass = 'critical';
  } else if (estado === 'verde') {
    alertIcon = 'green';
    alertClass = 'success';
  } else {
    alertIcon = 'gray';
    alertClass = 'neutral';
  }

  const activityDateStr = formatDate(deal.next_activity_date);
  const activityDisplay = deal.next_activity_subject
    ? `${deal.next_activity_subject} - ${activityDateStr}`
    : deal.estado_mensaje;

  const closeDateStr = formatDate(deal.expected_close_date);

  const borderColors: Record<string, string> = {
    critical: 'border-l-[var(--alert-red)]',
    success: 'border-l-[var(--alert-green)]',
    neutral: 'border-l-[var(--text-muted)]',
  };

  const iconBgs: Record<string, string> = {
    critical: 'bg-[rgba(239,68,68,0.2)] text-[var(--alert-red)]',
    success: 'bg-[rgba(16,185,129,0.2)] text-[var(--alert-green)]',
    neutral: 'bg-[rgba(148,163,184,0.2)] text-[var(--text-muted)]',
  };

  const icons: Record<string, string> = {
    red: '!',
    green: 'check',
    gray: '-',
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg mb-[10px] border-l-[3px] ${borderColors[alertClass]} transition-all duration-200 hover:bg-[var(--bg-hover)]`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${iconBgs[alertClass]}`}
      >
        {alertIcon === 'red' && '!'}
        {alertIcon === 'green' && <span className="text-xs">OK</span>}
        {alertIcon === 'gray' && '-'}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm mb-[3px]">{deal.deal_title}</div>
        <div className="text-xs text-[var(--text-secondary)]">
          {deal.org_name} - {deal.person_name || 'Sin contacto'}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{activityDisplay}</div>
        <div className="text-[11px] text-[var(--text-muted)] mt-[3px] italic">
          {deal.estado_mensaje}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="font-mono text-[13px] font-semibold text-[var(--accent-cyan)] text-right">
          {formatIMRVTC(deal.value_imr || 0, deal.value_vtc || 0)}
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">Cierre: {closeDateStr}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-10 text-[var(--text-muted)]">
      <div className="text-5xl mb-[15px] opacity-50">
        {icon === 'checkmark' ? '✓' : '...'}
      </div>
      <p>{message}</p>
    </div>
  );
}
