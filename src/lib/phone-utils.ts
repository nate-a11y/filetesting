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

  let cleanPhone = phone.replace(/[^\d+]/g, '');

  // Convert 00 international dialing prefix to +
  if (cleanPhone.startsWith('00') && !cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone.slice(2);
  }

  const targetCountry = country || detectPhoneCountry(cleanPhone);

  try {
    // First try: validate the cleaned phone with detected country
    if (isValidPhoneNumber(cleanPhone, targetCountry)) {
      const parsed = parsePhoneNumber(cleanPhone, targetCountry);
      if (parsed) {
        return { isValid: true, formatted: parsed.formatInternational() };
      }
    }

    // Second try: parse with original string (spaces help libphonenumber handle trunk prefixes)
    try {
      const parsed = parsePhoneNumber(phone.trim());
      if (parsed?.isValid()) {
        return { isValid: true, formatted: parsed.formatInternational() };
      }
    } catch {
      // Continue to next attempt
    }

    // Third try: auto-detect from cleaned phone (handles +CC formats)
    if (cleanPhone.startsWith('+')) {
      try {
        const parsed = parsePhoneNumber(cleanPhone);
        if (parsed?.isValid()) {
          return { isValid: true, formatted: parsed.formatInternational() };
        }
      } catch {
        // Continue to suggestion
      }
    }

    // Suggestion for 10-digit US numbers
    const digits = cleanPhone.replace(/\D/g, '');
    if (digits.length === 10 && targetCountry === 'US') {
      return {
        isValid: false,
        error: 'Invalid phone number format',
        suggestion: `+1${digits}`,
      };
    }
    return { isValid: false, error: 'Invalid phone number format' };
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
