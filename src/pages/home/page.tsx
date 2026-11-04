import { useState } from 'react';
import HeroSection from '../../components/features/home/HeroSection';
import ShowcaseVenues from '../../components/features/home/Venues';
import { emptyFilters, type SearchFilters } from '../../lib/venueFilters';

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);

  function handleSearch(next: SearchFilters) {
    setFilters(next);
    document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <HeroSection onSearch={handleSearch} />
      <ShowcaseVenues filters={filters} />
    </>
  );
}
