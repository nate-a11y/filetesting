import type { ColumnMapping } from '@/types/schemas';
import { formatPhone, validatePhone } from './phone-utils';
import { getPlaceholderManager, type PlaceholderConfig } from './placeholder-config';
import type { ContactLookup } from './contact-lookup';

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

// Clean LimoAnywhere passenger name format: "Name | Description" → "Name"
// Also handles formats like "Name (Company)" and strips non-person indicators
function cleanPassengerName(rawName: string | undefined): string {
  if (!rawName?.trim()) return '';

  let name = rawName.trim();

  // Extract name before pipe: "Jenny Fankhauser | Airport Greeter (PMI)" → "Jenny Fankhauser"
  if (name.includes('|')) {
    name = name.split('|')[0].trim();
  }

  // Remove trailing parenthetical: "John Smith (Company)" → "John Smith"
  name = name.replace(/\s*\([^)]*\)\s*$/, '').trim();

  // Skip non-person entries (vehicles, services, notes)
  const nonPersonIndicators = [
    /^\d+[-\s]?\d*\s*(sprinter|sedan|suv|bus|van|coach|limo)/i,  // "12-14 Sprinters"
    /^setra\b/i,           // Vehicle type
    /^ford\b/i,            // Vehicle type
    /^mercedes\b/i,        // Vehicle type
    /^shuttle\b/i,         // Service type
    /^butler\s+(office|seattle)/i,  // Internal entries
    /^\d+%\s/,             // "25% HOLIDAY SURCHARGE"
    /^airport\s+(arrival|greeter)/i, // Service descriptions without name
    /^weddings?\s+in\b/i,  // Event descriptions
  ];

  if (nonPersonIndicators.some(pattern => pattern.test(name))) {
    return '';  // Not a person name
  }

  return name;
}

