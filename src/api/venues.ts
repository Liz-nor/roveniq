import { BASE_URL } from '../lib/config';
import { authFetch } from '../lib/api';

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: { url: string; alt: string }[];
  price: number;
  maxGuests: number;
  rating: number;
  owner?: {
    name: string;
    email: string;
    bio: string | null;
    avatar: { url: string; alt: string } | null;
    banner: { url: string; alt: string } | null;
    venueManager: boolean;
  };
  bookings?: {
    id: string;
    dateFrom: string;
    dateTo: string;
  }[];
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
  const response = await fetch(`${BASE_URL}/venues`);

  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }
  const json = await response.json();
  return json.data;
}

export async function getVenue(id: string): Promise<Venue> {
  const response = await fetch(`${BASE_URL}/venues/${id}?_owner=true&_bookings=true`);

  if (!response.ok) {
    throw new Error('Failed to fetch venue');
  }
  const json = await response.json();
  return json.data;
}

export async function getVenueBookings(id: string): Promise<Venue> {
  const response = await fetch(
    `${BASE_URL}/venues/${encodeURIComponent(id)}?_bookings=true`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch venue bookings');
  }
  const json = await response.json();
  return json.data;
}
export async function createVenue(
  venue: Partial<Venue>,
  accessToken: string | null,
): Promise<Venue> {
  const response = await authFetch('/venues', accessToken, {
    method: 'POST',
    body: JSON.stringify(venue),
  });

  if (!response.ok) {
    throw new Error('Failed to create venue');
  }
  const json = await response.json();
  return json.data;
}

export async function updateVenue(
  id: string,
  venue: Partial<Venue>,
  accessToken: string | null,
): Promise<Venue> {
  const response = await authFetch(`/venues/${id}`, accessToken, {
    method: 'PUT',
    body: JSON.stringify(venue),
  });

  if (!response.ok) {
    throw new Error('Failed to update venue');
  }
  const json = await response.json();
  return json.data;
}

export async function deleteVenue(
  id: string,
  accessToken: string | null,
): Promise<void> {
  const response = await authFetch(`/venues/${id}`, accessToken, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete venue');
  }
}
