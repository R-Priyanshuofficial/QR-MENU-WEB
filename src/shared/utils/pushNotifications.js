/**
 * Browser Push Notifications (works even when website is closed!)
 */

// Request permission for push notifications
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Show browser notification (works even when tab is closed!)
export const showBrowserNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      requireInteraction: true, // Stays until user clicks
      ...options,
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  } else {
    console.warn('Notification permission not granted');
  }
};

// Show notification with sound
export const showNotificationWithSound = (title, options = {}) => {
  // Play notification sound
  try {
    const audio = new Audio('/notification-sound.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Sound play failed:', err));
  } catch (error) {
    console.log('Audio not available');
  }

  // Show browser notification
  return showBrowserNotification(title, options);
};

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

// Get current permission status
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Convert VAPID base64 key to UInt8Array
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

// Register Service Worker and subscribe to Push
export const registerPushSubscription = async (meta = {}) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push not supported')
    return null
  }

  const granted = await requestNotificationPermission()
  if (!granted) return null

  const registration = await navigator.serviceWorker.register('/service-worker.js')

  // Fetch VAPID public key from backend
  const { default: api } = await import('../api/axios')
  const res = await api.get('/push/public-key')
  const publicKey = res?.data?.publicKey || res?.data?.data?.publicKey || res?.publicKey || ''
  if (!publicKey) throw new Error('Missing VAPID public key')

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

  // Flatten for backend and attach metadata (userId or phone)
  const payload = {
    endpoint: subscription.endpoint,
    keys: subscription.toJSON().keys,
    ...meta,
  }
  await api.post('/push/subscribe', payload)
  return subscription
}
