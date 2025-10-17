import NextAuth from 'next-auth';
import { Adapter } from 'next-auth/adapters';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { getAccountById, getUserById } from './app/(e-comm)/(adminPage)/auth/action';
import authConfig from './auth.config';
import db from './lib/prisma';

// Function to get NextAuth config with database URL
async function getNextAuthConfig() {
  let callbackUrl = 'http://localhost:3000'; // Default fallback

  try {
    const company = await db.company.findFirst({ select: { authCallbackUrl: true } });
    if (company?.authCallbackUrl) {
      callbackUrl = company.authCallbackUrl;
      if (callbackUrl && callbackUrl.trim() !== '') {
        // console.log('✅ Using auth callback URL from database:', callbackUrl);
        process.env.NEXTAUTH_URL = callbackUrl;
      }
    } else {
      // console.log('⚠️ No auth callback URL in database, using fallback:', callbackUrl);
      process.env.NEXTAUTH_URL = callbackUrl;
    }
  } catch (error) {
    // console.error('❌ Failed to read auth callback URL from DB:', error);
    // console.log('⚠️ Using fallback auth callback URL:', callbackUrl);
    process.env.NEXTAUTH_URL = callbackUrl;
  }

  return NextAuth({
    trustHost: true,
    adapter: PrismaAdapter(db) as Adapter,
    session: { strategy: 'jwt' },
    basePath: '/api/auth',
    ...authConfig,
    callbacks: {
      async jwt({ token, trigger }) {
        if (trigger === 'update' && token.sub) {
          const existingUser = await getUserById(token.sub);
          if (existingUser) {
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.image = existingUser.image;
            token.phone = existingUser.phone;
            token.role = existingUser.role;
          }
          return token;
        }

        if (!token.sub) return token;
        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;

        const existAccuount = await getAccountById(existingUser.id);

        token.isOauth = !!existAccuount;
        token.id = existingUser.id;
        token.role = existingUser.role;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.phone = existingUser.phone;
        token.image = existingUser.image;
        token.isOtp = existingUser.isOtp;

        return token;
      },
      async session({ token, session }: { token: any; session: any }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id as string | undefined,
            role: token.role as string | undefined,
            name: token.name as string | null | undefined,
            email: token.email as string | null | undefined,
            phone: token.phone as string | undefined,
            image: token.image as string | undefined,
            isOtp: token.isOtp as boolean | undefined,
            isOauth: token.isOauth as boolean | undefined,
          },
        };
      },
    },
  });
}

// Get the NextAuth instance
const nextAuthInstance = await getNextAuthConfig();

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = nextAuthInstance;
