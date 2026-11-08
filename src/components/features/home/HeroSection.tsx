import SearchBar from "../../ui/SearchBar";
import type { SearchFilters } from "../../../lib/venueFilters";

export default function HeroSection({ onSearch }: { onSearch: (filters: SearchFilters) => void }) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden">
      <img
        src="/images/mountainClimber.png"
        alt="Hero"
        className="absolute inset-0 h-full w-full object-cover opacity-50 max-md:w-auto"
      />
      <div className="container relative z-10 mx-auto px-4 text-left md:text-center md:flex md:flex-col md:items-center">
        <p className="text-lg font-semibold text-terracotta-800">Unforgettable stays</p>
        <h1 className="text-4xl font-bold text-neutral-900">Discover unique places to stay</h1>
        <p className="mt-4 text-lg text-neutral-700">
          From mountain cabins to seaside villas, find the perfect stay for your next adventure.
        </p>
        <SearchBar onSearch={onSearch} />
      </div>
    </section>
  );
}
