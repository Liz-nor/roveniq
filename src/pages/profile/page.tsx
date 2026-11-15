import { useState } from 'react';
import { ProfileBanner } from '../../components/ui/ProfileBanner.tsx';
import { ProfileDetails } from '../../components/ui/ProfileDetails.tsx';
import { ProfileVenues } from '../../components/ui/ProfileVenues.tsx';
import ProfileBookings from '../../components/ui/ProfileBookings.tsx';
import ProfileFavorites from '../../components/ui/ProfileFavorites.tsx';
import { useAuthStore } from '../../lib/authStore';
import { EditProfileModal } from '../../components/features/profile/EditProfileModal.tsx';

type ProfileTab = 'profile' | 'bookings' | 'favorites' | 'venues';

// Tabs for profile sections changing according to the logged-in user's role
const tabs: { key: ProfileTab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'favorites', label: 'Favourites' },
  { key: 'venues', label: 'My Venues' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const profile = useAuthStore((state) => state.user);

  // The route guard redirects visitors; this covers logging out on this page.
  if (!profile) return null;

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-4">
      <ProfileBanner
        name={profile.name}
        role={profile.venueManager ? 'Venue Manager' : 'Customer'}
        bannerSrc={profile.banner?.url}
        bannerAlt={profile.banner?.alt || undefined}
        avatarSrc={profile.avatar?.url}
        avatarAlt={profile.avatar?.alt || undefined}
        onEdit={() => setIsEditOpen(true)}
      />
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <div
        className="
            relative 
            flex 
            items-center 
            justify-center"
      >
        <div
          role="tablist"
          aria-label="Profile sections"
          className="
                    flex 
                    gap-2 
                    rounded-md 
                    bg-teal-900 
                    p-1"
        >
          {tabs
            .filter((tab) => tab.key !== 'venues' || profile.venueManager)
            .map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                                    w-20 
                                    rounded-full 
                                    py-1.5 
                                    font-playfair 
                                    text-xs 
                                    text-neutral-900 
                                    transition-colors 
                                    sm:w-24 
                                    ${
                                      activeTab === tab.key
                                        ? 'bg-muted-background'
                                        : 'bg-teal-100 hover:bg-muted-background'
                                    }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      <div className="px-0 sm:px-5">
        {activeTab === 'profile' && (
          <ProfileDetails
            name={profile.name}
            email={profile.email}
            bio={profile.bio ?? ''}
            onEdit={() => setIsEditOpen(true)}
          />
        )}
        {activeTab === 'bookings' && <ProfileBookings />}
        {activeTab === 'favorites' && <ProfileFavorites />}
        {activeTab === 'venues' && <ProfileVenues />}
      </div>
    </main>
  );
}
