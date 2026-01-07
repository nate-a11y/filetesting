import type { ColumnMapping } from '@/types/schemas';
import { formatPhone, validatePhone } from './phone-utils';

// LimoAnywhere contact column mappings
export const LIMOANYWHERE_CONTACT_MAPPINGS: ColumnMapping[] = [
  { sourceColumn: 'First Name', targetField: 'firstName' },
  { sourceColumn: 'Last Name', targetField: 'lastName' },
  { sourceColumn: 'Cell Phone', targetField: 'mobilePhone' },
  { sourceColumn: 'Email', targetField: 'email' },
  // Alternative column names for phone (will use fallback logic: cellular > home > office)
  { sourceColumn: 'Mobile Phone', targetField: 'mobilePhone' },
  { sourceColumn: 'Cellular Phone', targetField: 'mobilePhone' },
  { sourceColumn: 'Cellular', targetField: 'mobilePhone' },
  { sourceColumn: 'Phone', targetField: 'mobilePhone' },
  // Fallback phone columns (captured for fallback logic)
  { sourceColumn: 'Home Phone', targetField: '_homePhone' },
  { sourceColumn: 'Home', targetField: '_homePhone' },
  { sourceColumn: 'Office Phone', targetField: '_officePhone' },
  { sourceColumn: 'Office', targetField: '_officePhone' },
  { sourceColumn: 'Work Phone', targetField: '_officePhone' },
  { sourceColumn: 'Business Phone', targetField: '_officePhone' },
  { sourceColumn: 'E-mail', targetField: 'email' },
  { sourceColumn: 'EmailAddress', targetField: 'email' },
  { sourceColumn: 'Email Address', targetField: 'email' },
  { sourceColumn: 'Email Addresses', targetField: 'email' },
  { sourceColumn: 'Emails', targetField: 'email' },
  { sourceColumn: 'Home Address', targetField: 'homeAddress' },
  { sourceColumn: 'Work Address', targetField: 'workAddress' },
  { sourceColumn: 'Address', targetField: 'homeAddress' },
  // Address components (for smart address building)
  { sourceColumn: 'Primary Address', targetField: '_street' },
  { sourceColumn: 'Street', targetField: '_street' },
  { sourceColumn: 'City', targetField: '_city' },
  { sourceColumn: 'State', targetField: '_state' },
  { sourceColumn: 'Zip', targetField: '_zip' },
  { sourceColumn: 'Country', targetField: '_country' },
  // Company name (useful for context)
  { sourceColumn: 'Company Name', targetField: '_companyName' },
];

