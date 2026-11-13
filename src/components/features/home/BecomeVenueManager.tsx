import { useAuthStore } from '../../../lib/authStore';
import { useState, useEffect, useRef } from 'react';
import { becomeVenueManager } from '../../../api/profiles';
import { Wallet, House, CalendarCheck, Pencil } from 'lucide-react';
import { toast } from 'sonner';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomeVenueManager({ isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  async function handleUpgrade() {
    if (!user || !accessToken) {
      toast.error('You must be logged in to become a venue manager.');
      return;
    }
    setIsSubmitting(true);

    try {
      const isManager = await becomeVenueManager(user.name, accessToken);

      setAuth({ ...user, venueManager: isManager }, accessToken);

      onClose();

      toast.success('You are now a venue manager!');
    } catch (err) {
      toast.error('Could not update your account', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={(e) => {
        if (isSubmitting) {
          e.preventDefault();
        }
      }}
      aria-labelledby="manager-modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      <h2
        id="manager-modal-title"
        className="text-xl font-semibold text-neutral-900"
      >
        Become a Venue Manager
      </h2>

      <p className="mt-3 text-neutral-700">
        Ready to host? Upgrade your account to create and manage your own venues
        on Roveniq.
      </p>

      <ul className="mt-4 space-y-2">
        <li className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-neutral-800" />
          Secure payments for your bookings
        </li>
        <li className="flex items-center gap-2">
          <House className="h-5 w-5 text-neutral-800" />
          Manage your venues easily
        </li>
        <li className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-neutral-800" />
          Keep track of your bookings
        </li>
        <li className="flex items-center gap-2">
          <Pencil className="h-5 w-5 text-neutral-800" />
          Edit your venue details anytime
        </li>
      </ul>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="buttonTertiary"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={isSubmitting}
          className="buttonPrimary"
        >
          {isSubmitting ? 'Updating...' : 'Become a host'}
        </button>
      </div>
    </dialog>
  );
}
