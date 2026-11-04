import { getVenues, type Venue } from '../../../api/venues';

export default async function ShowcaseVenues() {
    const venues: Venue[] = await getVenues();
    
    return (
        <div>
            <h2>Top Rated Venues</h2>
            <ul>
                {venues.map((venue) => (
                    <li key={venue.id}>{venue.name}</li>
                ))}
            </ul>
        </div>
    );
}