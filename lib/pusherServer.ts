import PusherServer from 'pusher';
import db from '@/lib/prisma';

// Function to get Pusher configuration from database
async function getPusherConfig() {
  try {
    const company = await db.company.findFirst({
      select: {
        pusherAppId: true,
        pusherKey: true,
        pusherSecret: true,
        pusherCluster: true,
      },
    });

    if (!company) {
      console.warn('No company found in database for Pusher configuration');
      return null;
    }

    const { pusherAppId, pusherKey, pusherSecret, pusherCluster } = company;

    // Check if all required Pusher fields are configured
    if (!pusherAppId || !pusherKey || !pusherSecret || !pusherCluster) {
      console.warn('Incomplete Pusher configuration in database:', {
        hasAppId: !!pusherAppId,
        hasKey: !!pusherKey,
        hasSecret: !!pusherSecret,
        hasCluster: !!pusherCluster,
      });
      return null;
    }

    return {
      appId: pusherAppId,
      key: pusherKey,
      secret: pusherSecret,
      cluster: pusherCluster,
      useTLS: true,
    };
  } catch (error) {
    console.error('Error fetching Pusher configuration from database:', error);
    return null;
  }
}

// Create Pusher server instance with database configuration
let pusherServer: PusherServer | null = null;

export async function getPusherServer(): Promise<PusherServer | null> {
  if (pusherServer) {
    return pusherServer;
  }

  const config = await getPusherConfig();
  if (config) {
    pusherServer = new PusherServer(config);
    return pusherServer;
  }

  return null;
}

// Fallback export for backward compatibility - returns null if not configured
export { pusherServer };

// import PusherServer from 'pusher';

// export const pusherServer = new PusherServer({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
// });
