import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { BookingCalendar } from '../../components/features/venues/BookingCalendar';
import { useParams, Link } from '@tanstack/react-router';
import {
  Star,
  MapPin,
  UsersRound,
  Wifi,
  PawPrint,
  Car,
  Utensils,
} from 'lucide-react';
import { getVenue, type Venue } from '../../api/venues';
import VenueGallery from '../../components/features/venues/VenueGallery';

export default function VenuePage() {
  const { venueId } = useParams({ strict: false }) as { venueId: string };
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<DateRange>();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getVenue(venueId)
      .then(setVenue)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [venueId]);

  const handleBooking = () => {
    if (!venue || !dates?.from || !dates?.to) return;
    // Booking logic here
  };

  if (isLoading) {
    return (
      <p className="container mx-auto px-4 py-12 text-neutral-700">
        Loading venue...
      </p>
    );
  }

  if (error || !venue) {
    return (
      <p className="container mx-auto px-4 py-12 text-red-600">
        {error ?? 'Venue not found'}
      </p>
    );
  }

  const location = [
    venue.location.address,
    venue.location.city,
    venue.location.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <VenueGallery images={venue.media} />
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-neutral-900">{venue.name}</h1>
          <div className="flex items-center gap-1">
            <Star size={20} className="text-[#FFD700] fill-current" />
            <span className="text-neutral-700">{venue.rating}/5</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={20} className="text-accent" />
          <p className="text-neutral-700">
            {location || 'Location not specified'}
          </p>
        </div>
        <p className="text-neutral-700 mb-6">{venue.description}</p>
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <UsersRound size={20} className="text-accent" />
            <p className="text-neutral-700">Guests {venue.maxGuests}</p>
          </div>
          {venue.meta.wifi && (
            <div className="flex items-center gap-2">
              <Wifi size={20} className="text-accent" />
              <span className="text-neutral-700">Wifi</span>
            </div>
          )}
          {venue.meta.pets && (
            <div className="flex items-center gap-2">
              <PawPrint size={20} className="text-accent" />
              <span className="text-neutral-700">Pets allowed</span>
            </div>
          )}
          {venue.meta.breakfast && (
            <div className="flex items-center gap-2">
              <Utensils size={20} className="text-accent" />
              <span className="text-neutral-700">Breakfast</span>
            </div>
          )}
          {venue.meta.parking && (
            <div className="flex items-center gap-2">
              <Car size={20} className="text-accent" />
              <span className="text-neutral-700">Parking</span>
            </div>
          )}
        </div>
        <div className="my-8 rounded-xl border border-neutral-200 p-6">
          <h2 className="mb-2 text-xl font-semibold text-neutral-900">
            Select your dates
          </h2>

          <p className="mb-4 text-sm text-neutral-600">
            Choose your check-in and check-out dates.
          </p>

          <BookingCalendar
            bookings={venue.bookings ?? []}
            onDatesChange={setDates}
          />
        </div>

        {venue.owner && (
          <div className="my-8 rounded-xl border border-neutral-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-neutral-900">
              About the host
            </h2>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {venue.owner.avatar && (
                  <img
                    src={venue.owner.avatar.url}
                    alt={venue.owner.avatar.alt || venue.owner.name}
                    className="size-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-neutral-900">
                    {venue.owner.name}
                  </p>
                  {venue.owner.bio && (
                    <p className="text-sm text-neutral-600">{venue.owner.bio}</p>
                  )}
                </div>
              </div>
              <Link
                to="/profiles/$profileName"
                params={{ profileName: venue.owner.name }}
                className="buttonSecondary whitespace-nowrap"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold text-neutral-900">
            ${venue.price} / night
          </p>
          <button
            disabled={!dates?.from || !dates?.to}
            onClick={handleBooking}
            className="buttonPrimary"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}
