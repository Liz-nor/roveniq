import { CalendarDays, UsersRound } from 'lucide-react';
import { getProfileBookings } from '../../api/profiles';
import { useProfileData } from '../../lib/useProfileData';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

export default function ProfileBookings() {
    const { items: bookings, isLoading, error } = useProfileData(getProfileBookings);

    if (isLoading) return <p className="text-neutral-700">Loading bookings...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (bookings.length === 0) return <p className="text-neutral-700">You have no bookings yet.</p>;

    return (
        <ul className="flex flex-col gap-4">
            {bookings.map((booking) => {
                const image = booking.venue?.media[0];
                return (
                    <li key={booking.id} className="flex gap-4 rounded-md bg-muted-background p-3">
                        <img
                            src={image?.url ?? '/images/1.png'}
                            alt={image?.alt || booking.venue?.name || 'Venue'}
                            className="h-20 w-28 shrink-0 rounded object-cover"
                        />
                        <div className="flex flex-col gap-1 text-sm text-neutral-900">
                            <p className="font-semibold">{booking.venue?.name ?? 'Venue'}</p>
                            <p className="flex items-center gap-2">
                                <CalendarDays className="size-4" aria-hidden="true" />
                                {dateFormat.format(new Date(booking.dateFrom))} – {dateFormat.format(new Date(booking.dateTo))}
                            </p>
                            <p className="flex items-center gap-2">
                                <UsersRound className="size-4" aria-hidden="true" />
                                {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
