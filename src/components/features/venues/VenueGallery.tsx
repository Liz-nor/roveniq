type VenueImage = {
  url: string;
  alt?: string;
};

type VenueGalleryProps = {
  images: VenueImage[];
};

export default function VenueGallery({ images }: VenueGalleryProps) {
  const [mainImage, ...thumbnails] = images;

  if (!mainImage) {
    return <p>No images available.</p>;
  }

  return (
    <div className="space-y-3">
      <img
        src={mainImage.url}
        alt={mainImage.alt || 'Main venue photo'}
        className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[16/7]"
      />

      {thumbnails.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {thumbnails.map((image, index) => (
            <img
              key={`${image.url}-${index}`}
              src={image.url}
              alt={image.alt || `Venue photo ${index + 2}`}
              loading="lazy"
              className="aspect-[4/3] w-24 shrink-0 rounded-lg object-cover sm:w-32"
            />
          ))}
        </div>
      )}
    </div>
  );
}
