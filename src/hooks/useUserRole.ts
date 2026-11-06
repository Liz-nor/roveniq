import { useAuthStore } from '../lib/authStore';

export default function useUserRole() {
    const user = useAuthStore((state) => state.user);

    if(!user) return 'visitor';

    if(user.venueManager) return 'venueManager';
    return 'customer';
}