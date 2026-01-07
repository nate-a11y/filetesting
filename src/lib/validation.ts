import type { DataIssue, ORDER_TYPES, ParsedContact, DuplicateGroup } from '@/types/schemas';
import { validatePhone, normalizePhone } from './phone-utils';
import { validateEmail, normalizeEmail, generatePlaceholderEmail } from './email-utils';
import { PLACEHOLDER_PHONE } from './limoanywhere-mappings';

// Check if a phone is the placeholder phone
function isPlaceholderPhone(phone: string | undefined): boolean {
  if (!phone) return false;
  // Normalize both for comparison
  const normalizedPhone = phone.replace(/[^0-9]/g, '');
  const normalizedPlaceholder = PLACEHOLDER_PHONE.replace(/[^0-9]/g, '');
  return normalizedPhone === normalizedPlaceholder;
}

// Check if an email is a placeholder email
function isPlaceholderEmail(email: string | undefined): boolean {
  if (!email) return false;
  return email.endsWith('@import.moovs.com') || email.endsWith('@placeholder.moovs.com');
}

// Validate contact data
export function validateContacts(
  data: Record<string, string>[],
  operatorId: string
): { validatedData: Record<string, string>[]; issues: DataIssue[] } {
  const issues: DataIssue[] = [];

  const validatedData = data.map((row, index) => {
    const result: Record<string, string> = { ...row, operatorId };

    // First Name
    if (!row.firstName?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'firstName',
        type: 'missing',
        message: 'First name is required',
      });
    }

    // Last Name
    if (!row.lastName?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'lastName',
        type: 'missing',
        message: 'Last name is required',
      });
    }

    // Phone
    if (!row.mobilePhone?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'mobilePhone',
        type: 'missing',
        message: 'Phone number is required',
        suggestedValue: row.firstName && row.lastName
          ? generatePlaceholderEmail(row.firstName, row.lastName) // Will generate phone in fix step
          : undefined,
      });
    } else if (isPlaceholderPhone(row.mobilePhone)) {
      // Placeholder phone is valid but informational - not an error
      issues.push({
        rowIndex: index,
        field: 'mobilePhone',
        type: 'info',
        message: 'Using placeholder phone number (no phone was available)',
        currentValue: row.mobilePhone,
      });
    } else {
      const phoneResult = validatePhone(row.mobilePhone);
      if (!phoneResult.isValid) {
        issues.push({
          rowIndex: index,
          field: 'mobilePhone',
          type: 'invalid',
          message: phoneResult.error || 'Invalid phone number',
          currentValue: row.mobilePhone,
          suggestedValue: phoneResult.suggestion,
        });
      } else if (phoneResult.formatted) {
        result.mobilePhone = phoneResult.formatted;
      }
    }

    // Email
    if (!row.email?.trim()) {
      const suggestedEmail = row.firstName && row.lastName
        ? generatePlaceholderEmail(row.firstName, row.lastName, row.mobilePhone)
        : undefined;
      issues.push({
        rowIndex: index,
        field: 'email',
        type: 'missing',
        message: 'Email is required',
        suggestedValue: suggestedEmail,
      });
    } else {
      const emailResult = validateEmail(row.email);
      if (!emailResult.isValid) {
        issues.push({
          rowIndex: index,
          field: 'email',
          type: 'invalid',
          message: emailResult.error || 'Invalid email format',
          currentValue: row.email,
        });
      }
    }

    return result;
  });

  return { validatedData, issues };
}

// Validate reservation data
export function validateReservations(
  data: Record<string, string>[],
  operatorId: string
): { validatedData: Record<string, string>[]; issues: DataIssue[] } {
  const issues: DataIssue[] = [];
  const validOrderTypes = new Set([
    'airport', 'airport-drop-off', 'airport-pick-up', 'bachelor-bachelorette', 'bar',
    'bar-bat-mitzvah', 'baseball', 'basketball', 'birthday', 'birthday-21', 'brew-tour',
    'bridal-party', 'bride-groom', 'business-trip', 'concert', 'corporate', 'family-reunion',
    'field-trip', 'football', 'funeral', 'golf', 'graduation', 'hockey', 'holiday', 'kids-birthday',
    'leisure', 'medical', 'night-out', 'personal-trip', 'point-to-point', 'prom-homecoming',
    'quinceanera', 'retail', 'school', 'school-fundraiser', 'seaport', 'special-occasion',
    'sporting-event', 'sweet-16', 'train-station', 'wedding', 'wine-tour'
  ]);

  const validatedData = data.map((row, index) => {
    const result: Record<string, string> = { ...row, operatorId };

    // Pick Up Date - MM/DD/YYYY
    if (!row.pickUpDate?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'pickUpDate',
        type: 'missing',
        message: 'Pick up date is required (MM/DD/YYYY)',
      });
    } else if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(row.pickUpDate)) {
      issues.push({
        rowIndex: index,
        field: 'pickUpDate',
        type: 'invalid',
        message: 'Invalid date format. Use MM/DD/YYYY',
        currentValue: row.pickUpDate,
      });
    }

    // Pick Up Time - HH:MM AM/PM
    if (!row.pickUpTime?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'pickUpTime',
        type: 'missing',
        message: 'Pick up time is required (HH:MM AM/PM)',
      });
    } else if (!/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(row.pickUpTime)) {
      issues.push({
        rowIndex: index,
        field: 'pickUpTime',
        type: 'invalid',
        message: 'Invalid time format. Use HH:MM AM/PM (e.g., 4:34 AM)',
        currentValue: row.pickUpTime,
      });
    }

    // Order Type
    if (!row.orderType?.trim()) {
      result.orderType = 'point-to-point'; // Default
    } else if (!validOrderTypes.has(row.orderType.toLowerCase())) {
      issues.push({
        rowIndex: index,
        field: 'orderType',
        type: 'invalid',
        message: 'Invalid order type',
        currentValue: row.orderType,
        suggestedValue: 'point-to-point',
      });
    }

    // Total Group Size
    if (!row.totalGroupSize?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'totalGroupSize',
        type: 'missing',
        message: 'Number of passengers is required',
        suggestedValue: '1',
      });
    } else if (isNaN(Number(row.totalGroupSize)) || Number(row.totalGroupSize) < 1) {
      issues.push({
        rowIndex: index,
        field: 'totalGroupSize',
        type: 'invalid',
        message: 'Invalid passenger count',
        currentValue: row.totalGroupSize,
      });
    }

    // Pick Up Address
    if (!row.pickUpAddress?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'pickUpAddress',
        type: 'missing',
        message: 'Pick up address is required',
      });
    }

    // Drop Off Address
    if (!row.dropOffAddress?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'dropOffAddress',
        type: 'missing',
        message: 'Drop off address is required',
      });
    }

    // Booking Contact validation
    validateContactFields(row, index, 'bookingContact', issues);

    // Trip Contact validation
    validateContactFields(row, index, 'tripContact', issues);

    // Vehicle
    if (!row.vehicle?.trim()) {
      issues.push({
        rowIndex: index,
        field: 'vehicle',
        type: 'missing',
        message: 'Vehicle is required',
      });
    }

    return result;
  });

  return { validatedData, issues };
}

