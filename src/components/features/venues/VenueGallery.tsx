type VenueImage = {
  url: string;
  alt?: string;
};

type VenueGalleryProps = {
  images: VenueImage[];
};

export default function VenueGallery({ images }: VenueGalleryProps) {
  if (images.length === 0) {
    return <p>No images available.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {images.map((image, index) => (
        <img
          key={`${image.url}-${index}`}
          src={image.url}
          alt={image.alt || `Venue image ${index + 1}`}
          className={`h-full w-full object-cover
                ${index === 0 ? 'col-span-2 row-span-2' : ''}
                `}
        />
      ))}
    </div>
  );
}
