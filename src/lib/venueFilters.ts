import type { Venue } from '../api/venues';

export interface SearchFilters {
    query: string;
    guests: number;
}

export const emptyFilters: SearchFilters = { query: '', guests: 0 };

export function hasActiveFilters(filters: SearchFilters) {
    return filters.query.trim() !== '' || filters.guests > 0;
}

// Matches the query against name, description and location, and keeps venues big enough for the guest count.
export function filterVenues(venues: Venue[], filters: SearchFilters) {
    const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean);

    return venues.filter((venue) => {
        if (filters.guests > 0 && venue.maxGuests < filters.guests) {
            return false;
        }

        const searchable = [
            venue.name,
            venue.description,
            venue.location.city,
            venue.location.country,
            venue.location.continent,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return words.every((word) => searchable.includes(word));
    });
}
