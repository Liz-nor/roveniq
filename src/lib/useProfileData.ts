import { useEffect, useState } from 'react';
import { useAuthStore } from './authStore';

// Fetches data for the logged-in user and tracks loading/error state.
export function useProfileData<T>(fetcher: (name: string, accessToken: string) => Promise<T[]>) {
    const name = useAuthStore((state) => state.user?.name);
    const accessToken = useAuthStore((state) => state.accessToken);
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!name || !accessToken) return;
        let cancelled = false;
        fetcher(name, accessToken)
            .then((data) => !cancelled && setItems(data))
            .catch((err: Error) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setIsLoading(false));
        return () => {
            cancelled = true;
        };
    }, [fetcher, name, accessToken]);

    return { items, isLoading, error };
}
