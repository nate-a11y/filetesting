/**
 * Data Cleaning Library for LimoAnywhere imports
 * Handles the messy reality of real-world data
 */

// US State codes for validation
const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]);

// Common city names that end up in State column
const COMMON_CITIES = new Set([
  'seattle', 'bellevue', 'redmond', 'tacoma', 'spokane', 'vancouver',
  'portland', 'san francisco', 'los angeles', 'new york', 'chicago',
  'boston', 'denver', 'phoenix', 'dallas', 'houston', 'atlanta',
  'miami', 'orlando', 'las vegas', 'san diego', 'austin', 'sammamish',
  'kirkland', 'renton', 'kent', 'bothell', 'woodinville', 'issaquah'
]);

// Non-person first names (accounting/business entries)
const NON_PERSON_NAMES = new Set([
  'payable', 'billing', 'accounts', 'accounts payable', 'receivable',
  'shuttle', 'bus', 'van', 'driver', 'office', 'admin', 'dispatch',
  'reservation', 'reservations', 'booking', 'bookings', 'fleet',
  'maintenance', 'operations', 'corporate', 'company', 'business'
]);

// Garbage/placeholder address indicators
const GARBAGE_ADDRESS_PATTERNS = [
  /^tbd$/i,
  /^hotel\s*tbd$/i,
  /^address\s*tbd$/i,
  /^tba$/i,
  /^n\/?a$/i,
  /^unknown$/i,
  /^pending$/i,
  /restaurant\s+in\s+/i,
  /^see\s+notes?$/i,
  /^contact\s+for\s+/i,
];

export interface CleaningResult<T> {
  data: T;
  warnings: string[];
  wasModified: boolean;
}

export interface CleanedContact {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  homeAddress: string;
  workAddress: string;
  isBusinessEntry: boolean;
  originalData: Record<string, string>;
}

/**
 * Clean and normalize a contact record
 */
export function cleanContact(row: Record<string, string>): CleaningResult<CleanedContact> {
  const warnings: string[] = [];
  let wasModified = false;

  // Start with original values
  let firstName = row.firstName?.trim() || '';
  let lastName = row.lastName?.trim() || '';
  let email = row.email?.trim() || '';
  const mobilePhone = row.mobilePhone?.trim() || '';

  // Check if this is a non-person entry
  const isBusinessEntry = NON_PERSON_NAMES.has(firstName.toLowerCase());
  if (isBusinessEntry) {
    warnings.push(`"${firstName}" appears to be a business/accounting entry, not a person`);
  }

  // Handle multiple emails (take first one)
  if (email.includes(';')) {
    const emails = email.split(';').map(e => e.trim()).filter(Boolean);
    email = emails[0];
    wasModified = true;
    warnings.push(`Multiple emails found, using first: ${email}`);
  }

  // Clean up wedding couple names
  const nameResult = cleanWeddingName(firstName, lastName);
  if (nameResult.wasModified) {
    firstName = nameResult.firstName;
    lastName = nameResult.lastName;
    wasModified = true;
    warnings.push(...nameResult.warnings);
  }

  // Clean up last name that starts with special characters
  if (lastName.match(/^[\(&-]/)) {
    const cleanedLast = lastName.replace(/^[\(&-\s]+/, '').replace(/[\)]+$/, '').trim();
    if (cleanedLast) {
      lastName = cleanedLast;
      wasModified = true;
      warnings.push(`Cleaned last name from "${row.lastName}" to "${lastName}"`);
    }
  }

  // Build home address from components
  const addressResult = buildAddress(row);
  const homeAddress = addressResult.address;
  if (addressResult.warnings.length > 0) {
    warnings.push(...addressResult.warnings);
    wasModified = true;
  }

  return {
    data: {
      firstName,
      lastName,
      email,
      mobilePhone,
      homeAddress,
      workAddress: row.workAddress?.trim() || '',
      isBusinessEntry,
      originalData: row,
    },
    warnings,
    wasModified,
  };
}

/**
 * Clean wedding couple names
 * "Robert Syvarth" + "& Emily Shea" -> "Robert Syvarth" + "Syvarth"
 * "Skyler Smith" + "- Amelia Mock" -> "Skyler" + "Smith"
 */
function cleanWeddingName(firstName: string, lastName: string): {
  firstName: string;
  lastName: string;
  wasModified: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  let wasModified = false;

  // Check if firstName contains a full name (space-separated)
  if (firstName.includes(' ') && !lastName.match(/^[A-Z][a-z]/)) {
    const parts = firstName.split(/\s+/);
    if (parts.length >= 2) {
      const newFirst = parts[0];
      const newLast = parts.slice(1).join(' ');
      warnings.push(`Split full name "${firstName}" into "${newFirst}" / "${newLast}"`);
      firstName = newFirst;
      lastName = newLast;
      wasModified = true;
    }
  }

  // Handle "& OtherPerson" in last name (wedding couple)
  if (lastName.match(/^&\s+/)) {
    // This is likely the second person in a couple - try to use first person's last name
    const firstParts = firstName.split(/\s+/);
    if (firstParts.length >= 2) {
      lastName = firstParts[firstParts.length - 1];
      firstName = firstParts.slice(0, -1).join(' ');
      warnings.push(`Wedding couple detected, using "${firstName} ${lastName}"`);
      wasModified = true;
    }
  }

  // Handle parenthetical wedding info like "(Moraff & Morris Wedding)"
  if (lastName.match(/^\([^)]*wedding[^)]*\)$/i)) {
    // Extract actual name from company field if available
    warnings.push(`Wedding event entry detected: "${lastName}"`);
    lastName = 'Wedding Guest'; // Placeholder
    wasModified = true;
  }

  return { firstName, lastName, wasModified, warnings };
}

