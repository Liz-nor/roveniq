import { BASE_URL } from '../lib/config';
import { authFetch } from '../lib/api';

export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created: string;
    updated: string;
}

export interface BookingInput {
    dateFrom: string;
    dateTo: string;
    guests: number;
    venueId: string;
}

export async function getBookings() {
    const response = await fetch(
        `${BASE_URL}/bookings`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    return response.json();
}

export async function createBooking(
    booking: BookingInput,
    accessToken: string | null,
): Promise<Booking> {
    const response = await authFetch('/bookings', accessToken, {
        method: 'POST',
        body: JSON.stringify(booking),
    });

    if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.errors?.[0]?.message ?? 'Failed to create booking');
    }
    const json = await response.json();
    return json.data;
}
