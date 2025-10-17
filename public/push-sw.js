// Push Service Worker for Dream To App E-commerce Platform
// Production-safe implementation for 3000+ active users

// Handle incoming push notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('Push data:', data);
      
      const options = {
        body: data.body || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.primaryKey || 1,
          url: data.url || '/'
        },
        actions: [
          {
            action: 'open',
            title: 'Open App',
            icon: '/icons/icon-192x192.png'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/icons/icon-192x192.png'
          }
        ],
        requireInteraction: false,
        silent: false
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Dream To App', options)
      );
    } catch (error) {
      console.error('Error parsing push data:', error);
      // Fallback notification
      const options = {
        body: 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
          url: '/'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification('Dream To App', options)
      );
    }
  } else {
    // Handle text-based push data
    const options = {
      body: event.data ? event.data.text() : 'You have a new notification',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification('Dream To App', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        // Check if app is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          const url = event.notification.data?.url || '/';
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification (already closed above)
    console.log('Notification closed');
  }
});

// Handle notification close events
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
});

// Handle background sync (if needed for offline functionality)
self.addEventListener('sync', function(event) {
  console.log('Background sync event:', event);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks here
      Promise.resolve()
    );
  }
});

// Handle push subscription changes
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Push subscription changed:', event);
  
  event.waitUntil(
    // Re-subscribe to push notifications
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'your-vapid-public-key' // Replace with actual VAPID key
    }).then(function(subscription) {
      console.log('New subscription:', subscription);
      // Send new subscription to server
      return fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
    })
  );
});

// Service worker installation
self.addEventListener('install', function(event) {
  console.log('Push service worker installed');
  self.skipWaiting();
});

// Service worker activation
self.addEventListener('activate', function(event) {
  console.log('Push service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle messages from main thread
self.addEventListener('message', function(event) {
  console.log('Message received in push service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Push service worker loaded successfully');