// LimoAnywhere reservation column mappings
export const LIMOANYWHERE_RESERVATION_MAPPINGS: ColumnMapping[] = [
  { sourceColumn: 'Confirmation #', targetField: 'confirmationNumber' },
  { sourceColumn: 'Confirmation Number', targetField: 'confirmationNumber' },
  { sourceColumn: 'Conf #', targetField: 'confirmationNumber' },
  { sourceColumn: 'Conf#', targetField: 'confirmationNumber' },
  { sourceColumn: 'Trip #', targetField: 'confirmationNumber' },
  { sourceColumn: 'Trip Number', targetField: 'confirmationNumber' },
  { sourceColumn: 'Reservation #', targetField: 'confirmationNumber' },
  // Dates and times
  { sourceColumn: 'Pick Up Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Pickup Date', targetField: 'pickUpDate' },
  { sourceColumn: 'PU Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Trip Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Pick Up Time', targetField: 'pickUpTime' },
  { sourceColumn: 'Pickup Time', targetField: 'pickUpTime' },
  { sourceColumn: 'PU Time', targetField: 'pickUpTime' },
  { sourceColumn: 'Time', targetField: 'pickUpTime' },
  { sourceColumn: 'Drop Off Date', targetField: 'dropOffDate' },
  { sourceColumn: 'Dropoff Date', targetField: 'dropOffDate' },
  { sourceColumn: 'DO Date', targetField: 'dropOffDate' },
  { sourceColumn: 'Drop Off Time', targetField: 'dropOffTime' },
  { sourceColumn: 'Dropoff Time', targetField: 'dropOffTime' },
  { sourceColumn: 'DO Time', targetField: 'dropOffTime' },
  // Service/Order type
  { sourceColumn: 'Service Type', targetField: 'orderType' },
  { sourceColumn: 'Trip Type', targetField: 'orderType' },
  { sourceColumn: 'Order Type', targetField: 'orderType' },
  { sourceColumn: 'Type', targetField: 'orderType' },
  { sourceColumn: 'Service', targetField: 'orderType' },
  // Passengers - note the various formats from LimoAnywhere
  { sourceColumn: 'Passengers', targetField: 'totalGroupSize' },
  { sourceColumn: 'Pax', targetField: 'totalGroupSize' },
  { sourceColumn: 'Pax #', targetField: 'totalGroupSize' },
  { sourceColumn: 'Pax#', targetField: 'totalGroupSize' },
  { sourceColumn: '# Pax', targetField: 'totalGroupSize' },
  { sourceColumn: '#Pax', targetField: 'totalGroupSize' },
  { sourceColumn: 'Group Size', targetField: 'totalGroupSize' },
  { sourceColumn: 'Number of Passengers', targetField: 'totalGroupSize' },
  // Addresses
  { sourceColumn: 'Pick Up Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pickup Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'PU Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'From', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pick Up', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pickup', targetField: 'pickUpAddress' },
  { sourceColumn: 'Origin', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pick Up Notes', targetField: 'pickUpNotes' },
  { sourceColumn: 'PU Notes', targetField: 'pickUpNotes' },
  { sourceColumn: 'Pickup Notes', targetField: 'pickUpNotes' },
  { sourceColumn: 'Drop Off Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'Drop-Off Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'Dropoff Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'DO Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'To', targetField: 'dropOffAddress' },
  { sourceColumn: 'Drop Off', targetField: 'dropOffAddress' },
  { sourceColumn: 'Drop-Off', targetField: 'dropOffAddress' },
  { sourceColumn: 'Dropoff', targetField: 'dropOffAddress' },
  { sourceColumn: 'Destination', targetField: 'dropOffAddress' },
  { sourceColumn: 'Drop Off Notes', targetField: 'dropOffNotes' },
  { sourceColumn: 'Drop-Off Notes', targetField: 'dropOffNotes' },
  { sourceColumn: 'DO Notes', targetField: 'dropOffNotes' },
  { sourceColumn: 'Dropoff Notes', targetField: 'dropOffNotes' },
  // Booking contact - various LimoAnywhere column names
  { sourceColumn: 'Booking First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Booker First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Customer First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Billing First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Account First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Booking Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Booker Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Customer Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Billing Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Account Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Booking Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Booker Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Customer Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Billing Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Account Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Booking Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Booker Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Customer Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Billing Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Account Phone', targetField: 'bookingContactPhoneNumber' },
  // Full name fields (will be split during transformation)
  { sourceColumn: 'Customer Name', targetField: '_bookingFullName' },
  { sourceColumn: 'Billing Name', targetField: '_bookingFullName' },
  { sourceColumn: 'Account Name', targetField: '_bookingFullName' },
  { sourceColumn: 'Booker Name', targetField: '_bookingFullName' },
  { sourceColumn: 'Billing Contact', targetField: '_bookingFullName' },
  // Trip/Passenger contact
  { sourceColumn: 'Passenger First Name', targetField: 'tripContactFirstName' },
  { sourceColumn: 'Rider First Name', targetField: 'tripContactFirstName' },
  { sourceColumn: 'Passenger Last Name', targetField: 'tripContactLastName' },
  { sourceColumn: 'Rider Last Name', targetField: 'tripContactLastName' },
  { sourceColumn: 'Passenger Email', targetField: 'tripContactEmail' },
  { sourceColumn: 'Rider Email', targetField: 'tripContactEmail' },
  { sourceColumn: 'Passenger Phone', targetField: 'tripContactPhoneNumber' },
  { sourceColumn: 'Rider Phone', targetField: 'tripContactPhoneNumber' },
  // Full passenger name (will be split)
  { sourceColumn: 'Passenger Name', targetField: '_passengerFullName' },
  { sourceColumn: 'Rider Name', targetField: '_passengerFullName' },
  { sourceColumn: 'Passenger', targetField: '_passengerFullName' },
  { sourceColumn: 'Lead Passenger', targetField: '_passengerFullName' },
  // Vehicle
  { sourceColumn: 'Vehicle', targetField: 'vehicle' },
  { sourceColumn: 'Vehicle Type', targetField: 'vehicle' },
  { sourceColumn: 'Primary Vehicle', targetField: 'vehicle' },
  { sourceColumn: 'Car Type', targetField: 'vehicle' },
  { sourceColumn: 'Car', targetField: 'vehicle' },
  { sourceColumn: 'Vehicle Class', targetField: 'vehicle' },
  // Notes and rate
  { sourceColumn: 'Trip Notes', targetField: 'tripNotes' },
  { sourceColumn: 'Notes', targetField: 'tripNotes' },
  { sourceColumn: 'Special Instructions', targetField: 'tripNotes' },
  { sourceColumn: 'Comments', targetField: 'tripNotes' },
  { sourceColumn: 'Base Rate', targetField: 'baseRateAmt' },
  { sourceColumn: 'Rate', targetField: 'baseRateAmt' },
  { sourceColumn: 'Price', targetField: 'baseRateAmt' },
  { sourceColumn: 'Trip Total', targetField: 'baseRateAmt' },
  { sourceColumn: 'Total', targetField: 'baseRateAmt' },
  { sourceColumn: 'Amount', targetField: 'baseRateAmt' },
  // Stops
  { sourceColumn: 'Stop 1', targetField: 'stop1Address' },
  { sourceColumn: 'Stop 1 Address', targetField: 'stop1Address' },
  { sourceColumn: 'Stop 2', targetField: 'stop2Address' },
  { sourceColumn: 'Stop 2 Address', targetField: 'stop2Address' },
  { sourceColumn: 'Stop 3', targetField: 'stop3Address' },
  { sourceColumn: 'Stop 3 Address', targetField: 'stop3Address' },
];

// Map LimoAnywhere service types to our orderType values
const ORDER_TYPE_MAP: Record<string, string> = {
  // Airport variants
  'airport': 'airport',
  'airport transfer': 'airport',
  'airport pickup': 'airport-pick-up',
  'airport pick up': 'airport-pick-up',
  'airport pick-up': 'airport-pick-up',
  'airport dropoff': 'airport-drop-off',
  'airport drop off': 'airport-drop-off',
  'airport drop-off': 'airport-drop-off',
  'to airport': 'airport-drop-off',
  'from airport': 'airport-pick-up',
  // Point to point
  'point to point': 'point-to-point',
  'point-to-point': 'point-to-point',
  'p2p': 'point-to-point',
  'transfer': 'point-to-point',
  'one way': 'point-to-point',
  'one-way': 'point-to-point',
  // Hourly/Charter/Shuttle
  'hourly': 'leisure',
  'hourly/as directed': 'leisure',
  'as directed': 'leisure',
  'charter': 'leisure',
  'shuttle': 'point-to-point',
  'rental': 'leisure',
  'tour retail': 'retail',
  'retail': 'retail',
  // Wedding
  'wedding': 'wedding',
  'wedding transfer': 'wedding',
  // Corporate
  'corporate': 'corporate',
  'business': 'business-trip',
  'business trip': 'business-trip',
  'executive': 'corporate',
  // Events
  'concert': 'concert',
  'sporting event': 'sporting-event',
  'sports': 'sporting-event',
  'game': 'sporting-event',
  'football': 'football',
  'baseball': 'baseball',
  'basketball': 'basketball',
  'hockey': 'hockey',
  'golf': 'golf',
  // Special occasions
  'prom': 'prom-homecoming',
  'homecoming': 'prom-homecoming',
  'graduation': 'graduation',
  'birthday': 'birthday',
  'anniversary': 'special-occasion',
  'night out': 'night-out',
  'night-out': 'night-out',
  'bachelor': 'bachelor-bachelorette',
  'bachelorette': 'bachelor-bachelorette',
  'bachelor party': 'bachelor-bachelorette',
  'bachelorette party': 'bachelor-bachelorette',
  // Tours
  'wine tour': 'wine-tour',
  'wine tasting': 'wine-tour',
  'brewery tour': 'brew-tour',
  'brew tour': 'brew-tour',
  // Medical
  'medical': 'medical',
  'hospital': 'medical',
  'doctor': 'medical',
  // Seaport/Train
  'seaport': 'seaport',
  'cruise': 'seaport',
  'cruise terminal': 'seaport',
  'train': 'train-station',
  'train station': 'train-station',
  'amtrak': 'train-station',
  // Funeral
  'funeral': 'funeral',
  'memorial': 'funeral',
  // School
  'school': 'school',
  'field trip': 'field-trip',
  // Other
  'personal': 'personal-trip',
  'other': 'point-to-point',
  'miscellaneous': 'point-to-point',
  'misc': 'point-to-point',
};

// Transform orderType from LimoAnywhere format to our format
function transformOrderType(value: string | undefined): string {
  if (!value?.trim()) return 'point-to-point'; // Default

  const normalized = value.trim().toLowerCase();

  // Check exact match first
  if (ORDER_TYPE_MAP[normalized]) {
    return ORDER_TYPE_MAP[normalized];
  }

  // Check partial matches
  for (const [key, mapped] of Object.entries(ORDER_TYPE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return mapped;
    }
  }

  // Default fallback
  return 'point-to-point';
}

// Split a full name into first and last name
function splitFullName(fullName: string | undefined): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: '', lastName: '' };

  const cleaned = fullName.trim();
  const parts = cleaned.split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  // First word is first name, rest is last name
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

