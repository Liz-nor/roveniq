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