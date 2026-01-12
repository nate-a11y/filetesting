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
  private matchStats = {
    emailMatches: 0,
    nameMatches: 0,
    noMatches: 0,
  };

  constructor(contacts: ContactRecord[]) {
    this.contacts = contacts;
    this.emailIndex = new Map();
    this.nameIndex = new Map();
    this.buildIndexes();
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
