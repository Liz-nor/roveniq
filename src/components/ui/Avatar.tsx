
export function Avatar({
    src,
    alt,
    className = 'w-16 h-16',
}: {
    src?: string;
    alt: string;
    className?: string;
}) {
    return (
        <img
            src={src || '/images/roveniq-default-avatar.webp'}
            alt={alt}
            className={`${className} rounded-full object-cover`}
        />
    );
}
