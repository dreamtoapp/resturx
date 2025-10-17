import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AddressManagement from './components/AddressManagement';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

async function AddressesPage() {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return redirect('/auth/login');
    }

    // Get Google Maps API key from backend
    const company = await fetchCompany();
    const googleMapsApiKey = company?.googleMapsApiKey || '';

    return <AddressManagement userId={user.id} googleMapsApiKey={googleMapsApiKey} />;
}

export default AddressesPage; 