import { BASE_URL } from '../lib/config';

export interface Venue {
    id: string;
    name: string;
    description: string;
    media: { url: string; alt: string }[];
    price: number;
    maxGuests: number;
    rating: number;
    meta: {
        wifi: boolean;
        parking: boolean;
        breakfast: boolean;
        pets: boolean;
    };
    location: {
        address: string | null;
        city: string | null;
        zip: string | null;
        country: string | null;
        continent: string | null;
        lat: number;
        lng: number;
    };
}

export async function getVenues(): Promise<Venue[]> {
    const response = await fetch(
        `${BASE_URL}/venues`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch venues');
    }
    const json = await response.json();
    return json.data;
}

export async function getVenue(id: string): Promise<Venue> {
    const response = await fetch(
        `${BASE_URL}/venues/${id}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch venue');
    }
    const json = await response.json();
    return json.data;
}

export async function createVenue(venue: Partial<Venue>): Promise<Venue> {
    const response = await fetch(
        `${BASE_URL}/venues`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venue)
        }
    );

    if (!response.ok) {
        throw new Error('Failed to create venue');
    }
    const json = await response.json();
    return json.data;
}

export async function updateVenue(id: string, venue: Partial<Venue>): Promise<Venue> {
    const response = await fetch(
        `${BASE_URL}/venues/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venue)
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update venue');
    }
    const json = await response.json();
    return json.data;
}

export async function deleteVenue(id: string): Promise<void> {
    const response = await fetch(
        `${BASE_URL}/venues/${id}`,
        {
            method: 'DELETE'
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete venue');
    }
}

