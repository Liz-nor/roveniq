import { authFetch } from '../lib/api';
import type { Venue } from './venues';

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: Venue;
}

export interface PublicProfile {
  name: string;
  email?: string;
  bio: string | null;
  avatar: { url: string; alt: string } | null;
  banner: { url: string; alt: string } | null;
  venueManager: boolean;
}

export interface PublicProfileWithVenues extends PublicProfile {
  venues?: Venue[];
}

async function getProfileData<T>(
  path: string,
  accessToken: string | null,
  errorMessage: string,
): Promise<T> {
  const response = await authFetch(path, accessToken);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const json = await response.json();
  return json.data as T;
}

// The Noroff API requires a token and API key even for viewing other profiles.
export function getPublicProfile(name: string, accessToken: string | null) {
  return getProfileData<PublicProfile>(
    `/profiles/${encodeURIComponent(name)}`,
    accessToken,
    'Profile not found',
  );
}

export function getPublicProfileVenues(
  name: string,
  accessToken: string | null,
) {
  return getProfileData<Venue[]>(
    `/profiles/${encodeURIComponent(name)}/venues`,
    accessToken,
    'Could not fetch profile venues',
  );
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

export interface ProfileMedia {
  url: string;
  alt?: string;
}

export interface ProfileUpdate {
  bio?: string;
  avatar?: ProfileMedia;
  banner?: ProfileMedia;
}

export interface UpdatedProfile {
  name: string;
  email: string;
  bio: string | null;
  avatar: { url: string; alt: string } | null;
  banner: { url: string; alt: string } | null;
  venueManager: boolean;
}

// Name and email cannot be changed through the Noroff API; only bio, avatar,
// banner and venueManager are accepted.
export async function updateProfile(
  name: string,
  accessToken: string,
  update: ProfileUpdate,
): Promise<UpdatedProfile> {
  const response = await authFetch(
    `/profiles/${encodeURIComponent(name)}`,
    accessToken,
    {
      method: 'PUT',
      body: JSON.stringify(update),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.errors?.[0]?.message || 'Failed to update profile');
  }

  const json = await response.json();
  return json.data as UpdatedProfile;
}

export async function becomeVenueManager(
  name: string,
  accessToken: string,
): Promise<boolean> {
  const response = await authFetch(
    `/profiles/${encodeURIComponent(name)}`,
    accessToken,
    {
      method: 'PUT',
      body: JSON.stringify({
        venueManager: true,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.errors?.[0]?.message || 'Failed to become venue manager',
    );
  }

  const json = await response.json();

  return json.data.venueManager;
}
