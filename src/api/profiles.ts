import { BASE_URL } from '../lib/config';

export async function getProfiles() {
    const response = await fetch(
        `${BASE_URL}/profiles`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch profiles');
    }
    return response.json();
}