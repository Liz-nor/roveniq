import { useState, type FormEvent } from 'react';
import { MapPin, Calendar, UsersRound, Search } from 'lucide-react';
import type { SearchFilters } from '../../lib/venueFilters';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [guests, setGuests] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSearch({ query, guests: Number(guests) || 0 });
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="
            bg-teal-700 
            w-full 
            max-w-[770px] 
            mt-6 
            p-4
            rounded-2xl
            lg:rounded-[30px]
            lg:p-2"
        >
            <div className="
            flex 
            w-full
            flex-col
            items-center 
            gap-3
            lg:flex-row
            lg:items-center 
            lg:gap-0 
            lg:divide-x 
            lg:divide-white">
                <label className="
                flex 
                min-w-0 
                items-center 
                gap-2
                py-2
                lg:flex-[2]
                lg:px-3">
                    <MapPin size={20} className="text-white" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Where are you going?"
                        aria-label="Destination or keyword"
                        className="
                        min-w-0 
                        w-full 
                        bg-transparent 
                        text-white 
                        placeholder-white 
                        focus:outline-none"
                    />
                </label>
                <label className="flex 
                min-w-0 
                items-center 
                gap-2
                py-2
                lg:flex-[2]
                lg:px-3">
                    <Calendar size={20} className="text-white" />
                    <input
                        type="text"
                        placeholder="Check-in → Check-out"
                        aria-label="Dates"
                        className="
                        min-w-0 
                        w-full 
                        bg-transparent 
                        text-white 
                        placeholder-white 
                        focus:outline-none"
                    />
                </label>
                <label className="flex 
                min-w-0 
                items-center 
                gap-2
                py-2
                lg:flex-[2]
                lg:px-3">
                    <UsersRound size={20} className="text-white" />
                    <input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Guests"
                        aria-label="Number of guests"
                        className="
                        min-w-0 
                        w-full 
                        bg-transparent 
                        text-white 
                        placeholder-white 
                        focus:outline-none"
                    />
                </label>
                <button
                    type="submit"
                    aria-label="Search venues"
                    className="flex 
                    h-11 
                    w-full 
                    items-center 
                    justify-center
                    rounded-xl 
                    bg-teal-900 
                    text-white
                    hover:bg-teal-950
                    ml-2
                    lg:h-10 
                    lg:w-10 
                    lg:shrink-0 
                    lg:rounded-full"
                >
                    <Search size={20} />
                    <span className="ml-2 lg:hidden">Search venues</span>
                </button>
            </div>
        </form>
    );
}