/**
 * Build address from components, detecting and fixing misaligned fields
 */
function buildAddress(row: Record<string, string>): {
  address: string;
  warnings: string[];
} {
  const warnings: string[] = [];

  let street = row['Primary Address']?.trim() || row.homeAddress?.trim() || '';
  let city = row.City?.trim() || '';
  let state = row.State?.trim() || '';
  let zip = row.Zip?.trim() || '';

  // Check if garbage address
  if (street && GARBAGE_ADDRESS_PATTERNS.some(p => p.test(street))) {
    warnings.push(`Address "${street}" appears to be placeholder/garbage`);
    return { address: '', warnings };
  }

  // Detect city in state column
  if (state && COMMON_CITIES.has(state.toLowerCase())) {
    warnings.push(`City "${state}" found in State column, swapping`);
    // The "state" is actually a city, and "zip" might be the state
    if (zip && US_STATES.has(zip.toUpperCase())) {
      city = state;
      state = zip;
      zip = '';
    } else {
      city = state;
      state = '';
    }
  }

  // Validate state code
  if (state && state.length > 2 && !US_STATES.has(state.toUpperCase())) {
    // State might be a full name or city - try to detect
    if (COMMON_CITIES.has(state.toLowerCase())) {
      if (!city) city = state;
      state = '';
      warnings.push(`Moved "${state}" from State to City`);
    }
  }

  // Normalize state to uppercase
  if (state && US_STATES.has(state.toUpperCase())) {
    state = state.toUpperCase();
  }

  // Build final address
  const parts = [street, city, state, zip].filter(Boolean);
  return {
    address: parts.join(', '),
    warnings,
  };
}

/**
 * Detect and flag potential duplicate contacts
 */
export function detectPotentialIssues(contacts: CleanedContact[]): {
  businessEntries: number;
  multipleEmails: number;
  missingNames: number;
  missingEmails: number;
  missingPhones: number;
} {
  return {
    businessEntries: contacts.filter(c => c.isBusinessEntry).length,
    multipleEmails: contacts.filter(c => c.originalData.email?.includes(';')).length,
    missingNames: contacts.filter(c => !c.firstName || !c.lastName).length,
    missingEmails: contacts.filter(c => !c.email).length,
    missingPhones: contacts.filter(c => !c.mobilePhone).length,
  };
}

/**
 * Split multiple emails and return array
 */
export function splitEmails(emailField: string): string[] {
  if (!emailField) return [];
  return emailField.split(/[;,]/).map(e => e.trim()).filter(Boolean);
}

/**
 * Check if a name looks like a real person name vs business entry
 */
export function looksLikePersonName(firstName: string, lastName: string): boolean {
  if (!firstName || !lastName) return false;

  // Check against known non-person patterns
  if (NON_PERSON_NAMES.has(firstName.toLowerCase())) return false;

  // Check for special characters that indicate non-person
  if (firstName.match(/^[\(\[\{]/) || lastName.match(/^[\(\[\{&-]/)) return false;

  // Check for all caps (often indicates company/org)
  if (firstName === firstName.toUpperCase() && firstName.length > 3) return false;

  return true;
}

/**
 * Extract the primary email from a field that may contain multiple
 */
export function extractPrimaryEmail(emailField: string): string {
  const emails = splitEmails(emailField);
  return emails[0] || '';
}
