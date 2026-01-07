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
  // Combined address handling
  {
    sourceColumn: 'Street',
    targetField: 'homeAddress',
    transform: 'combine',
    combineWith: ['City', 'State', 'Zip']
  },
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

// Apply phone fallback logic: cellular > home > office > placeholder
export function applyPhoneFallback(data: Record<string, string>[]): Record<string, string>[] {
  return data.map(row => {
    const result = { ...row };

    // If no mobilePhone, try fallbacks
    if (!result.mobilePhone?.trim()) {
      if (result._homePhone?.trim()) {
        result.mobilePhone = result._homePhone;
      } else if (result._officePhone?.trim()) {
        result.mobilePhone = result._officePhone;
      } else {
        result.mobilePhone = PLACEHOLDER_PHONE;
      }
    }

    // Clean up temporary fields
    delete result._homePhone;
    delete result._officePhone;

    return result;
  });
}

// Auto-detect LimoAnywhere format from headers
export function detectLimoAnywhereFormat(headers: string[]): boolean {
  const limoKeywords = [
    'Pick Up Date', 'Pickup Date', 'PU Date',
    'Pick Up Address', 'Pickup Address', 'PU Address',
    'Confirmation #', 'Conf #',
    'Cell Phone', 'Mobile Phone'
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
