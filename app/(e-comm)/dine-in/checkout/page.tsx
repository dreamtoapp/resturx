import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CheckoutClient from './components/CheckoutClient';

export default async function DineInCheckoutPage() {
  const session = await auth();
  if (!session) redirect('/auth/signin?callbackUrl=/dine-in/checkout');

  return (
    <div className="container mx-auto py-8">
      <CheckoutClient />
    </div>
  );
}

