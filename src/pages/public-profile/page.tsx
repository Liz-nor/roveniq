import { useEffect, useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { getPublicProfile, getPublicProfileVenues } from '../../api/profiles';
import type { PublicProfile } from '../../api/profiles';
import type { Venue } from '../../api/venues';
import { VenueCard } from '../../components/features/home/Venues';
import { useAuthStore } from '../../lib/authStore';

export default function PublicProfilePage() {
  const { profileName } = useParams({ strict: false }) as {
    profileName: string;
  };
  const accessToken = useAuthStore((state) => state.accessToken);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        setError(null);

        const profileData = await getPublicProfile(profileName, accessToken);
        setProfile(profileData);

        if (profileData.venueManager) {
          const venuesData = await getPublicProfileVenues(
            profileName,
            accessToken,
          );
          setVenues(venuesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [profileName, accessToken]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-neutral-700">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-600">{error ?? 'Profile not found'}</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-start gap-4">
          {profile.avatar && (
            <img
              src={profile.avatar.url}
              alt={profile.avatar.alt || profile.name}
              className="size-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              {profile.name}
            </h1>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-900">
                {profile.venueManager ? 'Venue Manager' : 'Guest'}
              </span>
            </div>
            {profile.bio && <p className="text-neutral-700">{profile.bio}</p>}
          </div>
        </div>
      </div>

      {profile.venueManager && venues.length > 0 && (
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">
            Venues by {profile.name}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </section>
      )}

      {profile.venueManager && venues.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-neutral-700">
            Hmm, it seems this venue manager has not listed anything yet.
          </p>
        </div>
      )}
    </main>
  );
}
