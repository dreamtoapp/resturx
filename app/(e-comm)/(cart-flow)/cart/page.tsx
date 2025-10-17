import CartPageView from './components/CartPageView';
import { getAppConfig } from '@/helpers/appConfig';

// Force dynamic rendering for cart page since it uses cookies/session
export const dynamic = 'force-dynamic';

async function getPlatformSettings() {
  try {
    // Use absolute URL for server-side fetch
    const { appUrl } = await getAppConfig();
    const response = await fetch(`${appUrl}/api/platform-settings`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    // Return default values if API fails
    return {
      taxPercentage: 15,
      shippingFee: 25,
      minShipping: 200
    };
  }
}

export default async function CartPage() {
  const platformSettings = await getPlatformSettings();
  console.log(platformSettings);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <CartPageView platformSettings={platformSettings} />
      </div>
    </div>
  );
}
