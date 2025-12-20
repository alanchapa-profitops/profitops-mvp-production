'use client';

import { useState, useCallback } from 'react';
import { PipelineData } from '@/types';
import { N8N_WEBHOOK_URL } from '@/lib/constants';

export function usePipelineData() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(N8N_WEBHOOK_URL);
      const result = await response.json();

      if (result.metricas) {
        setData(result);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      setError('Error al cargar datos. Verifica la conexion.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    pipelineContext: data ? JSON.stringify(data, null, 2) : null,
  };
}
