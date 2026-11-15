import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FavoritesStore = {
    favorites: string[];
    toggleFavorite: (venueId:string) => void;
    isFavorite: (venueId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            favorites: [],

            toggleFavorite:(venueId) =>
                set((state) => ({
                    favorites: state.favorites.includes(venueId)
                    ? state.favorites.filter((id) => id !== venueId)
                    : [...state.favorites, venueId],
                }))
            ,
            isFavorite: (venueId) => get().favorites.includes(venueId),
        }),
        {
            name: 'favorites-storage', // name of the item in storage
        }
    )
);