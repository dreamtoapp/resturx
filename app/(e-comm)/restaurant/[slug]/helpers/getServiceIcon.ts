export function getServiceIcon(iconName: string): string {
  const icons: Record<string, string> = {
    'Wifi': '📶',
    'Car': '🚗',
    'Utensils': '🍽️',
    'Coffee': '☕',
    'Music': '🎵',
    'Tv': '📺',
    'Accessibility': '♿',
    'Baby': '👶',
    'Parking': '🅿️',
    'default': '✨',
  };
  return icons[iconName] || icons['default'];
}

