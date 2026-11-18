import { useEffect, useRef, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Venue } from '../../../api/venues';
import { VenueForm, type VenueInput } from './VenueForm';

type VenueModalProps = {
  isOpen: boolean;
  venue?: Venue;
  onClose: () => void;
  onSubmit: (input: VenueInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export function VenueModal({
  isOpen,
  onClose,
  venue,
  onSubmit,
  onDelete,
}: VenueModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Shows the "Are you sure?" step instead of the Delete venue button
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Reset the confirm step whenever the modal closes
  function handleClose() {
    setIsConfirmingDelete(false);
    onClose();
  }

  async function handleDelete() {
    if (!onDelete || !venue) return;
    setIsDeleting(true);
    try {
      await onDelete();
      toast.success('Venue deleted');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete venue',
      );
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  }

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
      onClose={handleClose}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      aria-label={venue ? 'Edit Venue' : 'Create Venue'}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="flex items-center justify-end p-4 pb-0">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-2 right-2"
        >
          <X size={20} />
        </button>
      </div>

      <VenueForm
        key={venue?.id ?? 'create'}
        venue={venue}
        onSubmit={onSubmit}
        onCancel={handleClose}
      />

      {venue && onDelete && (
        <div className="border-t border-neutral-200 p-4">
          {isConfirmingDelete ? (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-lg border border-error-border bg-error-bg p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-error">
                Delete <strong>{venue.name}</strong>? This cannot be undone.
              </p>
              <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  disabled={isDeleting}
                  className="buttonSecondary disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="buttonDanger flex items-center gap-2"
                >
                  <Trash2 size={16} aria-hidden="true" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="flex items-center gap-2 text-sm font-medium text-error hover:underline"
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete venue
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
