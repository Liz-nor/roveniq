import { getProfileVenues } from '../../api/profiles';
import { useProfileData } from '../../lib/useProfileData';
import { useVenueModal } from '../../hooks/useVenueModal';
import { VenueCard } from '../features/home/Venues';
import { VenueModal } from '../features/venues/VenueModal';
import { PlusIcon } from 'lucide-react';
export function ProfileVenues() {
  const { items: venues, isLoading, error } = useProfileData(getProfileVenues);
  const { isModalOpen, openModal, closeModal, editingVenue, handleSaveVenue } =
    useVenueModal();

  if (isLoading)
    return <p className="text-neutral-700">Loading your venues...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => openModal()}
        className="rounded bg-button-tertiary flex items-center justify-center"
      >
        <PlusIcon className="inline-block w-4 h-4 mr-2" />
      </button>

      <VenueModal
        isOpen={isModalOpen}
        venue={editingVenue}
        onClose={closeModal}
        onSubmit={handleSaveVenue}
      />

      {venues.length === 0 ? (
        <p className="text-neutral-700">You haven't listed any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
