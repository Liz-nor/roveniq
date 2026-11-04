import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Media {
    url: string;
    alt: string;
}

export interface AuthUser {
    name: string;
    email: string;
    bio?: string | null;
    avatar?: Media | null;
    banner?: Media | null;
    venueManager?: boolean;
}

interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    setAuth: (user: AuthUser, accessToken: string) => void;
    logout: () => void;
}

// Persisted to localStorage so the user stays logged in across reloads.
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            setAuth: (user, accessToken) => set({ user, accessToken }),
            logout: () => set({ user: null, accessToken: null }),
        }),
        { name: 'roveniq-auth' },
    ),
);
