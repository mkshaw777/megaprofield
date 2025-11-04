// GPS and Location Utilities with Error Handling

import { GeoLocation } from './types';

export interface GPSError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED';
  message: string;
  fallbackAvailable: boolean;
}

export interface GPSResult {
  success: boolean;
  location?: GeoLocation;
  error?: GPSError;
}

/**
 * Get current location with high accuracy
 * Implements robust error handling and fallback mechanisms
 */
export async function getCurrentLocation(options: {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
} = {}): Promise<GPSResult> {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    return {
      success: false,
      error: {
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by your browser',
        fallbackAvailable: false,
      },
    };
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options,
  };

  try {
    // Try high-accuracy location first
    const position = await getPosition(defaultOptions);
    const location = await parsePosition(position, true);
    
    return {
      success: true,
      location,
    };
  } catch (error: any) {
    console.error('High-accuracy GPS failed:', error);

    // Try fallback with network-based location
    if (error.code === 1) {
      // Permission denied
      return {
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: 'Location permission denied. Please enable location access in your browser settings.',
          fallbackAvailable: false,
        },
      };
    }

    // Try fallback with lower accuracy
    try {
      const fallbackPosition = await getPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000, // Accept cached location up to 1 minute old
      });
      
      const location = await parsePosition(fallbackPosition, false);
      
      return {
        success: true,
        location,
      };
    } catch (fallbackError: any) {
      return handleGPSError(fallbackError);
    }
  }
}

/**
 * Get position using Geolocation API
 */
function getPosition(options: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

/**
 * Parse GeolocationPosition to GeoLocation
 */
async function parsePosition(
  position: GeolocationPosition,
  isHighAccuracy: boolean
): Promise<GeoLocation> {
  const { latitude, longitude, accuracy } = position.coords;
  
  // Try to get address via reverse geocoding (optional)
  let address: string | undefined;
  try {
    address = await reverseGeocode(latitude, longitude);
  } catch (e) {
    console.warn('Reverse geocoding failed:', e);
  }

  return {
    lat: latitude,
    lng: longitude,
    address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    timestamp: position.timestamp,
    accuracy: accuracy,
  };
}

/**
 * Reverse geocode coordinates to address
 * Using OpenStreetMap Nominatim API (free, no API key required)
 */
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Megapro-SFA-App',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

/**
 * Handle GPS errors
 */
function handleGPSError(error: GeolocationPositionError): GPSResult {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        success: false,
        error: {
          code: 'PERMISSION_DENIED',
          message: 'Location permission denied. Please enable location access.',
          fallbackAvailable: false,
        },
      };
    case error.POSITION_UNAVAILABLE:
      return {
        success: false,
        error: {
          code: 'POSITION_UNAVAILABLE',
          message: 'Location information unavailable. Please check your GPS signal.',
          fallbackAvailable: true,
        },
      };
    case error.TIMEOUT:
      return {
        success: false,
        error: {
          code: 'TIMEOUT',
          message: 'Location request timed out. Please try again.',
          fallbackAvailable: true,
        },
      };
    default:
      return {
        success: false,
        error: {
          code: 'POSITION_UNAVAILABLE',
          message: 'An unknown error occurred while getting location.',
          fallbackAvailable: true,
        },
      };
  }
}

/**
 * Calculate distance between two GPS coordinates (in km)
 * Using Haversine formula
 */
export function calculateDistance(
  loc1: GeoLocation,
  loc2: GeoLocation
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
    Math.cos(toRad(loc2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Watch position for real-time tracking
 */
export function watchLocation(
  callback: (location: GeoLocation) => void,
  errorCallback: (error: GPSError) => void
): number {
  if (!navigator.geolocation) {
    errorCallback({
      code: 'NOT_SUPPORTED',
      message: 'Geolocation not supported',
      fallbackAvailable: false,
    });
    return -1;
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const location = await parsePosition(position, true);
      callback(location);
    },
    (error) => {
      const result = handleGPSError(error);
      if (result.error) {
        errorCallback(result.error);
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
  );

  return watchId;
}

/**
 * Stop watching location
 */
export function stopWatchingLocation(watchId: number): void {
  if (watchId !== -1) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Request location permission
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const result = await getCurrentLocation();
    return result.success;
  } catch (error) {
    return false;
  }
}

/**
 * Format location for display
 */
export function formatLocation(location: GeoLocation): string {
  if (location.address) {
    return location.address;
  }
  return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
}

/**
 * Check if location is within range (in meters)
 */
export function isWithinRange(
  loc1: GeoLocation,
  loc2: GeoLocation,
  rangeMeters: number
): boolean {
  const distanceKm = calculateDistance(loc1, loc2);
  const distanceMeters = distanceKm * 1000;
  return distanceMeters <= rangeMeters;
}
