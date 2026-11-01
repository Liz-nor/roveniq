import { BASE_URL } from '../lib/config';

export async function getBookings() {
    const response = await fetch(
        `${BASE_URL}/bookings`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    return response.json();
}