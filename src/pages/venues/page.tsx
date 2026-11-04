import ShowcaseVenues from '../../components/features/home/Venues';
import { emptyFilters } from '../../lib/venueFilters';

export default function VenuesPage() {
    return <ShowcaseVenues filters={emptyFilters} />;
}