// Apply transformations specific to reservation data
export function applyReservationTransforms(data: Record<string, string>[]): Record<string, string>[] {
  return data.map(row => {
    const result = { ...row };

    // === ORDER TYPE TRANSFORMATION ===
    if (result.orderType) {
      result.orderType = transformOrderType(result.orderType);
    } else {
      result.orderType = 'point-to-point';
    }

    // === TOTAL GROUP SIZE DEFAULT ===
    if (!result.totalGroupSize?.trim() || result.totalGroupSize === '0') {
      result.totalGroupSize = '1';
    }

    // === SPLIT FULL NAMES ===
    // Passenger/Trip contact from full name
    if (result._passengerFullName && (!result.tripContactFirstName || !result.tripContactLastName)) {
      const { firstName, lastName } = splitFullName(result._passengerFullName);
      if (!result.tripContactFirstName) result.tripContactFirstName = firstName;
      if (!result.tripContactLastName) result.tripContactLastName = lastName || firstName; // Use firstName as lastName if missing
    }

    // Booking contact from full name
    if (result._bookingFullName && (!result.bookingContactFirstName || !result.bookingContactLastName)) {
      const { firstName, lastName } = splitFullName(result._bookingFullName);
      if (!result.bookingContactFirstName) result.bookingContactFirstName = firstName;
      if (!result.bookingContactLastName) result.bookingContactLastName = lastName || firstName;
    }

    // === COPY BOOKING TO TRIP IF TRIP IS MISSING ===
    if (!result.tripContactFirstName && result.bookingContactFirstName) {
      result.tripContactFirstName = result.bookingContactFirstName;
    }
    if (!result.tripContactLastName && result.bookingContactLastName) {
      result.tripContactLastName = result.bookingContactLastName;
    }
    if (!result.tripContactEmail && result.bookingContactEmail) {
      result.tripContactEmail = result.bookingContactEmail;
    }
    if (!result.tripContactPhoneNumber && result.bookingContactPhoneNumber) {
      result.tripContactPhoneNumber = result.bookingContactPhoneNumber;
    }

    // === COPY TRIP TO BOOKING IF BOOKING IS MISSING ===
    if (!result.bookingContactFirstName && result.tripContactFirstName) {
      result.bookingContactFirstName = result.tripContactFirstName;
    }
    if (!result.bookingContactLastName && result.tripContactLastName) {
      result.bookingContactLastName = result.tripContactLastName;
    }
    if (!result.bookingContactEmail && result.tripContactEmail) {
      result.bookingContactEmail = result.tripContactEmail;
    }
    if (!result.bookingContactPhoneNumber && result.tripContactPhoneNumber) {
      result.bookingContactPhoneNumber = result.tripContactPhoneNumber;
    }

    // === FORMAT PHONE NUMBERS ===
    if (result.bookingContactPhoneNumber) {
      result.bookingContactPhoneNumber = cleanPhoneNumber(result.bookingContactPhoneNumber) || PLACEHOLDER_PHONE;
    } else {
      result.bookingContactPhoneNumber = PLACEHOLDER_PHONE;
    }

    if (result.tripContactPhoneNumber) {
      result.tripContactPhoneNumber = cleanPhoneNumber(result.tripContactPhoneNumber) || PLACEHOLDER_PHONE;
    } else {
      result.tripContactPhoneNumber = PLACEHOLDER_PHONE;
    }

    // === CLEANUP TEMP FIELDS ===
    delete result._passengerFullName;
    delete result._bookingFullName;

    return result;
  });
}

