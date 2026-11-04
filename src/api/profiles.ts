import { authFetch } from '../lib/api';
import type { Venue } from './venues';

export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    venue?: Venue;
}

async function getProfileData<T>(path: string, accessToken: string, errorMessage: string): Promise<T> {
    const response = await authFetch(path, accessToken);
    if (!response.ok) {
        throw new Error(errorMessage);
    }
    const json = await response.json();
    return json.data as T;
}

export function getProfileBookings(name: string, accessToken: string) {
    return getProfileData<Booking[]>(
        `/profiles/${encodeURIComponent(name)}/bookings?_venue=true&sort=dateFrom&sortOrder=asc`,
        accessToken,
        'Failed to fetch bookings',
    );
}

export function getProfileVenues(name: string, accessToken: string) {
    return getProfileData<Venue[]>(
        `/profiles/${encodeURIComponent(name)}/venues`,
        accessToken,
        'Failed to fetch your venues',
    );
}
