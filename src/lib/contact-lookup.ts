/**
 * Contact lookup system for matching reservation contacts to existing contacts
 * Allows reservations to use real contact data instead of placeholders
 */

export interface ContactRecord {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
}

export interface ContactMatch {
  email?: string;
  mobilePhone?: string;
  matchType: 'email' | 'name' | 'none';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Manages contact lookups for reservation processing
 */
export class ContactLookup {
  private contacts: ContactRecord[];
  private emailIndex: Map<string, ContactRecord>;
  private nameIndex: Map<string, ContactRecord[]>;
  private highestPlaceholderPhone: number | null = null;
  private matchStats = {
    emailMatches: 0,
    nameMatches: 0,
    noMatches: 0,
  };

  constructor(contacts: ContactRecord[], basePhoneNumber?: string) {
    this.contacts = contacts;
    this.emailIndex = new Map();
    this.nameIndex = new Map();
    this.buildIndexes();

    // Find highest placeholder phone number in contacts
    if (basePhoneNumber) {
      this.findHighestPlaceholderPhone(basePhoneNumber);
    }
  }

  /**
   * Build lookup indexes for fast matching
   */
  private buildIndexes(): void {
    this.contacts.forEach(contact => {
      // Email index (primary key)
      if (contact.email?.trim()) {
        const normalizedEmail = this.normalizeEmail(contact.email);
        if (normalizedEmail && !this.isPlaceholderEmail(normalizedEmail)) {
          this.emailIndex.set(normalizedEmail, contact);
        }
      }

      // Name index (secondary key)
      const nameKey = this.normalizeNameKey(contact.firstName, contact.lastName);
      if (nameKey) {
        if (!this.nameIndex.has(nameKey)) {
          this.nameIndex.set(nameKey, []);
        }
        this.nameIndex.get(nameKey)!.push(contact);
      }
    });
  }

  /**
   * Find the highest placeholder phone number in contacts
   * to continue sequential numbering from there
   */
  private findHighestPlaceholderPhone(basePhoneNumber: string): void {
    const baseDigits = basePhoneNumber.replace(/\D/g, '');
    const basePattern = baseDigits.slice(0, -2); // Remove last 2 digits for pattern matching

    let maxPhone = parseInt(baseDigits, 10);

    this.contacts.forEach(contact => {
      if (contact.mobilePhone) {
        const digits = contact.mobilePhone.replace(/\D/g, '');

        // Check if this is a placeholder phone (matches base pattern)
        if (digits.startsWith(basePattern)) {
          const phoneNumber = parseInt(digits, 10);
          if (!isNaN(phoneNumber) && phoneNumber > maxPhone) {
            maxPhone = phoneNumber;
          }
        }
      }
    });

    // Store the highest found
    this.highestPlaceholderPhone = maxPhone;
  }

  /**
   * Get the next phone number to start sequential generation
   * Returns the number after the highest placeholder in contacts
   */
  getNextSequentialStart(): number | null {
    return this.highestPlaceholderPhone !== null
      ? this.highestPlaceholderPhone + 1
      : null;
  }

  /**
   * Look up a contact by email or name
   */
  findContact(
    firstName: string | undefined,
    lastName: string | undefined,
    email?: string | undefined
  ): ContactMatch {
    // Try email match first (strongest signal)
    if (email?.trim()) {
      const normalizedEmail = this.normalizeEmail(email);
      if (normalizedEmail && !this.isPlaceholderEmail(normalizedEmail)) {
        const contact = this.emailIndex.get(normalizedEmail);
        if (contact) {
          this.matchStats.emailMatches++;
          return {
            email: contact.email,
            mobilePhone: contact.mobilePhone,
            matchType: 'email',
            confidence: 'high',
          };
        }
      }
    }

    // Try name match (weaker signal)
    if (firstName?.trim() && lastName?.trim()) {
      const nameKey = this.normalizeNameKey(firstName, lastName);
      if (nameKey) {
        const matches = this.nameIndex.get(nameKey);
        if (matches && matches.length > 0) {
          // If multiple matches by name, prefer one with valid phone
          const bestMatch = matches.find(c => c.mobilePhone && !this.isPlaceholderPhone(c.mobilePhone))
            || matches[0];

          this.matchStats.nameMatches++;
          return {
            email: bestMatch.email,
            mobilePhone: bestMatch.mobilePhone,
            matchType: 'name',
            confidence: matches.length === 1 ? 'medium' : 'low',
          };
        }
      }
    }

    // No match found
    this.matchStats.noMatches++;
    return {
      matchType: 'none',
      confidence: 'low',
    };
  }

  /**
   * Get matching statistics
   */
  getStats() {
    return {
      ...this.matchStats,
      totalContacts: this.contacts.length,
      totalLookups: this.matchStats.emailMatches + this.matchStats.nameMatches + this.matchStats.noMatches,
    };
  }

  /**
   * Reset statistics (useful for processing multiple batches)
   */
  resetStats(): void {
    this.matchStats = {
      emailMatches: 0,
      nameMatches: 0,
      noMatches: 0,
    };
  }

  /**
   * Normalize email for comparison
   */
  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Normalize name for lookup key
   */
  private normalizeNameKey(firstName: string, lastName: string): string {
    const first = firstName?.trim().toLowerCase().replace(/[^a-z]/g, '');
    const last = lastName?.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!first || !last) return '';
    return `${first}|${last}`;
  }

  /**
   * Check if email is a placeholder
   */
  private isPlaceholderEmail(email: string): boolean {
    return email.endsWith('@import.moovs.com') || email.endsWith('@placeholder.moovs.com');
  }

  /**
   * Check if phone is a placeholder
   * Detects both single placeholders and sequential ranges
   */
  private isPlaceholderPhone(phone: string): boolean {
    if (!phone) return false;
    // Check for 555 exchange (placeholder range)
    const digits = phone.replace(/\D/g, '');
    // Format: +1 XXX-555-XXXX or similar
    return digits.includes('555');
  }
}

/**
 * Parse contacts from CSV data
 */
export function parseContactsForLookup(data: Record<string, string>[]): ContactRecord[] {
  return data
    .filter(row => {
      // Must have first name, last name, and at least email or phone
      return row.firstName?.trim() &&
        row.lastName?.trim() &&
        (row.email?.trim() || row.mobilePhone?.trim());
    })
    .map(row => ({
      firstName: row.firstName.trim(),
      lastName: row.lastName.trim(),
      email: row.email?.trim() || '',
      mobilePhone: row.mobilePhone?.trim() || '',
    }));
}
