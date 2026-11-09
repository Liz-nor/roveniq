import { useState, type FormEvent, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { Venue } from '../../api/venues';
import { urlSchema } from '../../lib/validation';

const MAX_PRICE = 10000;
const MAX_GUESTS = 100;

const amenities = [
    { key: 'wifi', label: 'Wifi' },
    { key: 'parking', label: 'Parking' },
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'pets', label: 'Pets allowed' },
] as const;

const fieldClass =
    'w-full rounded-lg border border-neutral-300 p-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="flex flex-col gap-1 text-sm text-neutral-900">
            {label}
            {children}
        </label>
    );
}

export function VenueForm({
    venue,
    onSubmit,
    onCancel,
}: {
    venue?: Venue;
    onSubmit: (input: Venue) => Promise<void>;
    onCancel: () => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const text = (key: string) => String(formData.get(key) ?? '').trim();

        const name = text('name');
        const description = text('description');
        const price = Number(text('price'));
        const maxGuests = Number(text('maxGuests'));
        const urls = text('media')
            .split('\n')
            .map((url) => url.trim())
            .filter(Boolean);

        if (!name || !description) {
            setError('Please enter a name and a description.');
            return;
        }
        if (!text('price') || !Number.isFinite(price) || price < 0 || price > MAX_PRICE) {
            setError(`Price must be between 0 and ${MAX_PRICE}.`);
            return;
        }
        if (!Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > MAX_GUESTS) {
            setError(`Max guests must be a whole number between 1 and ${MAX_GUESTS}.`);
            return;
        }
        if (urls.some((url) => !urlSchema.safeParse(url).success)) {
            setError('Each image must be a valid URL, starting with http:// or https://.');
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit({
                id: venue?.id || '',
                name,
                description,
                price,
                maxGuests,
                rating: venue?.rating || 0,
                // Keep the alt text of images that were already on the venue.
                media: urls.map((url) => ({
                    url,
                    alt: venue?.media.find((image) => image.url === url)?.alt || name,
                })),
                meta: {
                    wifi: formData.has('wifi'),
                    parking: formData.has('parking'),
                    breakfast: formData.has('breakfast'),
                    pets: formData.has('pets'),
                },
                location: {
                    address: text('address'),
                    city: text('city'),
                    zip: text('zip'),
                    country: text('country'),
                    continent: text('continent'),
                    lat: Number(text('lat')),
                    lng: Number(text('lng')),
                },
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save the venue');
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className="flex flex-col gap-4 rounded-lg bg-muted-background p-4"
            onSubmit={handleSubmit}
            noValidate
        >
            <h3 className="text-lg text-neutral-900">{venue ? 'Edit venue' : 'New venue'}</h3>
            <Field label="Name">
                <input name="name" defaultValue={venue?.name} className={fieldClass} />
            </Field>
            <Field label="Description">
                <textarea
                    name="description"
                    rows={4}
                    defaultValue={venue?.description}
                    className={fieldClass}
                />
            </Field>
            <Field label="Image URLs (one per line)">
                <textarea
                    name="media"
                    rows={3}
                    defaultValue={venue?.media.map((image) => image.url).join('\n')}
                    placeholder="https://example.com/venue.jpg"
                    className={fieldClass}
                />
            </Field>
            <div className="grid grid-cols-2 gap-4">
                <Field label="Price per night">
                    <input
                        name="price"
                        type="number"
                        min={0}
                        max={MAX_PRICE}
                        defaultValue={venue?.price}
                        className={fieldClass}
                    />
                </Field>
                <Field label="Max guests">
                    <input
                        name="maxGuests"
                        type="number"
                        min={1}
                        max={MAX_GUESTS}
                        defaultValue={venue?.maxGuests}
                        className={fieldClass}
                    />
                </Field>
                <Field label="Address">
                    <input name="address" defaultValue={venue?.location.address ?? ''} className={fieldClass} />
                </Field>
                <Field label="City">
                    <input name="city" defaultValue={venue?.location.city ?? ''} className={fieldClass} />
                </Field>
                <Field label="Zip code">
                    <input name="zip" defaultValue={venue?.location.zip ?? ''} className={fieldClass} />
                </Field>
                <Field label="Country">
                    <input name="country" defaultValue={venue?.location.country ?? ''} className={fieldClass} />
                </Field>
            </div>
            <fieldset>
                <legend className="mb-2 text-sm text-neutral-900">Amenities</legend>
                <div className="flex flex-wrap gap-4">
                    {amenities.map(({ key, label }) => (
                        <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-900">
                            <input type="checkbox" name={key} defaultChecked={venue?.meta[key]} />
                            {label}
                        </label>
                    ))}
                </div>
            </fieldset>
            {error && (
                <p role="alert" className="rounded-lg border border-error-border bg-error-bg p-3 text-sm text-error">
                    {error}
                </p>
            )}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="cursor-pointer rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-900"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="buttonPrimary flex items-center justify-center gap-2"
                >
                    {isSubmitting && <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />}
                    {venue ? 'Save changes' : 'Create venue'}
                </button>
            </div>
        </form>
    );
}
