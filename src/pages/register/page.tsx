import { useEffect, useState } from 'react';
import ValidatedInput from '../../components/features/ValidatedInput';
import { emailSchema, nameSchema, passwordSchema } from '../../lib/validation';

const avatarOptions = [
  { label: 'Default', image: '/images/roveniq-default-avatar.webp' },
  { label: 'Male', image: '/images/roveniq-male-avatar.webp' },
  { label: 'Female', image: '/images/roveniq-female-avatar.webp' },
] as const;

const bannerOptions = [
  { label: 'Default', image: '/images/roveniq-default-banner.webp' },
  { label: 'Island', image: '/images/paradise.png' },
  { label: 'Venice', image: '/images/canal.png' },
  { label: 'Beach', image: '/images/sunset.png' },
  { label: 'Forest', image: '/images/waterfall.png' },
] as const;

function ImageUploadOption({
  name,
  label,
  ariaLabel,
  selected,
  onSelect,
  previewClassName,
}: {
  name: string;
  label: string;
  ariaLabel: string;
  selected: boolean;
  onSelect: () => void;
  previewClassName: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <label
      className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-1 text-center text-xs transition-colors ${
        selected
          ? 'border-primary bg-teal-50'
          : 'border-neutral-300 hover:border-primary'
      } has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary`}
    >
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (!file.type.startsWith('image/')) {
            setError('Choose an image file.');
            event.target.value = '';
            return;
          }

          setError(null);
          setPreview(URL.createObjectURL(file));
          onSelect();
        }}
        className="sr-only"
        aria-label={ariaLabel}
      />
      {preview ? (
        <img
          src={preview}
          alt="Uploaded image preview"
          className={previewClassName}
        />
      ) : (
        <span
          className={`${previewClassName} flex items-center justify-center bg-neutral-100 text-neutral-700`}
        >
          Choose image
        </span>
      )}
      <span>{label}</span>
      {error && <span className="text-error">{error}</span>}
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

  return (
    <section
      className={`col-start-2 row-start-1 p-10 transition-opacity duration-500 ${
        active ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!active}
      inert={!active}
    >
      <h1 className="text-text mb-4">Create account</h1>
      <form className="flex flex-col gap-4">
        <ValidatedInput type="text" placeholder="Name" schema={nameSchema} />
        <ValidatedInput type="email" placeholder="Email" schema={emailSchema} />
        <ValidatedInput
          type="password"
          placeholder="Password (min 8 characters)"
          schema={passwordSchema}
        />
        <fieldset>
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
            <ImageUploadOption
              name="avatarUpload"
              ariaLabel="Upload your own avatar"
              label="Upload your own"
              selected={selectedAvatar === 'upload'}
              onSelect={() => setSelectedAvatar('upload')}
              previewClassName="h-12 w-12 self-center rounded-full object-cover"
            />
          </div>
        </fieldset>
        <fieldset>
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
            <ImageUploadOption
              name="bannerUpload"
              ariaLabel="Upload your own banner"
              label="Upload your own"
              selected={selectedBanner === 'upload'}
              onSelect={() => setSelectedBanner('upload')}
              previewClassName="aspect-[16/7] w-full rounded object-cover"
            />
          </div>
        </fieldset>
        <button className="buttonPrimary">Register</button>
      </form>
    </section>
  );
}
