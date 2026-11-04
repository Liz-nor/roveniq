import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Star, MapPin, UsersRound, Wifi, Heart, PawPrint, Car, Utensils } from 'lucide-react';
import { getVenues, type Venue } from '../../../api/venues';
import { filterVenues, hasActiveFilters, type SearchFilters } from '../../../lib/venueFilters';
import Pagination from '../../ui/Pagination';

const VENUES_PER_PAGE = 11;

function formatLocation(location: Venue['location']) {
    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
}

export function VenueCard({ venue }: { venue: Venue }) {
    const image = venue.media[0];

    return (
        <div className="bg-white p-4 shadow rounded relative flex flex-col h-full">
            <img
                src={image?.url ?? '/images/1.png'}
                alt={image?.alt || venue.name}
                className="w-full h-48 object-cover rounded mb-4"
                onClick={() => window.location.href = `/venues/${venue.id}`}
            />
            <button
                type="button"
                aria-label="Save to favourites"
                className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
            >
                <Heart size={20} className="text-black" />
            </button>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-neutral-900 truncate">
                    {/* Stretched link: the ::after overlay makes the whole card clickable */}
                    <Link
                        to="/venues/$venueId"
                        params={{ venueId: venue.id }}
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {venue.name}
                    </Link>
                </h3>
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
                <button className="buttonPrimary whitespace-nowrap shrink-0">
                    Book Now
                </Link>
            </div>
        </div>
    );
}

export default function ShowcaseVenues({ filters }: { filters: SearchFilters }) {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [searchedFilters, setSearchedFilters] = useState(filters);

    useEffect(() => {
        getVenues()
            .then(setVenues)
            .catch((err: Error) => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    // A new search starts again from page 1
    if (filters !== searchedFilters) {
        setSearchedFilters(filters);
        setPage(1);
    }

    const isSearching = hasActiveFilters(filters);
    const matchingVenues = isSearching ? filterVenues(venues, filters) : venues;
    const totalPages = Math.ceil(matchingVenues.length / VENUES_PER_PAGE);
    const shownVenues = matchingVenues.slice((page - 1) * VENUES_PER_PAGE, page * VENUES_PER_PAGE);

    function handlePageChange(nextPage: number) {
        setPage(nextPage);
        document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section id="venues" className="py-12 scroll-mt-20">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                    {isSearching ? `Search results (${matchingVenues.length})` : 'Explore Venues'}
                </h2>
                {isLoading && <p className="text-neutral-700">Loading venues...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {isSearching && !isLoading && shownVenues.length === 0 && (
                    <p className="text-neutral-700">No venues match your search. Try different words or fewer guests.</p>
                )}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {shownVenues.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </section>
    );
}
