import { useEffect, useState } from 'react';
import { getVenue, type Venue } from '../../api/venues';
import { useFavoritesStore } from '../../store/favoritesStore';
import { VenueCard } from '../features/home/Venues';

export default function ProfileFavorites() {
  const favoriteIds = useFavoritesStore((state) => state.favorites);
  // Venues fetched so far, and ids that failed to load (e.g. deleted venues)
  const [venues, setVenues] = useState<Venue[]>([]);
  const [failedIds, setFailedIds] = useState<string[]>([]);

  const pendingIds = favoriteIds.filter(
    (id) => !venues.some((venue) => venue.id === id) && !failedIds.includes(id),
  );
  const pendingKey = pendingIds.join(',');

  useEffect(() => {
    if (!pendingKey) return;
    let cancelled = false;
    const ids = pendingKey.split(',');

    Promise.allSettled(ids.map((id) => getVenue(id))).then((results) => {
      if (cancelled) return;
      const loaded: Venue[] = [];
      const failed: string[] = [];
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') loaded.push(result.value);
        else failed.push(ids[i]);
      });
      setVenues((prev) => [...prev, ...loaded]);
      setFailedIds((prev) => [...prev, ...failed]);
    });

    return () => {
      cancelled = true;
    };
  }, [pendingKey]);

  // Un-favouriting a card removes it right away
  const visible = venues.filter((venue) => favoriteIds.includes(venue.id));

  if (pendingIds.length > 0 && visible.length === 0)
    return <p className="text-neutral-700">Loading favourites...</p>;
  if (visible.length === 0)
    return (
      <p className="text-neutral-700">
        You haven't saved any favourites yet. Tap the heart on a venue to save
        it.
      </p>
    );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {visible.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
