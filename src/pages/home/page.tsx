import { useState } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuthStore } from '../../lib/authStore';
import HeroSection from '../../components/features/home/HeroSection';
import TopRatedVenue from '../../components/features/home/TopRatedVenue';
import ShowcaseVenues from '../../components/features/home/Venues';
import { emptyFilters, type SearchFilters } from '../../lib/venueFilters';
import { BecomeVenueManager } from '../../components/features/home/BecomeVenueManager';
import Footer from '../../components/layout/Footer';

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  function handleSearch(next: SearchFilters) {
    setFilters(next);
    document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleManagerClick() {
    if (!user) {
      <Navigate to="/login" />;
      return;
    }
    setIsManagerModalOpen(true);
  }
  return (
    <>
      <HeroSection onSearch={handleSearch} />
      <TopRatedVenue />

      <ShowcaseVenues filters={filters} />
      {user?.venueManager ? (
        <button
          className="buttonTertiary"
          onClick={() => Navigate({ to: '/profile' })}
        >
          Manage my venues
        </button>
      ) : (
        <button className="buttonTertiary" onClick={handleManagerClick}>
          Become a Venue Manager
        </button>
      )}
      <BecomeVenueManager
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      />
      <Footer />
    </>
  );
}