// Phone fallback placeholder
export const PLACEHOLDER_PHONE = '+1 555-555-5555';

// US State codes for validation
const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

// Common city names that mistakenly end up in State column
const COMMON_CITIES = new Set([
  'seattle', 'bellevue', 'redmond', 'tacoma', 'spokane', 'vancouver',
  'portland', 'san francisco', 'los angeles', 'new york', 'chicago',
  'boston', 'denver', 'phoenix', 'dallas', 'houston', 'atlanta',
  'miami', 'orlando', 'las vegas', 'san diego', 'austin', 'sammamish',
  'kirkland', 'renton', 'kent', 'bothell', 'woodinville', 'issaquah'
]);

// Non-person first names (accounting/business entries)
const NON_PERSON_NAMES = new Set([
  'payable', 'billing', 'accounts', 'receivable', 'shuttle', 'bus',
  'van', 'driver', 'office', 'admin', 'dispatch', 'reservation',
  'reservations', 'booking', 'bookings', 'fleet', 'maintenance'
]);

// Garbage address patterns
const GARBAGE_ADDRESS_PATTERNS = [
  /^tbd$/i, /^hotel\s*tbd$/i, /^address\s*tbd$/i, /^tba$/i,
  /^n\/?a$/i, /^unknown$/i, /^pending$/i, /restaurant\s+in\s+/i
];

