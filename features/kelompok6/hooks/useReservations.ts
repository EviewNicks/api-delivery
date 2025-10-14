'use client';

import { useState, useEffect } from 'react';
import { fetchReservations, ApiError } from '@/lib/api-client';
import type { HouseCafeReservationEnriched } from '@/lib/types';

interface UseReservationsResult {
  reservations: HouseCafeReservationEnriched[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] = useState<HouseCafeReservationEnriched[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReservations();
      setReservations(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak terduga');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    reservations,
    loading,
    error,
    refetch: fetchData
  };
}
