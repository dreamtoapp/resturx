'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import db from '@/lib/prisma';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../helpers';

interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  title?: string;
  address: string;
  landmark: string;
  deliveryNote: string;
}

interface SaveLocationResult {
  success: boolean;
  address?: any;
  message: string;
}

/**
 * Save location data from Google Maps to user's addresses
 * This action handles the data from the location form modal
 */
export async function saveLocationAction(locationData: LocationData): Promise<SaveLocationResult> {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لحفظ العنوان',
      };
    }

    const userId = session.user.id;

    // Extract address components from the full address
    const addressComponents = parseAddressFromString(locationData.address);

    // Check if this is the first address (make it default)
    const existingAddresses = await db.address.count({
      where: { userId },
    });

    // Create the address record
    const newAddress = await db.address.create({
      data: {
        userId,
        label: locationData.title || 'المنزل',
        district: addressComponents.district,
        street: addressComponents.street,
        buildingNumber: addressComponents.buildingNumber,
        floor: addressComponents.floor,
        apartmentNumber: addressComponents.apartmentNumber,
        landmark: locationData.landmark || null,
        deliveryInstructions: locationData.deliveryNote || null,
        latitude: locationData.coordinates.lat.toString(),
        longitude: locationData.coordinates.lng.toString(),
        isDefault: existingAddresses === 0, // First address becomes default
      },
    });

    // Revalidate relevant paths
    revalidatePath('/user/addresses');
    revalidatePath('/user/profile');
    revalidatePath('/user/addresses', 'page');

    return {
      success: true,
      address: newAddress,
      message: SUCCESS_MESSAGES.CREATE_ADDRESS,
    };

  } catch (error) {
    console.error('Error saving location:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.CREATE_ADDRESS,
    };
  }
}

/**
 * Parse address string into components
 * Handles Arabic address format: "5279 الثناء، حي مشرفة، جدة"
 */
function parseAddressFromString(addressString: string) {
  // Default values
  const defaultComponents = {
    district: 'غير محدد',
    street: 'غير محدد',
    buildingNumber: 'غير محدد',
    floor: null,
    apartmentNumber: null,
  };

  if (!addressString || addressString.trim() === '') {
    return defaultComponents;
  }

  try {
    // Split by common Arabic separators
    const parts = addressString.split(/[،,]/).map(part => part.trim()).filter(Boolean);

    if (parts.length === 0) {
      return defaultComponents;
    }

    // First part usually contains building number and street
    const firstPart = parts[0];

    // Extract building number (usually starts with numbers)
    const buildingMatch = firstPart.match(/^(\d+)/);
    const buildingNumber = buildingMatch ? buildingMatch[1] : 'غير محدد';

    // Extract street name (after building number)
    const streetName = firstPart.replace(/^\d+\s*/, '').trim() || 'غير محدد';

    // Second part usually contains district
    const district = parts[1] || 'غير محدد';

    // Look for floor and apartment in the address
    const floorMatch = addressString.match(/طابق\s*(\d+)/i);
    const apartmentMatch = addressString.match(/شقة\s*(\d+)/i);

    const floor = floorMatch ? floorMatch[1] : null;
    const apartmentNumber = apartmentMatch ? apartmentMatch[1] : null;

    return {
      district,
      street: streetName,
      buildingNumber,
      floor,
      apartmentNumber,
    };
  } catch (error) {
    console.error('Error parsing address:', error);
    return defaultComponents;
  }
}

/**
 * Get user's saved addresses
 */
export async function getUserAddresses(): Promise<SaveLocationResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'يجب تسجيل الدخول لعرض العناوين',
      };
    }

    const addresses = await db.address.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return {
      success: true,
      address: addresses,
      message: SUCCESS_MESSAGES.FETCH_ADDRESSES,
    };

  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return {
      success: false,
      message: ERROR_MESSAGES.FETCH_ADDRESSES,
    };
  }
}