// Format and clean a phone number - returns formatted number or placeholder if invalid
function cleanPhoneNumber(phone: string | undefined): string {
  if (!phone?.trim()) return '';

  const cleaned = phone.trim();
  const validation = validatePhone(cleaned);

  if (validation.isValid && validation.formatted) {
    return validation.formatted;
  }

  // Try with suggestion (adds +1 for 10-digit US numbers)
  if (validation.suggestion) {
    const retryValidation = validatePhone(validation.suggestion);
    if (retryValidation.isValid && retryValidation.formatted) {
      return retryValidation.formatted;
    }
  }

  // Return original if we can't format it - validation will catch it later
  return cleaned;
}

// Apply all data transformations
export function applyPhoneFallback(data: Record<string, string>[]): Record<string, string>[] {
  return data
    // First, filter out records with no first AND last name
    .filter(row => {
      const firstName = row.firstName?.trim();
      const lastName = row.lastName?.trim();
      // Keep record only if it has at least one name part
      // After name cleaning, we'll check again
      return firstName || lastName;
    })
    .map(row => {
      const result = { ...row };

      // === NAME CLEANING (do this first so we can check again) ===
      // Handle full name in firstName field
      if (result.firstName?.includes(' ') && (!result.lastName || result.lastName.match(/^[\(&-]/))) {
        const parts = result.firstName.split(/\s+/);
        if (parts.length >= 2) {
          result.firstName = parts[0];
          result.lastName = parts.slice(1).join(' ');
        }
      }

      // Clean lastName starting with special chars
      if (result.lastName?.match(/^[\(&-\s]+/)) {
        result.lastName = result.lastName.replace(/^[\(&-\s]+/, '').replace(/[\)]+$/, '').trim();
      }

      // Mark non-person entries
      if (result.firstName && NON_PERSON_NAMES.has(result.firstName.toLowerCase())) {
        result._isBusinessEntry = 'true';
      }

      // === PHONE FALLBACK + FORMATTING ===
      let phoneToUse = result.mobilePhone?.trim() || '';

      if (!phoneToUse) {
        if (result._homePhone?.trim()) {
          phoneToUse = result._homePhone;
        } else if (result._officePhone?.trim()) {
          phoneToUse = result._officePhone;
        }
      }

      // Format the phone number if we have one, otherwise use placeholder
      if (phoneToUse) {
        result.mobilePhone = cleanPhoneNumber(phoneToUse);
      } else {
        result.mobilePhone = PLACEHOLDER_PHONE;
      }

      // === EMAIL: Take first if multiple ===
      if (result.email?.includes(';')) {
        const emails = result.email.split(';').map(e => e.trim()).filter(Boolean);
        result.email = emails[0] || '';
      }

      // === ADDRESS BUILDING ===
      if (!result.homeAddress && (result._street || result._city || result._state)) {
        let street = result._street?.trim() || '';
        let city = result._city?.trim() || '';
        let state = result._state?.trim() || '';
        let zip = result._zip?.trim() || '';

        // Check for garbage address
        if (street && GARBAGE_ADDRESS_PATTERNS.some(p => p.test(street))) {
          street = '';
        }

        // Detect city in state column (common LimoAnywhere issue)
        if (state && COMMON_CITIES.has(state.toLowerCase())) {
          // "state" is actually a city, "zip" might be state
          if (zip && US_STATES.has(zip.toUpperCase())) {
            city = city || state;
            state = zip;
            zip = '';
          } else {
            city = city || state;
            state = '';
          }
        }

        // Normalize state to uppercase
        if (state && US_STATES.has(state.toUpperCase())) {
          state = state.toUpperCase();
        }

        // Build final address
        const parts = [street, city, state, zip].filter(Boolean);
        result.homeAddress = parts.join(', ');
      }

      // === CLEANUP TEMP FIELDS ===
      delete result._homePhone;
      delete result._officePhone;
      delete result._street;
      delete result._city;
      delete result._state;
      delete result._zip;
      delete result._country;
      delete result._companyName;

      return result;
    })
    // Final filter: drop records that still don't have both first and last name after cleaning
    .filter(row => {
      const firstName = row.firstName?.trim();
      const lastName = row.lastName?.trim();
      return firstName && lastName;
    });
}

// Auto-detect LimoAnywhere format from headers
export function detectLimoAnywhereFormat(headers: string[]): boolean {
  const limoKeywords = [
    'Pick Up Date', 'Pickup Date', 'PU Date', 'PU Time',
    'Pick Up Address', 'Pickup Address', 'PU Address',
    'Confirmation #', 'Conf #', 'Conf#',
    'Cell Phone', 'Mobile Phone', 'Cellular Phone',
    'Email Addresses', 'Account Type', 'Account Number',
    'Primary Address', 'Pax #', 'Service Type', 'Vehicle Type',
    'Passenger Name', 'Billing Contact', 'Trip Total'
  ];

  const matchCount = headers.filter(h =>
    limoKeywords.some(kw => h.toLowerCase().includes(kw.toLowerCase()))
  ).length;

  return matchCount >= 2;
}

// Auto-map columns based on headers
export function autoMapColumns(
  headers: string[],
  targetFields: string[],
  knownMappings: ColumnMapping[]
): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];
  const usedHeaders = new Set<string>();

  // First, apply known mappings
  knownMappings.forEach((mapping) => {
    if (headers.includes(mapping.sourceColumn) && !usedHeaders.has(mapping.sourceColumn)) {
      mappings.push(mapping);
      usedHeaders.add(mapping.sourceColumn);
    }
  });

  // Then, try to match remaining fields by similarity
  targetFields.forEach((field) => {
    if (mappings.some((m) => m.targetField === field)) return;

    // Try exact match (case insensitive)
    const exactMatch = headers.find(
      (h) => h.toLowerCase().replace(/[^a-z]/g, '') === field.toLowerCase().replace(/[^a-z]/g, '')
    );

    if (exactMatch && !usedHeaders.has(exactMatch)) {
      mappings.push({ sourceColumn: exactMatch, targetField: field });
      usedHeaders.add(exactMatch);
    }
  });

  return mappings;
}
