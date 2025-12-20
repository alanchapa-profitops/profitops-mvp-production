import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

export function formatIMRVTC(imr: number, vtc: number): string {
  return `${formatCurrency(imr)} IMR / ${formatCurrency(vtc)} TCV`
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return 'Sin fecha'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function formatTime(date: string | Date | number | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}
