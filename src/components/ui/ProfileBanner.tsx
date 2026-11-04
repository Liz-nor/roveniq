import { Avatar } from './Avatar';

interface ProfileBannerProps {
    name: string;
    role: string;
    bannerSrc?: string;
    bannerAlt?: string;
    avatarSrc?: string;
    avatarAlt?: string;
}

export function ProfileBanner({
    name,
    role,
    bannerSrc,
    bannerAlt = 'Profile banner',
    avatarSrc,
    avatarAlt = `${name}'s avatar`,
}: ProfileBannerProps) {
    return (
        <section className="overflow-hidden rounded-lg bg-muted-background pb-10">
            <img
                src={bannerSrc || '/images/roveniq-default-banner.webp'}
                alt={bannerAlt}
                className="h-28 w-full object-cover sm:h-36"
            />
            {/* Avatar overlaps the bottom edge of the banner */}
            <div className="flex items-end gap-6 px-2 sm:px-4">
                <Avatar
                    src={avatarSrc}
                    alt={avatarAlt}
                    className="-mt-12 h-24 w-24 shrink-0 border-4 border-muted-background"
                />
                <div className="pb-2 font-playfair">
                    <p className="font-playfair text-lg text-neutral-900">{name}</p>
                    <p className="font-playfair text-sm text-neutral-900">{role}</p>
                </div>
            </div>
        </section>
    );
}
