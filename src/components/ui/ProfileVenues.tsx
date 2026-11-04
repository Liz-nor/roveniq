import { getProfileVenues } from '../../api/profiles';
import { useProfileData } from '../../lib/useProfileData';
import { VenueCard } from '../features/home/Venues';

export function ProfileVenues() {
    const { items: venues, isLoading, error } = useProfileData(getProfileVenues);

    if (isLoading) return <p className="text-neutral-700">Loading your venues...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (venues.length === 0) return <p className="text-neutral-700">You haven't listed any venues yet.</p>;

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
            ))}
        </div>
    );
}
