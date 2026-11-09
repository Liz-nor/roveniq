import { Avatar } from './Avatar';
import { SquarePen } from 'lucide-react';

interface ProfileBannerProps {
    name: string;
    role: string;
    bannerSrc?: string;
    bannerAlt?: string;
    avatarSrc?: string;
    avatarAlt?: string;
    onEdit?: () => void;
}

export function ProfileBanner({
    name,
    role,
    bannerSrc,
    bannerAlt = 'Profile banner',
    avatarSrc,
    avatarAlt = `${name}'s avatar`,
    onEdit,
}: ProfileBannerProps) {
    return (
        <section className="relative overflow-hidden rounded-lg bg-muted-background pb-10">
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
                <button
                    type="button"
                    onClick={() => alert('Become a venue manager clicked')}
                    className="absolute left-2 bottom-2 flex items-center cursor-pointer gap-2 rounded-md border border-sage-500 bg-sage-100 px-2 py-0.5 text-xs text-neutral-900 transition-colors hover:bg-sage-200 sm:right-4"
                >
                    Become a venue manager
                </button>
            </div>
            <button
                type="button"
                title="Edit your profile"
                onClick={onEdit}
                disabled={!onEdit}
                className="absolute right-2 bottom-2 flex items-center cursor-pointer gap-2 rounded-md border border-sage-500 bg-sage-100 px-2 py-0.5 text-xs text-neutral-900 transition-colors hover:bg-sage-200 sm:right-4"
            >
                <SquarePen className="size-4" aria-hidden="true" />
                Edit
            </button>
        </section>
    );
}
