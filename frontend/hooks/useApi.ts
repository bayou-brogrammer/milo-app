import { useState, useCallback } from 'react';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export function useApi<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async (options: ApiOptions = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    error,
    isLoading,
    fetchData,
  };
}