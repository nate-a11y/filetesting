/**
 * Configuration for placeholder values used during data import
 * Allows customization of placeholder addresses and sequential phone numbers
 */

export interface PlaceholderConfig {
  /**
   * Base phone number for sequential generation
   * Example: '+1 202-555-0100'
   * Missing phone numbers will be: base, base+1, base+2, etc.
   */
  basePhoneNumber?: string;

  /**
   * Placeholder address to use when pickup address is missing
   * Example: '123 Main St, Seattle, WA 98101'
   */
  placeholderPickupAddress?: string;

  /**
   * Placeholder address to use when dropoff address is missing
   * Example: '456 Market St, Seattle, WA 98102'
   */
  placeholderDropoffAddress?: string;
}

/**
 * Default placeholder configuration
 * Uses the reserved 555-01XX range with Washington DC area code (202)
 */
export const DEFAULT_PLACEHOLDER_CONFIG: PlaceholderConfig = {
  basePhoneNumber: '+1 202-555-0100',
  placeholderPickupAddress: undefined,
  placeholderDropoffAddress: undefined,
};

/**
 * Manages sequential phone number generation and placeholder addresses
 */
export class PlaceholderManager {
  private config: PlaceholderConfig;
  private phoneCounter: number = 0;
  private basePhone: string;
  private basePhoneDigits: string;

  constructor(config: PlaceholderConfig = DEFAULT_PLACEHOLDER_CONFIG) {
    this.config = { ...DEFAULT_PLACEHOLDER_CONFIG, ...config };
    this.basePhone = this.config.basePhoneNumber || '+1 202-555-0100';

    // Extract digits from base phone number
    this.basePhoneDigits = this.basePhone.replace(/\D/g, '');
  }

  /**
   * Get the next sequential phone number
   * Returns: base, base+1, base+2, etc.
   */
  getNextPhoneNumber(): string {
    if (this.phoneCounter === 0) {
      this.phoneCounter++;
      return this.basePhone;
    }

    // Parse the base phone number and increment
    const baseNumber = parseInt(this.basePhoneDigits, 10);
    const nextNumber = baseNumber + this.phoneCounter;
    this.phoneCounter++;

    // Convert back to phone number format
    const nextDigits = nextNumber.toString();

    // Format based on the original format
    // Most common format: +1 XXX-XXX-XXXX (11 digits)
    if (this.basePhoneDigits.length === 11 && this.basePhone.startsWith('+1')) {
      const areaCode = nextDigits.slice(1, 4);
      const exchange = nextDigits.slice(4, 7);
      const lineNumber = nextDigits.slice(7, 11);
      return `+1 ${areaCode}-${exchange}-${lineNumber}`;
    }

    // Fallback: just add + and format with dashes
    return `+${nextDigits}`;
  }

  /**
   * Get placeholder pickup address if configured
   */
  getPickupAddress(): string | undefined {
    return this.config.placeholderPickupAddress;
  }

  /**
   * Get placeholder dropoff address if configured
   */
  getDropoffAddress(): string | undefined {
    return this.config.placeholderDropoffAddress;
  }

  /**
   * Reset the phone counter (useful for processing new batches)
   */
  resetPhoneCounter(): void {
    this.phoneCounter = 0;
  }

  /**
   * Get current configuration
   */
  getConfig(): PlaceholderConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PlaceholderConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (newConfig.basePhoneNumber) {
      this.basePhone = newConfig.basePhoneNumber;
      this.basePhoneDigits = this.basePhone.replace(/\D/g, '');
      this.resetPhoneCounter();
    }
  }
}

/**
 * Global placeholder manager instance
 * Can be reconfigured per import
 */
let globalPlaceholderManager: PlaceholderManager | null = null;

/**
 * Get or create the global placeholder manager
 */
export function getPlaceholderManager(config?: PlaceholderConfig): PlaceholderManager {
  if (!globalPlaceholderManager || config) {
    globalPlaceholderManager = new PlaceholderManager(config);
  }
  return globalPlaceholderManager;
}

/**
 * Reset the global placeholder manager
 * Useful when starting a new import
 */
export function resetPlaceholderManager(config?: PlaceholderConfig): PlaceholderManager {
  globalPlaceholderManager = new PlaceholderManager(config);
  return globalPlaceholderManager;
}
