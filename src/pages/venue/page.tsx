import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
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
import { BookingCalendar } from '../../components/features/venues/BookingCalendar';
import { createBooking } from '../../api/bookings';
import { useAuthStore } from '../../lib/authStore';
import { AuthError } from '../../lib/api';
import { isVenueAvailable } from '../../lib/bookingDates';
import { differenceInCalendarDays } from 'date-fns';

export default function VenuePage() {
  const { venueId } = useParams({ strict: false }) as { venueId: string };
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<DateRange>();
  const nights =
    dates?.from && dates?.to
      ? differenceInCalendarDays(dates.to, dates.from)
      : 0;
  const totalPrice = nights * (venue?.price ?? 0);
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getVenue(venueId)
      .then(setVenue)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [venueId]);

  const handleBooking = async () => {
    if (!venue || !dates?.from || !dates?.to) return;

    if (!accessToken) {
      toast.error('You need to log in to book a stay.');
      navigate({ to: '/login' });
      return;
    }

    const dateFrom = format(dates.from, 'yyyy-MM-dd');
    const dateTo = format(dates.to, 'yyyy-MM-dd');

    // Check if the selected dates overlap with existing bookings
    const bookings = (venue.bookings ?? []).map((b) => ({
      dateFrom: b.dateFrom.slice(0, 10),
      dateTo: b.dateTo.slice(0, 10),
    }));
    if (!isVenueAvailable(bookings, dateFrom, dateTo)) {
      toast.error('Some of those dates are already booked.');
      return;
    }

    setIsBooking(true);
    try {
      await createBooking(
        { venueId: venue.id, dateFrom, dateTo, guests },
        accessToken,
      );
      toast.success(`Booked ${venue.name} from ${dateFrom} to ${dateTo}!`);
      setDates(undefined);
      setGuests(1);
      // Reload so the new booking shows as unavailable
      setVenue(await getVenue(venue.id));
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
        navigate({ to: '/login' });
      } else {
        toast.error('Could not complete your booking', {
          description: err instanceof Error ? err.message : undefined,
        });
      }
    } finally {
      setIsBooking(false);
    }
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
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-neutral-900">
              {venue.name}
            </h1>
            <p className="text-2xl font-semibold text-neutral-900">
              ${venue.price}
              <span className="text-sm font-normal text-stone-600">
                {' '}
                / night
              </span>
            </p>
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
          <aside
            aria-label="Book this venue"
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start"
          >
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                Select your dates
              </h2>

              <p className="mb-4 text-sm text-neutral-600">
                Choose your check-in and check-out dates.
              </p>
              <BookingCalendar
                bookings={venue.bookings ?? []}
                selected={dates}
                onSelect={setDates}
              />

              <label className="mt-4 flex items-center gap-2 text-neutral-700">
                Guests
                <input
                  type="number"
                  min={1}
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) =>
                    setGuests(
                      Math.min(
                        venue.maxGuests,
                        Math.max(1, Number(e.target.value) || 1),
                      ),
                    )
                  }
                  className="w-20 rounded-md border px-3 py-2"
                />
                <span className="text-sm text-neutral-500">
                  (max {venue.maxGuests})
                </span>
              </label>
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold text-neutral-900">
                  {/* Display total price if nights are selected */}
                  {nights > 0 && (
                    <div className="mt-4 flex flex-col gap-1 border-t border-stone-200 pt-4">
                      <span className="text-sm font-normal text-stone-600">
                        ${venue.price} * {nights}{' '}
                        {nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span>Total: ${totalPrice}</span>
                    </div>
                  )}
                </div>
                <button
                  disabled={!dates?.from || !dates?.to || isBooking}
                  onClick={handleBooking}
                  className="buttonPrimary"
                >
                  {isBooking ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </div>
          </aside>
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
                      <p className="text-sm text-neutral-600">
                        {venue.owner.bio}
                      </p>
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
        </div>
      </div>
    </section>
  );
}
