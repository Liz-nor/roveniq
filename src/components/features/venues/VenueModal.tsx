import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { Venue } from '../../../api/venues';
import { VenueForm, type VenueInput } from './VenueForm';

type VenueModalProps = {
  isOpen: boolean;
  venue?: Venue;
  onClose: () => void;
  onSubmit: (input: VenueInput) => Promise<void>;
};

export function VenueModal({
  isOpen,
  onClose,
  venue,
  onSubmit,
}: VenueModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={venue ? 'Edit Venue' : 'Create Venue'}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center justify-end p-4 pb-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X size={20} />
        </button>
      </div>

      <VenueForm
        key={venue?.id ?? 'create'}
        venue={venue}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </dialog>
  );
}
