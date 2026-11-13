import { getVenues, type Venue } from '../../../api/venues';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Star } from 'lucide-react';

export default function ShowcaseVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const topRatedVenues = [...venues]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch top rated venues on component mount
  useEffect(() => {
    async function fetchVenues() {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch {
        setError('Could not load venues.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchVenues();
  }, []);

  if (isLoading) {
    return <p>Loading venues...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-2xl font-bold text-neutral-900">
        Top Rated Venues
      </h2>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topRatedVenues.map((venue) => {
          const image = venue.media[0];

          return (
            <li
              key={venue.id}
              className="rounded-lg bg-white shadow hover:translate-y-1 hover:transition-transform"
            >
              <Link
                to="/venues/$venueId"
                params={{ venueId: venue.id }}
                className="flex items-center gap-3 p-3"
              >
                <img
                  src={image?.url ?? '/images/roveniq-no-media-green-blue.webp'}
                  alt={image?.alt || venue.name}
                  className="size-16 shrink-0 rounded object-cover"
                />
                <span className="min-w-0 flex-1 truncate font-semibold text-neutral-900">
                  {venue.name}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm text-neutral-700">
                  <Star
                    size={16}
                    className="fill-current text-[#FFD700]"
                    aria-hidden="true"
                  />
                  {venue.rating}/5
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
