'use client';

interface SectionTitleProps {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionTitle({ children, action }: SectionTitleProps) {
  return (
    <div className="text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-[15px] flex items-center gap-2">
      <span className="w-1 h-4 bg-[var(--accent-gradient)] rounded-sm" />
      {children}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
