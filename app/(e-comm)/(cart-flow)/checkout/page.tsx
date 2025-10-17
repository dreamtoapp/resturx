import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./components/CheckoutClient";
import { getUser } from "./actions/getUser";
import { mergeCartOnCheckout } from "./actions/mergeCartOnCheckout";
import { getAddresses } from "./actions/getAddresses";
import { debug, error } from '@/utils/logger';
import { getCompanyOtpRequirement } from '@/helpers/featureFlags';
import { fetchCompany } from '@/app/dashboard/management/settings/actions/fetchCompany';

type PlatformSettingsPage = {
  taxPercentage: number;
  shippingFee: number;
  minShipping: number;
  requireLocation: boolean;
};

// Read platform settings directly from DB (no API hop)
async function getPlatformSettingsDirect(): Promise<PlatformSettingsPage> {
  try {
    const company = await fetchCompany();
    return {
      taxPercentage: company?.taxPercentage ?? 15,
      shippingFee: company?.shippingFee ?? 25,
      minShipping: company?.minShipping ?? 200,
      // Fallback to true if the new field is not yet in the typed Company
      requireLocation: (company as any)?.requireLocation ?? true,
    };
  } catch (err) {
    error('Error fetching platform settings:', err instanceof Error ? err.message : String(err));
    return { taxPercentage: 15, shippingFee: 25, minShipping: 200, requireLocation: true };
  }
}

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/checkout");
  }

  const [user, cart, addresses, platformSettings, requireOtp] = await Promise.all([
    getUser(session.user.id),
    mergeCartOnCheckout(),
    getAddresses(session.user.id),
    getPlatformSettingsDirect(),
    getCompanyOtpRequirement()
  ]);
  // One concise server-side log for global checkout settings
  debug('Checkout settings', {
    requireOtp,
    requireLocation: platformSettings.requireLocation,
    taxPercentage: platformSettings.taxPercentage,
    shippingFee: platformSettings.shippingFee,
    minShipping: platformSettings.minShipping,
  });

  // Check if database cart is empty, but don't redirect immediately
  // The CheckoutClient will handle Zustand cart as fallback
  if (!cart || !cart.items || cart.items.length === 0) {
    debug("Database cart is empty, will use Zustand cart as fallback");
  }

  if (!user) return null;
  return <CheckoutClient user={user} cart={{
    ...cart, items: (cart?.items ?? []).map(item => ({
      ...item,
      id: item.id,
      product: item.product ? { id: item.product.id, name: item.product.name, price: item.product.price } : null
    }))
  }} addresses={addresses} platformSettings={platformSettings} requireOtp={requireOtp} requireLocation={platformSettings.requireLocation} />;
}
