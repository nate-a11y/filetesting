import type { ColumnMapping } from '@/types/schemas';

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
  { sourceColumn: 'Pick Up Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Pickup Date', targetField: 'pickUpDate' },
  { sourceColumn: 'PU Date', targetField: 'pickUpDate' },
  { sourceColumn: 'Pick Up Time', targetField: 'pickUpTime' },
  { sourceColumn: 'Pickup Time', targetField: 'pickUpTime' },
  { sourceColumn: 'PU Time', targetField: 'pickUpTime' },
  { sourceColumn: 'Drop Off Date', targetField: 'dropOffDate' },
  { sourceColumn: 'Dropoff Date', targetField: 'dropOffDate' },
  { sourceColumn: 'DO Date', targetField: 'dropOffDate' },
  { sourceColumn: 'Drop Off Time', targetField: 'dropOffTime' },
  { sourceColumn: 'Dropoff Time', targetField: 'dropOffTime' },
  { sourceColumn: 'DO Time', targetField: 'dropOffTime' },
  { sourceColumn: 'Service Type', targetField: 'orderType' },
  { sourceColumn: 'Trip Type', targetField: 'orderType' },
  { sourceColumn: 'Order Type', targetField: 'orderType' },
  { sourceColumn: 'Passengers', targetField: 'totalGroupSize' },
  { sourceColumn: 'Pax', targetField: 'totalGroupSize' },
  { sourceColumn: 'Group Size', targetField: 'totalGroupSize' },
  { sourceColumn: 'Pick Up Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pickup Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'PU Address', targetField: 'pickUpAddress' },
  { sourceColumn: 'From', targetField: 'pickUpAddress' },
  { sourceColumn: 'Pick Up Notes', targetField: 'pickUpNotes' },
  { sourceColumn: 'PU Notes', targetField: 'pickUpNotes' },
  { sourceColumn: 'Drop Off Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'Dropoff Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'DO Address', targetField: 'dropOffAddress' },
  { sourceColumn: 'To', targetField: 'dropOffAddress' },
  { sourceColumn: 'Drop Off Notes', targetField: 'dropOffNotes' },
  { sourceColumn: 'DO Notes', targetField: 'dropOffNotes' },
  // Booking contact
  { sourceColumn: 'Booking First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Booker First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Customer First Name', targetField: 'bookingContactFirstName' },
  { sourceColumn: 'Booking Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Booker Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Customer Last Name', targetField: 'bookingContactLastName' },
  { sourceColumn: 'Booking Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Booker Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Customer Email', targetField: 'bookingContactEmail' },
  { sourceColumn: 'Booking Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Booker Phone', targetField: 'bookingContactPhoneNumber' },
  { sourceColumn: 'Customer Phone', targetField: 'bookingContactPhoneNumber' },
  // Trip contact
  { sourceColumn: 'Passenger First Name', targetField: 'tripContactFirstName' },
  { sourceColumn: 'Rider First Name', targetField: 'tripContactFirstName' },
  { sourceColumn: 'Passenger Last Name', targetField: 'tripContactLastName' },
  { sourceColumn: 'Rider Last Name', targetField: 'tripContactLastName' },
  { sourceColumn: 'Passenger Email', targetField: 'tripContactEmail' },
  { sourceColumn: 'Rider Email', targetField: 'tripContactEmail' },
  { sourceColumn: 'Passenger Phone', targetField: 'tripContactPhoneNumber' },
  { sourceColumn: 'Rider Phone', targetField: 'tripContactPhoneNumber' },
  // Vehicle
  { sourceColumn: 'Vehicle', targetField: 'vehicle' },
  { sourceColumn: 'Vehicle Type', targetField: 'vehicle' },
  { sourceColumn: 'Car Type', targetField: 'vehicle' },
  // Notes and rate
  { sourceColumn: 'Trip Notes', targetField: 'tripNotes' },
  { sourceColumn: 'Notes', targetField: 'tripNotes' },
  { sourceColumn: 'Base Rate', targetField: 'baseRateAmt' },
  { sourceColumn: 'Rate', targetField: 'baseRateAmt' },
  { sourceColumn: 'Price', targetField: 'baseRateAmt' },
  // Stops
  { sourceColumn: 'Stop 1', targetField: 'stop1Address' },
  { sourceColumn: 'Stop 1 Address', targetField: 'stop1Address' },
  { sourceColumn: 'Stop 2', targetField: 'stop2Address' },
  { sourceColumn: 'Stop 2 Address', targetField: 'stop2Address' },
  { sourceColumn: 'Stop 3', targetField: 'stop3Address' },
  { sourceColumn: 'Stop 3 Address', targetField: 'stop3Address' },
];

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

// Apply all data transformations
export function applyPhoneFallback(data: Record<string, string>[]): Record<string, string>[] {
  return data.map(row => {
    const result = { ...row };

    // === PHONE FALLBACK ===
    if (!result.mobilePhone?.trim()) {
      if (result._homePhone?.trim()) {
        result.mobilePhone = result._homePhone;
      } else if (result._officePhone?.trim()) {
        result.mobilePhone = result._officePhone;
      } else {
        result.mobilePhone = PLACEHOLDER_PHONE;
      }
    }

    // === EMAIL: Take first if multiple ===
    if (result.email?.includes(';')) {
      const emails = result.email.split(';').map(e => e.trim()).filter(Boolean);
      result.email = emails[0] || '';
    }

    // === NAME CLEANING ===
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
