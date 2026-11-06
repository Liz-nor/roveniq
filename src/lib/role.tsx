import useUserRole from '../hooks/useUserRole';

export function Role() {
  const role = useUserRole();

return (
    <div>
    {role === 'visitor' && (
        <p>Log in to book this venue.</p>
    )}

    {role === 'customer' && (
        <p>Book now.</p>
    )}

    {role === 'venueManager' && (
        <p>Manage your Venue page.</p>
    )}
    </div>
  );
}