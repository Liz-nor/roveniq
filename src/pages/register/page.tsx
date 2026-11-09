import { useState, type FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import ValidatedInput from '../../components/features/ValidatedInput';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  urlSchema,
} from '../../lib/validation';
import { login, register } from '../../api/auth';
import { useAuthStore } from '../../lib/authStore';
import { publicImageUrl } from '../../lib/config';
import {toast} from 'sonner';

// Options for avatar and banner images
const avatarOptions = [
  { label: 'Default', image: '/images/roveniq-default-avatar.webp' },
  { label: 'Male', image: '/images/roveniq-male-avatar.webp' },
  { label: 'Female', image: '/images/roveniq-female-avatar.webp' },
] as const;
// Options for banner images
const bannerOptions = [
  { label: 'Default', image: '/images/roveniq-default-banner.webp' },
  { label: 'Island', image: '/images/paradise.png' },
  { label: 'Venice', image: '/images/canal.png' },
  { label: 'Beach', image: '/images/sunset.png' },
  { label: 'Forest', image: '/images/waterfall.png' },
] as const;

// Radio value used when the person pastes their own image URL.
const CUSTOM_URL = 'url';

function ImageUrlOption({
  name,
  url,
  selected,
  onSelect,
  previewClassName,
}: {
  name: string;
  url: string;
  selected: boolean;
  onSelect: () => void;
  previewClassName: string;
}) {
  // Remember which URL failed to load so a new URL gets a fresh try.
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const showPreview = urlSchema.safeParse(url).success && brokenUrl !== url;

  return (
    <label
      className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-1 text-center text-xs transition-colors ${
        selected
          ? 'border-primary bg-teal-50'
          : 'border-neutral-300 hover:border-primary'
      } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary`}
    >
      <input
        type="radio"
        name={name}
        value={CUSTOM_URL}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      {showPreview ? (
        <img
          src={url}
          alt=""
          onError={() => setBrokenUrl(url)}
          className={previewClassName}
        />
      ) : (
        <span
          className={`${previewClassName} flex items-center justify-center bg-neutral-100 text-neutral-700`}
        >
          Paste URL
        </span>
      )}
      <span>Use image URL</span>
    </label>
  );
}

export default function RegisterForm({ active }: { active: boolean }) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    avatarOptions[0].image,
  );
  const [selectedBanner, setSelectedBanner] = useState<string>(
    bannerOptions[0].image,
  );
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [venueManager, setVenueManager] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    // Validate name, email, and password */
    if (!nameSchema.safeParse(name).success) {
      setError('Name must be at least 2 characters: letters, numbers and underscores only.');
      return;
    }
    if (!emailSchema.safeParse(email).success) {
      setError('Please enter a valid stud.noroff.no email.');
      return;
    }
    if (!passwordSchema.safeParse(password).success) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (selectedAvatar === CUSTOM_URL && !urlSchema.safeParse(avatarUrl).success) {
      setError('Please enter a valid profile image URL, starting with http:// or https://.');
      return;
    }
    if (selectedBanner === CUSTOM_URL && !urlSchema.safeParse(bannerUrl).success) {
      setError('Please enter a valid banner image URL, starting with http:// or https://.');
      return;
    }

    const avatar =
      selectedAvatar === CUSTOM_URL ? avatarUrl : publicImageUrl(selectedAvatar);
    const banner =
      selectedBanner === CUSTOM_URL ? bannerUrl : publicImageUrl(selectedBanner);

    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        venueManager,
        avatar: { url: avatar, alt: `${name}'s avatar` },
        banner: { url: banner, alt: `${name}'s banner` },
      });
      // Register doesn't return a token, so log in straight after.
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken);
      toast.success('Welcome to roveniq! Your account has been created!');
      navigate({ to: '/profile' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={`col-start-2 row-start-1 p-10 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      <h1 className="text-text mb-4">Create account</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <ValidatedInput
          type="text"
          name="name"
          autoComplete="username"
          placeholder="Name"
          schema={nameSchema}
        />
        <ValidatedInput
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email"
          schema={emailSchema}
        />
        <ValidatedInput
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Password (min 8 characters)"
          schema={passwordSchema}
        />
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="venueManager"
            checked={venueManager}
            onChange={(event) => setVenueManager(event.target.checked)}
          />
          I want to register as a venue manager
        </label>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-semibold">Profile image</legend>
          <div className="grid grid-cols-4 gap-2">
            {avatarOptions.map(({ label, image }) => (
              <label
                key={image}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 text-sm transition-colors ${
                  selectedAvatar === image
                    ? 'border-primary bg-teal-50'
                    : 'border-neutral-300 hover:border-primary'
                } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary`}
              >
                <input
                  type="radio"
                  name="avatar"
                  value={image}
                  checked={selectedAvatar === image}
                  onChange={() => setSelectedAvatar(image)}
                  className="sr-only"
                />
                <img
                  src={image}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span>{label}</span>
              </label>
            ))}
            <ImageUrlOption
              name="avatar"
              url={avatarUrl}
              selected={selectedAvatar === CUSTOM_URL}
              onSelect={() => setSelectedAvatar(CUSTOM_URL)}
              previewClassName="h-12 w-12 self-center rounded-full object-cover"
            />
          </div>
          {selectedAvatar === CUSTOM_URL && (
            <ValidatedInput
              type="url"
              name="avatarUrl"
              placeholder="https://example.com/avatar.jpg"
              aria-label="Profile image URL"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value.trim())}
              schema={urlSchema}
            />
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 font-semibold">Banner image</legend>
          <div className="grid grid-cols-6 gap-2">
            {bannerOptions.map(({ label, image }) => (
              <label
                key={image}
                className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-1 text-center text-xs transition-colors ${
                  selectedBanner === image
                    ? 'border-primary bg-teal-50'
                    : 'border-neutral-300 hover:border-primary'
                } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary`}
              >
                <input
                  type="radio"
                  name="banner"
                  value={image}
                  checked={selectedBanner === image}
                  onChange={() => setSelectedBanner(image)}
                  className="sr-only"
                />
                <img
                  src={image}
                  alt=""
                  className="min-h-[58px] rounded-md object-cover"
                />
                <span>{label}</span>
              </label>
            ))}
            <ImageUrlOption
              name="banner"
              url={bannerUrl}
              selected={selectedBanner === CUSTOM_URL}
              onSelect={() => setSelectedBanner(CUSTOM_URL)}
              previewClassName="aspect-[16/7] w-full rounded object-cover"
            />
          </div>
          {/* Validate banner image URL */}
          {selectedBanner === CUSTOM_URL && (
            <ValidatedInput
              type="url"
              name="bannerUrl"
              placeholder="https://example.com/banner.jpg"
              aria-label="Banner image URL"
              value={bannerUrl}
              onChange={(event) => setBannerUrl(event.target.value.trim())}
              schema={urlSchema}
            />
          )}
        </fieldset>
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          className="buttonPrimary flex items-center justify-center gap-2"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          )}
          Register
        </button>
      </form>
    </section>
  );
}
