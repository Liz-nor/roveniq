import { useEffect, useState } from 'react';
import { useAuthStore } from '../lib/authStore';

export function useProfileData<T>(
  fetcher: (name: string, accessToken: string) => Promise<T[]>
) {
  const name = useAuthStore((state) => state.user?.name);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!name || !accessToken) {
      setItems([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setItems([]);

    fetcher(name, accessToken)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, name, accessToken]);

  return { items, isLoading, error };
}