// Function to get Pusher configuration from database via API
async function getPusherConfigFromAPI() {
  try {
    const response = await fetch('/api/pusher/config', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch Pusher config from API:', response.status);
      return null;
    }

    const config = await response.json();

    // Check if Pusher is properly configured
    if (!config.isConfigured || !config.pusherKey || !config.pusherCluster) {
      console.warn('Pusher not configured - real-time notifications disabled');
      return null;
    }

    return {
      key: config.pusherKey,
      cluster: config.pusherCluster,
    };
  } catch (error) {
    console.error('Error fetching Pusher config from API:', error);
    return null;
  }
}

export async function getPusherClient() {
  // Try to get config from database via API
  const config = await getPusherConfigFromAPI();

  if (!config) {
    console.warn('Pusher not configured - real-time notifications disabled');
    return null;
  }

  const Pusher = (await import('pusher-js')).default;
  return new Pusher(config.key, {
    cluster: config.cluster,
  });
}
