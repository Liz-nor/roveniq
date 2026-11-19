import { useState, type KeyboardEvent } from "react";
import { ImageOff, ImagePlus, Star, X } from "lucide-react";
import { urlSchema } from "../../../lib/validation";

export interface VenueImage {
  url: string;
  alt: string;
}

export const MAX_IMAGES = 8;
export const DRAFT_FIELD_NAME = "mediaDraft";

const inputClass =
  "w-full rounded-lg border border-neutral-300 p-3 text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

// Image picker for the venue form: add by URL, preview, alt text, remove, set cover.
// The first image is the cover, which is what the venue cards show.
export function VenueImagesInput({
  images,
  onChange,
}: {
  images: VenueImage[];
  onChange: (images: VenueImage[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [brokenUrls, setBrokenUrls] = useState<string[]>([]);

  const isFull = images.length >= MAX_IMAGES;

  function addImage() {
    const url = draft.trim();
    if (!url) return;
    if (!urlSchema.safeParse(url).success) {
      setDraftError("Enter a valid image URL starting with https://");
      return;
    }
    if (images.some((image) => image.url === url)) {
      setDraftError("This image is already added.");
      return;
    }
    if (isFull) {
      setDraftError(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }
    onChange([...images, { url, alt: "" }]);
    setDraft("");
    setDraftError(null);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Enter adds the image instead of submitting the whole form
    if (e.key === "Enter") {
      e.preventDefault();
      addImage();
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function makeCover(index: number) {
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  }

  function updateAlt(index: number, alt: string) {
    onChange(
      images.map((image, i) => (i === index ? { ...image, alt } : image)),
    );
  }

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 flex w-full justify-between text-sm text-neutral-900">
        <span>Images</span>
        <span className="text-xs text-neutral-600">
          {images.length}/{MAX_IMAGES}
        </span>
      </legend>

      <div className="flex gap-2">
        <input
          type="url"
          name={DRAFT_FIELD_NAME}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setDraftError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste an image URL, e.g. https://example.com/venue.jpg"
          aria-label="Image URL"
          aria-invalid={Boolean(draftError)}
          aria-describedby={draftError ? "venue-image-error" : undefined}
          disabled={isFull}
          className={`${inputClass} disabled:bg-neutral-100`}
        />
        <button
          type="button"
          onClick={addImage}
          disabled={!draft.trim() || isFull}
          className="buttonSecondary flex shrink-0 items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus size={18} aria-hidden="true" />
          Add
        </button>
      </div>
      {draftError && (
        <p id="venue-image-error" className="text-xs text-error">
          {draftError}
        </p>
      )}

      {images.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-600">
          <ImagePlus size={28} aria-hidden="true" />
          No images yet. The first image you add becomes the cover.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((image, index) => {
            const isCover = index === 0;
            const isBroken = brokenUrls.includes(image.url);
            return (
              <li
                key={image.url}
                className={`overflow-hidden rounded-lg border ${
                  isCover
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-neutral-300"
                }`}
              >
                <div className="relative h-32 bg-neutral-100">
                  {isBroken ? (
                    <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center text-xs text-error">
                      <ImageOff size={24} aria-hidden="true" />
                      Couldn't load this image. Check the URL.
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.alt || `Venue image ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={() =>
                        setBrokenUrls((prev) => [...prev, image.url])
                      }
                    />
                  )}

                  {isCover ? (
                    <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                      <Star
                        size={12}
                        className="fill-current"
                        aria-hidden="true"
                      />
                      Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs text-neutral-900 shadow hover:bg-white"
                    >
                      Make cover
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow hover:bg-white hover:text-error"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Describe the image (alt text)"
                  aria-label={`Description for image ${index + 1}`}
                  maxLength={120}
                  className="w-full border-t border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/30"
                />
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}
