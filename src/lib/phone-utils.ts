import {
  parsePhoneNumber,
  isValidPhoneNumber,
  CountryCode,
  getCountryCallingCode,
} from 'libphonenumber-js';

// Detect country from phone number
export function detectPhoneCountry(phone: string): CountryCode {
  // Try US first (most common)
  if (isValidPhoneNumber(phone, 'US')) return 'US';

  // Try parsing without country to detect from number
  try {
    const parsed = parsePhoneNumber(phone);
    if (parsed?.country) return parsed.country;
  } catch {
    // Continue to fallback
  }

  // Default to US
  return 'US';
}

// Validate phone number
export function validatePhone(phone: string, country?: CountryCode): {
  isValid: boolean;
  formatted?: string;
  error?: string;
  suggestion?: string;
} {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const targetCountry = country || detectPhoneCountry(phone);

  try {
    if (!isValidPhoneNumber(cleanPhone, targetCountry)) {
      // Try to provide a suggestion
      const digits = cleanPhone.replace(/\D/g, '');
      if (digits.length === 10 && targetCountry === 'US') {
        return {
          isValid: false,
          error: 'Invalid phone number format',
          suggestion: `+1${digits}`,
        };
      }
      return { isValid: false, error: 'Invalid phone number format' };
    }

    const parsed = parsePhoneNumber(cleanPhone, targetCountry);
    if (!parsed) {
      return { isValid: false, error: 'Could not parse phone number' };
    }

    return {
      isValid: true,
      formatted: parsed.formatInternational(),
    };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid phone number',
    };
  }
}

// Format phone number for display
export function formatPhone(phone: string, country?: CountryCode): string {
  const result = validatePhone(phone, country);
  return result.formatted || phone;
}

// Normalize phone for comparison (digits only)
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Generate placeholder phone from name (deterministic)
export function generatePlaceholderPhone(firstName: string, lastName: string): string {
  const seed = `${firstName}${lastName}`.toLowerCase().replace(/[^a-z]/g, '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  const digits = Math.abs(hash).toString().padStart(10, '0').slice(0, 10);
  return `+1${digits.slice(0, 3)}555${digits.slice(3, 7)}`;
}
