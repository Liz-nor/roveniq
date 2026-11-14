import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { updateProfile, type ProfileUpdate } from '../../../api/profiles';
import { useAuthStore } from '../../../lib/authStore';
import { urlSchema } from '../../../lib/validation';
import { Avatar } from '../../ui/Avatar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const BIO_MAX = 160;

const inputClass =
  'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';
const readOnlyClass =
  'w-full rounded-md bg-neutral-200 px-3 py-2 text-sm text-neutral-700';

export function EditProfileModal({ isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarAlt, setAvatarAlt] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerAlt, setBannerAlt] = useState('');
  const [errors, setErrors] = useState<{ avatar?: string; banner?: string }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open/close the native dialog and reset the form from the current profile.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      setBio(user?.bio ?? '');
      setAvatarUrl(user?.avatar?.url ?? '');
      setAvatarAlt(user?.avatar?.alt ?? '');
      setBannerUrl(user?.banner?.url ?? '');
      setBannerAlt(user?.banner?.alt ?? '');
      setErrors({});
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
    // Only reset when the modal opens, not on every store change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!user) return null;

  function validateUrl(value: string): string | undefined {
    if (!value.trim()) return undefined;
    const result = urlSchema.safeParse(value.trim());
    return result.success ? undefined : 'Enter a valid image URL (https://...)';
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !accessToken) {
      toast.error('You must be logged in to edit your profile.');
      return;
    }

    const nextErrors = {
      avatar: validateUrl(avatarUrl),
      banner: validateUrl(bannerUrl),
    };
    setErrors(nextErrors);
    if (nextErrors.avatar || nextErrors.banner) return;

    const update: ProfileUpdate = { bio: bio.trim() };
    if (avatarUrl.trim()) {
      update.avatar = { url: avatarUrl.trim(), alt: avatarAlt.trim() };
    }
    if (bannerUrl.trim()) {
      update.banner = { url: bannerUrl.trim(), alt: bannerAlt.trim() };
    }

    setIsSubmitting(true);
    try {
      const updated = await updateProfile(user.name, accessToken, update);
      setAuth(
        {
          ...user,
          bio: updated.bio,
          avatar: updated.avatar,
          banner: updated.banner,
          venueManager: updated.venueManager,
        },
        accessToken,
      );
      toast.success('Profile updated');
      onClose();
    } catch (err) {
      toast.error('Could not update your profile', {
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
        if (isSubmitting) e.preventDefault();
      }}
      aria-labelledby="edit-profile-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-white p-6 shadow-xl backdrop:bg-black/50"
    >
      <h2
        id="edit-profile-title"
        className="text-xl font-semibold text-neutral-900"
      >
        Edit profile
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        {/* Live preview */}
        <div className="relative overflow-hidden rounded-lg bg-muted-background pb-3">
          <img
            src={
              (!validateUrl(bannerUrl) && bannerUrl.trim()) ||
              '/images/roveniq-default-banner.webp'
            }
            alt=""
            className="h-20 w-full object-cover"
          />
          <Avatar
            src={(!validateUrl(avatarUrl) && avatarUrl.trim()) || undefined}
            alt=""
            className="-mt-8 ml-3 h-16 w-16 border-4 border-muted-background"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Account</legend>
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-name" className="text-sm text-neutral-900">
              Name
            </label>
            <input
              id="edit-name"
              value={user.name}
              readOnly
              className={readOnlyClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-email" className="text-sm text-neutral-900">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={user.email}
              readOnly
              className={readOnlyClass}
            />
          </div>
          <p className="text-xs text-neutral-600">
            Name and email are tied to your login and can't be changed.
          </p>
        </fieldset>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-bio" className="text-sm text-neutral-900">
            Bio
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            maxLength={BIO_MAX}
            rows={3}
            onChange={(e) => setBio(e.target.value)}
            className={inputClass}
          />
          <span className="self-end text-xs text-neutral-600">
            {bio.length}/{BIO_MAX}
          </span>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-neutral-900">Avatar</legend>
          <input
            type="url"
            aria-label="Avatar image URL"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            aria-invalid={Boolean(errors.avatar)}
            className={inputClass}
          />
          {errors.avatar && (
            <p className="text-xs text-red-600">{errors.avatar}</p>
          )}
          <input
            type="text"
            aria-label="Avatar description"
            placeholder="Describe the image"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
            className={inputClass}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-neutral-900">Banner</legend>
          <input
            type="url"
            aria-label="Banner image URL"
            placeholder="https://example.com/banner.jpg"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            aria-invalid={Boolean(errors.banner)}
            className={inputClass}
          />
          {errors.banner && (
            <p className="text-xs text-red-600">{errors.banner}</p>
          )}
          <input
            type="text"
            aria-label="Banner description"
            placeholder="Describe the image"
            value={bannerAlt}
            onChange={(e) => setBannerAlt(e.target.value)}
            className={inputClass}
          />
        </fieldset>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="buttonTertiary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="buttonPrimary"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
