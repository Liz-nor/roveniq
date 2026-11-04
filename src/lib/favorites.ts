import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// The Holidaze API has no favorites endpoint, so favorites are stored per browser in localStorage.
interface FavoritesState {
    venueIds: string[];
    isFavorite: (venueId: string) => boolean;
    toggleFavorite: (venueId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            venueIds: [],
            isFavorite: (venueId) => get().venueIds.includes(venueId),
            toggleFavorite: (venueId) =>
                set((state) => ({
                    venueIds: state.venueIds.includes(venueId)
                        ? state.venueIds.filter((id) => id !== venueId)
                        : [...state.venueIds, venueId],
                })),
        }),
        { name: 'roveniq-favorites', partialize: (state) => ({ venueIds: state.venueIds }) },
    ),
);