function validateContactFields(
  row: Record<string, string>,
  index: number,
  prefix: 'bookingContact' | 'tripContact',
  issues: DataIssue[]
) {
  const firstName = row[`${prefix}FirstName`];
  const lastName = row[`${prefix}LastName`];
  const email = row[`${prefix}Email`];
  const phone = row[`${prefix}PhoneNumber`];

  if (!firstName?.trim()) {
    issues.push({
      rowIndex: index,
      field: `${prefix}FirstName`,
      type: 'missing',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact first name is required`,
    });
  }

  if (!lastName?.trim()) {
    issues.push({
      rowIndex: index,
      field: `${prefix}LastName`,
      type: 'missing',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact last name is required`,
    });
  }

  if (!email?.trim()) {
    const suggestedEmail = firstName && lastName
      ? generatePlaceholderEmail(firstName, lastName, phone)
      : undefined;
    issues.push({
      rowIndex: index,
      field: `${prefix}Email`,
      type: 'missing',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact email is required`,
      suggestedValue: suggestedEmail,
    });
  } else if (isPlaceholderEmail(email)) {
    // Placeholder email is valid but informational - not an error
    issues.push({
      rowIndex: index,
      field: `${prefix}Email`,
      type: 'info',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact using placeholder email`,
      currentValue: email,
    });
  } else {
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      issues.push({
        rowIndex: index,
        field: `${prefix}Email`,
        type: 'invalid',
        message: emailResult.error || 'Invalid email format',
        currentValue: email,
      });
    }
  }

  if (!phone?.trim()) {
    issues.push({
      rowIndex: index,
      field: `${prefix}PhoneNumber`,
      type: 'missing',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact phone is required`,
    });
  } else if (isPlaceholderPhone(phone)) {
    // Placeholder phone is valid but informational - not an error
    issues.push({
      rowIndex: index,
      field: `${prefix}PhoneNumber`,
      type: 'info',
      message: `${prefix === 'bookingContact' ? 'Booking' : 'Trip'} contact using placeholder phone`,
      currentValue: phone,
    });
  } else {
    const phoneResult = validatePhone(phone);
    if (!phoneResult.isValid) {
      issues.push({
        rowIndex: index,
        field: `${prefix}PhoneNumber`,
        type: 'invalid',
        message: phoneResult.error || 'Invalid phone number',
        currentValue: phone,
        suggestedValue: phoneResult.suggestion,
      });
    }
  }
}

// Detect duplicates within data
export function detectDuplicates(
  data: Record<string, string>[]
): DuplicateGroup[] {
  const duplicates: DuplicateGroup[] = [];
  const seen = new Map<string, ParsedContact[]>();

  data.forEach((row, index) => {
    const contact: ParsedContact = {
      rowIndex: index,
      firstName: row.firstName || row.bookingContactFirstName || '',
      lastName: row.lastName || row.bookingContactLastName || '',
      email: normalizeEmail(row.email || row.bookingContactEmail || ''),
      phone: normalizePhone(row.mobilePhone || row.bookingContactPhoneNumber || ''),
      originalData: row,
    };

    // Create keys for matching
    const keys: string[] = [];

    // Phone key
    if (contact.phone) {
      keys.push(`phone:${contact.phone}`);
    }

    // Email key
    if (contact.email) {
      keys.push(`email:${contact.email}`);
    }

    // Name key (only if both present)
    if (contact.firstName && contact.lastName) {
      keys.push(`name:${contact.firstName.toLowerCase()}:${contact.lastName.toLowerCase()}`);
    }

    // Check for matches
    keys.forEach((key) => {
      const existing = seen.get(key);
      if (existing) {
        existing.push(contact);
      } else {
        seen.set(key, [contact]);
      }
    });
  });

  // Collect groups with more than one contact
  const processedIndices = new Set<number>();

  seen.forEach((contacts, key) => {
    if (contacts.length > 1) {
      const newContacts = contacts.filter((c) => !processedIndices.has(c.rowIndex));
      if (newContacts.length > 1) {
        duplicates.push({
          contacts: newContacts,
          matchReason: key.split(':')[0],
        });
        newContacts.forEach((c) => processedIndices.add(c.rowIndex));
      }
    }
  });

  return duplicates;
}
