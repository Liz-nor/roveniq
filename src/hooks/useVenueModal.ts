import { useState } from 'react';
import {
  updateVenue,
  createVenue,
  deleteVenue,
  type Venue,
} from '../api/venues';
import type { VenueInput } from '../components/features/venues/VenueForm';
import { useAuthStore } from '../lib/authStore';

// onChange runs after a venue is created, updated or deleted,
// so the caller can refresh its list.
export function useVenueModal(onChange?: () => void) {
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
    if (editingVenue) {
      await updateVenue(editingVenue.id, input, accessToken);
    } else {
      await createVenue(input, accessToken);
    }
    closeModal();
    onChange?.();
  }

  async function handleDeleteVenue(): Promise<void> {
    if (!editingVenue) return;
    await deleteVenue(editingVenue.id, accessToken);
    closeModal();
    onChange?.();
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    editingVenue,
    handleSaveVenue,
    handleDeleteVenue,
  };
}