// Generate a deterministic placeholder email from name and phone
// Format: robert.johnson.310923@import.moovs.com
function generateReservationPlaceholderEmail(firstName: string, lastName: string, phone?: string): string {
  if (!firstName || !lastName) return '';
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  if (!cleanFirst || !cleanLast) return '';

  // Use phone digits for uniqueness (same person = same email)
  let suffix = '';
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    suffix = `.${digits.slice(-6) || '000000'}`;
  } else {
    // Generate deterministic hash from name
    const seed = `${cleanFirst}${cleanLast}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    suffix = `.${Math.abs(hash).toString().slice(0, 6).padStart(6, '0')}`;
  }

  return `${cleanFirst}.${cleanLast}${suffix}@import.moovs.com`;
}

// Apply transformations specific to reservation data
export function applyReservationTransforms(
  data: Record<string, string>[],
  placeholderConfig?: PlaceholderConfig,
  contactLookup?: ContactLookup
): Record<string, string>[] {
  const placeholderManager = getPlaceholderManager(placeholderConfig);

  return data
    .map(row => {
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

      // === CLEAN AND SPLIT FULL NAMES ===
      // Clean passenger name format first (handles "Name | Description" format)
      if (result._passengerFullName) {
        result._passengerFullName = cleanPassengerName(result._passengerFullName);
      }
      if (result._bookingFullName) {
        // Booking contact is usually cleaner but still clean it
        result._bookingFullName = cleanPassengerName(result._bookingFullName);
      }

      // Passenger/Trip contact from full name
      if (result._passengerFullName && (!result.tripContactFirstName || !result.tripContactLastName)) {
        const { firstName, lastName } = splitFullName(result._passengerFullName);
        if (!result.tripContactFirstName) result.tripContactFirstName = firstName;
        if (!result.tripContactLastName) result.tripContactLastName = lastName || firstName;
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

      // === GENERATE PLACEHOLDER EMAILS IF MISSING ===
      // Use phone number in email generation for deterministic uniqueness
      if (!result.bookingContactEmail && result.bookingContactFirstName && result.bookingContactLastName) {
        result.bookingContactEmail = generateReservationPlaceholderEmail(
          result.bookingContactFirstName,
          result.bookingContactLastName,
          result.bookingContactPhoneNumber
        );
      }
      if (!result.tripContactEmail && result.tripContactFirstName && result.tripContactLastName) {
        result.tripContactEmail = generateReservationPlaceholderEmail(
          result.tripContactFirstName,
          result.tripContactLastName,
          result.tripContactPhoneNumber
        );
      }

      // === CONTACT LOOKUP (if available) ===
      // Try to match booking contact to existing contacts before using placeholders
      if (contactLookup && result.bookingContactFirstName && result.bookingContactLastName) {
        const bookingMatch = contactLookup.findContact(
          result.bookingContactFirstName,
          result.bookingContactLastName,
          result.bookingContactEmail
        );

        // Use matched contact data if found
        if (bookingMatch.matchType !== 'none') {
          if (bookingMatch.email && !result.bookingContactEmail) {
            result.bookingContactEmail = bookingMatch.email;
          }
          if (bookingMatch.mobilePhone && !result.bookingContactPhoneNumber) {
            result.bookingContactPhoneNumber = bookingMatch.mobilePhone;
          }
        }
      }

      // Try to match trip contact to existing contacts
      if (contactLookup && result.tripContactFirstName && result.tripContactLastName) {
        const tripMatch = contactLookup.findContact(
          result.tripContactFirstName,
          result.tripContactLastName,
          result.tripContactEmail
        );

        // Use matched contact data if found
        if (tripMatch.matchType !== 'none') {
          if (tripMatch.email && !result.tripContactEmail) {
            result.tripContactEmail = tripMatch.email;
          }
          if (tripMatch.mobilePhone && !result.tripContactPhoneNumber) {
            result.tripContactPhoneNumber = tripMatch.mobilePhone;
          }
        }
      }

      // === FORMAT PHONE NUMBERS ===
      if (result.bookingContactPhoneNumber) {
        result.bookingContactPhoneNumber = cleanPhoneNumber(result.bookingContactPhoneNumber) || placeholderManager.getNextPhoneNumber();
      } else {
        result.bookingContactPhoneNumber = placeholderManager.getNextPhoneNumber();
      }

      if (result.tripContactPhoneNumber) {
        result.tripContactPhoneNumber = cleanPhoneNumber(result.tripContactPhoneNumber) || placeholderManager.getNextPhoneNumber();
      } else {
        result.tripContactPhoneNumber = placeholderManager.getNextPhoneNumber();
      }

      // === APPLY PLACEHOLDER ADDRESSES ===
      const placeholderPickup = placeholderManager.getPickupAddress();
      const placeholderDropoff = placeholderManager.getDropoffAddress();

      if (!result.pickUpAddress?.trim() && placeholderPickup) {
        result.pickUpAddress = placeholderPickup;
      }

      if (!result.dropOffAddress?.trim() && placeholderDropoff) {
        result.dropOffAddress = placeholderDropoff;
      }

      // === CLEANUP TEMP FIELDS ===
      delete result._passengerFullName;
      delete result._bookingFullName;

      return result;
    })
    // Filter out entries without valid contact names (internal/placeholder entries)
    .filter(row => {
      // Must have at least booking contact names
      const hasBookingName = row.bookingContactFirstName?.trim() && row.bookingContactLastName?.trim();
      const hasTripName = row.tripContactFirstName?.trim() && row.tripContactLastName?.trim();
      return hasBookingName || hasTripName;
    });
}

// Phone fallback placeholder - uses reserved 555-01XX range with valid area code
// 202 (Washington DC) + 555-0100 is officially reserved for fictional/test use
export const PLACEHOLDER_PHONE = '+1 202-555-0100';

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
  'reservations', 'booking', 'bookings', 'fleet', 'maintenance',
  'operations', 'corporate', 'company', 'business', 'sales', 'marketing',
  'accounting', 'finance', 'hr', 'human', 'resources', 'support',
  'customer', 'service', 'transportation', 'logistics', 'purchasing',
  'vip', 'client', 'guest', 'visitor', 'member', 'special', 'test',
  'demo', 'sample', 'unknown', 'anonymous', 'n/a', 'na', 'none'
]);

// VIP/Client patterns that indicate a placeholder entry
const PLACEHOLDER_NAME_PATTERNS = [
  /^vip\s+(client|guest|customer|member)/i,  // "VIP Client", "VIP Guest"
  /^special\s+(guest|client|customer)/i,     // "Special Guest"
  /^test\s+/i,                                // "Test User", "Test Account"
  /^demo\s+/i,                                // "Demo Account"
  /^(no|not)\s+(name|available)/i,           // "No Name", "Not Available"
];

// Wedding-related patterns in lastName that indicate an event entry, not a person
const WEDDING_PATTERNS = [
  /\bwedding\b/i,           // Contains "wedding"
  /\bwedding\s+shuttle\b/i, // "Wedding Shuttle"
  /\breception\b/i,         // Contains "reception"
  /\bceremony\b/i,          // Contains "ceremony"
  /\brehearsal\b/i,         // Contains "rehearsal"
];

// Garbage address patterns
const GARBAGE_ADDRESS_PATTERNS = [
  /^tbd$/i, /^hotel\s*tbd$/i, /^address\s*tbd$/i, /^tba$/i,
  /^n\/?a$/i, /^unknown$/i, /^pending$/i, /restaurant\s+in\s+/i
];

// Detect if a value looks like a phone number
function looksLikePhone(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  const cleaned = value.trim();
  // Phone number patterns: starts with +, or is 10-11 digits, or formatted like xxx-xxx-xxxx
  if (cleaned.startsWith('+')) return true;
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) return true;
  if (/^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(cleaned)) return true;
  return false;
}

// Detect if a value looks like an email
function looksLikeEmail(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Detect if a value looks like a zip code (5 digits or 5+4)
function looksLikeZip(value: string | undefined): boolean {
  if (!value?.trim()) return false;
  return /^\d{5}(-\d{4})?$/.test(value.trim());
}

// Try to find an email in any field of the row
function findEmailInRow(row: Record<string, string>): string | null {
  for (const [key, value] of Object.entries(row)) {
    if (value && looksLikeEmail(value)) {
      return value;
    }
  }
  return null;
}

// Try to find a phone number in any field of the row
function findPhoneInRow(row: Record<string, string>, excludeField?: string): string | null {
  for (const [key, value] of Object.entries(row)) {
    if (key === excludeField) continue;
    if (value && looksLikePhone(value) && !looksLikeEmail(value)) {
      return value;
    }
  }
  return null;
}

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

// Normalize a value for duplicate comparison
function normalizeForComparison(value: string | undefined): string {
  if (!value) return '';
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Deduplicate contacts based on email, phone, or name
function deduplicateContacts(
  data: Record<string, string>[],
  basePhoneNumber: string
): Record<string, string>[] {
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  const seenNames = new Set<string>();
  // Extract base phone pattern to detect all sequential placeholder phones
  const basePlaceholderDigits = basePhoneNumber.replace(/\D/g, '').slice(0, -2); // Remove last 2 digits for pattern matching

  return data.filter(row => {
    const email = normalizeForComparison(row.email);
    const phone = normalizeForComparison(row.mobilePhone);
    const name = normalizeForComparison(`${row.firstName}${row.lastName}`);

    // Check if phone is a placeholder (starts with base placeholder pattern)
    const isPlaceholderPhone = phone && phone.startsWith(basePlaceholderDigits);

    // Check for duplicates - email takes priority (skip empty emails)
    if (email) {
      if (seenEmails.has(email)) {
        return false; // Duplicate email
      }
      seenEmails.add(email);
    }

    // Check phone (only if not placeholder)
    if (phone && !isPlaceholderPhone) {
      if (seenPhones.has(phone)) {
        return false; // Duplicate phone
      }
      seenPhones.add(phone);
    }

    // Check name combination (as final check)
    if (name) {
      if (seenNames.has(name)) {
        return false; // Duplicate name
      }
      seenNames.add(name);
    }

    return true;
  });
}

// Apply all data transformations
export function applyPhoneFallback(
  data: Record<string, string>[],
  placeholderConfig?: PlaceholderConfig
): Record<string, string>[] {
  const placeholderManager = getPlaceholderManager(placeholderConfig);

  const cleaned = data
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

      // === COLUMN MISALIGNMENT RECOVERY ===
      // LimoAnywhere exports often have unquoted commas in addresses which shifts all columns

      // Check if email field has a phone number (column shift indicator)
      if (looksLikePhone(result.email) && !looksLikeEmail(result.email)) {
        // The "email" is actually a phone - try to find real email elsewhere
        const realEmail = findEmailInRow(result);
        const phoneFromEmail = result.email;

        if (realEmail) {
          result.email = realEmail;
        } else {
          result.email = ''; // Will be filled with placeholder later
        }

        // Use the phone we found if we don't have one
        if (!result.mobilePhone || looksLikeZip(result.mobilePhone)) {
          result.mobilePhone = phoneFromEmail;
        }
      }

      // Check if phone field has a zip code (another column shift indicator)
      if (looksLikeZip(result.mobilePhone)) {
        // Try to find real phone in other fields
        const realPhone = findPhoneInRow(result, 'mobilePhone');
        if (realPhone) {
          result.mobilePhone = realPhone;
        } else {
          result.mobilePhone = ''; // Will fall back to placeholder
        }
      }

      // Also check _homePhone and _officePhone for zip codes
      if (looksLikeZip(result._homePhone)) {
        result._homePhone = '';
      }
      if (looksLikeZip(result._officePhone)) {
        result._officePhone = '';
      }

      // === NAME CLEANING (do this first so we can check again) ===

      // Clean pipe characters from names (e.g., "Garson |" → "Garson")
      if (result.firstName) {
        result.firstName = result.firstName.replace(/\s*\|\s*$/, '').trim();
      }
      if (result.lastName) {
        result.lastName = result.lastName.replace(/\s*\|\s*$/, '').trim();
      }

      // Handle wedding couple names like "Stephanie Schwarzmiller and James Plecensia"
      // Take only the first person's name
      if (result.firstName?.toLowerCase().includes(' and ')) {
        const firstPerson = result.firstName.split(/\s+and\s+/i)[0].trim();
        result.firstName = firstPerson;
      }

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

      // Handle wedding-related last names (e.g., "Thompson Wedding", "Sturtevant and Vrooman Wedding")
      // These are event entries, not person names - mark for filtering
      if (result.lastName && WEDDING_PATTERNS.some(p => p.test(result.lastName!))) {
        // Try to extract just the last name before "Wedding" or mark as business entry
        const beforeWedding = result.lastName.replace(/\s+(and\s+\w+\s+)?wedding.*$/i, '').trim();
        if (beforeWedding && beforeWedding !== result.lastName && !beforeWedding.includes(' ')) {
          // We extracted a clean last name (e.g., "Thompson Wedding" → "Thompson")
          result.lastName = beforeWedding;
        } else {
          // Complex case like "Sturtevant and Vrooman Wedding" - mark as business/event entry
          result._isBusinessEntry = 'true';
        }
      }

      // Check for VIP/placeholder patterns in the full name
      const fullName = `${result.firstName || ''} ${result.lastName || ''}`.trim();
      if (PLACEHOLDER_NAME_PATTERNS.some(p => p.test(fullName))) {
        result._isBusinessEntry = 'true';
      }

      // Mark non-person entries based on first name
      if (result.firstName && NON_PERSON_NAMES.has(result.firstName.toLowerCase())) {
        result._isBusinessEntry = 'true';
      }

      // Also check if lastName alone is a non-person indicator
      if (result.lastName && NON_PERSON_NAMES.has(result.lastName.toLowerCase())) {
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
        result.mobilePhone = placeholderManager.getNextPhoneNumber();
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
    // Final filter: drop records that don't have both first and last name, or are business/event entries
    .filter(row => {
      const firstName = row.firstName?.trim();
      const lastName = row.lastName?.trim();
      const isBusinessEntry = row._isBusinessEntry === 'true';

      // Drop the _isBusinessEntry flag before export
      delete row._isBusinessEntry;

      // Keep only records with both names and that aren't business entries
      return firstName && lastName && !isBusinessEntry;
    });

  // Apply deduplication as final step
  const basePhone = placeholderManager.getConfig().basePhoneNumber || '+1 202-555-0100';
  return deduplicateContacts(cleaned, basePhone);
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
