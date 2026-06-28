import { useEffect, useState } from 'react';
import api from '../../../services/api';

interface PortalDataState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export function usePortalData<T>(endpoint: string): PortalDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError('');

    api.get(endpoint)
      .then((response) => {
        if (mounted) setData(response.data);
      })
      .catch(() => {
        if (mounted) setError('Unable to load portal data right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [endpoint]);

  return { data, loading, error };
}
