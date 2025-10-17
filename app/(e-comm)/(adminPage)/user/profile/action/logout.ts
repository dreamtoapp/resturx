'use server';
import { signOut } from '@/auth';
import { clearCart } from '@/app/(e-comm)/(cart-flow)/cart/actions/cartServerActions';

export const handleLogout = async () => {
  // Clear database cart before logout
  await clearCart();
  console.log('🗄️ Database cart cleared on logout');

  await signOut({ redirectTo: '/auth/login', redirect: true });
}; 