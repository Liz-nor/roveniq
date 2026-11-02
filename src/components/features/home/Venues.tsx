import { useEffect, useState } from 'react';
import { Star, MapPin, UsersRound, Wifi, Heart, PawPrint, Car, Utensils } from 'lucide-react';
import { getVenues, type Venue } from '../../../api/venues';

function formatLocation(location: Venue['location']) {
    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
}

function VenueCard({ venue }: { venue: Venue }) {
    const image = venue.media[0];

    return (
        <div className="bg-white p-4 shadow rounded relative flex flex-col h-full">
            <img
                src={image?.url ?? '/images/1.png'}
                alt={image?.alt || venue.name}
                className="w-full h-48 object-cover rounded mb-4"
            />
            <button
                type="button"
                aria-label="Save to favourites"
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
            >
                <Heart size={20} className="text-black" />
            </button>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-neutral-900 truncate">{venue.name}</h3>
                <div className="flex items-center gap-1">
                    <Star size={20} className="text-[#FFD700] fill-current" />
                    <span className="text-sm text-neutral-700">{venue.rating}/5</span>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-accent" />
                <p className="text-neutral-700">{formatLocation(venue.location)}</p>
            </div>
            <p className="text-neutral-700 mb-4 line-clamp-2">{venue.description}</p>
            <div className="mt-auto flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <UsersRound size={20} className="text-accent" />
                    <p className="text-neutral-700">Guests {venue.maxGuests}</p>
                </div>
                <div className="flex items-center gap-2">
                    {venue.meta.wifi && <Wifi size={20} className="text-accent" />}
                    {venue.meta.pets && <PawPrint size={20} className="text-accent" />}
                    {venue.meta.breakfast && <Utensils size={20} className="text-accent" />}
                    {venue.meta.parking && <Car size={20} className="text-accent" />}
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold text-neutral-900">${venue.price} / night</p>
                <button className="buttonPrimary">
                    Book Now
                </button>
            </div>
        </div>
    );
}

export default function ShowcaseVenues() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getVenues()
            .then(setVenues)
            .catch((err: Error) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Explore Venues</h2>
                {isLoading && <p className="text-neutral-700">Loading venues...</p>}
                {error && <p className="text-red-600">{error}</p>}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {venues.slice(0, 7).map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            </div>
        </section>
    );
}
