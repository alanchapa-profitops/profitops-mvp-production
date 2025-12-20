'use client';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function RefreshButton({ onClick, isLoading }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-secondary)] text-xs cursor-pointer flex items-center gap-[6px] transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={isLoading ? 'animate-spin-custom' : ''}
      >
        <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
      Actualizar
    </button>
  );
}
