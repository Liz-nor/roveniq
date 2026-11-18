import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  const navigate = useNavigate();

  function handleSearch(next: SearchFilters) {
    setFilters(next);
    document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleManagerClick() {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    setIsManagerModalOpen(true);
  }
  return (
    <>
      <HeroSection onSearch={handleSearch} />
      <TopRatedVenue />

      <ShowcaseVenues filters={filters} />
      <section className="container mx-auto my-16 px-4">
        <div className="grid overflow-hidden rounded-2x1 bg-muted-background md:grid-cols-2">
          {/* Image */}
          <img
            src="/images/mark-olsen-unsplash.jpg"
            alt="A venue manager working on a laptop"
            className="h-full w-full object-cover"
          />

          {/* Text content */}
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <p className="text-sm font-semibold text-terracotta-800">
              HOST WITH ROVENIQ
            </p>

            <h2 className="text-3xl font-bold text-neutral-900">
              Your space. New possibilities.
            </h2>

            <p className="text-neutral-700">
              Share your property with travelers, manage your listings, and
              welcome guests from around the world.
            </p>

            {user?.venueManager ? (
              <button
                className="buttonTertiary"
                onClick={() => navigate({ to: '/profile' })}
              >
                Manage my venues
              </button>
            ) : (
              <button
                className="buttonTertiary mx-auto"
                onClick={handleManagerClick}
              >
                Become a Venue Manager
              </button>
            )}
          </div>
        </div>
      </section>
      <BecomeVenueManager
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      />
      <Footer />
    </>
  );
}
