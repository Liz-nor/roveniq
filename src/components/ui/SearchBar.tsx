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
            className="bg-teal-700 h-[52px] w-full max-w-[770px] mt-6 rounded-[30px] flex items-center justify-center"
        >
            <div className="flex items-center gap-4 divide-x divide-white">
                <label className="flex items-center gap-2">
                    <MapPin size={20} className="text-white" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Where are you going?"
                        aria-label="Destination or keyword"
                        className="bg-transparent text-white placeholder-white focus:outline-none"
                    />
                </label>
                <label className="flex items-center gap-2">
                    <Calendar size={20} className="text-white" />
                    <input
                        type="text"
                        placeholder="Check-in → Check-out"
                        aria-label="Dates"
                        className="bg-transparent text-white placeholder-white focus:outline-none"
                    />
                </label>
                <label className="flex items-center gap-2">
                    <UsersRound size={20} className="text-white" />
                    <input
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Guests"
                        aria-label="Number of guests"
                        className="bg-transparent text-white placeholder-white focus:outline-none"
                    />
                </label>
                <button
                    type="submit"
                    aria-label="Search venues"
                    className="bg-teal-900 h-[40px] w-[40px] rounded-full flex items-center justify-center"
                >
                    <Search size={20} className="text-white" />
                </button>
            </div>
        </form>
    );
}
