import { useState } from 'react';
import { updateVenue, createVenue, type Venue } from '../api/venues';
import type { VenueInput } from '../components/features/venues/VenueForm';
import { useAuthStore } from '../lib/authStore';

export function useVenueModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | undefined>();
  const accessToken = useAuthStore((state) => state.accessToken);

  function openModal(venue?: Venue) {
    setEditingVenue(venue);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingVenue(undefined);
  }

  async function handleSaveVenue(input: VenueInput) {
    // TODO: Implement venue save logic (API call)
    console.log('Saving venue:', input);
    if (editingVenue) {
      console.log('Editing existing venue');
      await updateVenue(editingVenue.id, input, accessToken);
    } else {
      console.log('Creating new venue');
      await createVenue(input, accessToken);
    }
    console.log('Venue saved successfully');
    closeModal();
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    editingVenue,
    handleSaveVenue,
  };
}
