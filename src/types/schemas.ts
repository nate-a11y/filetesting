// OneSchema Contact Schema
export interface OneSchemaContact {
  operatorId: string;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  homeAddress?: string;
  workAddress?: string;
  preferences?: string;
}

// OneSchema Reservation Schema
export interface OneSchemaReservation {
  operatorId: string;
  confirmationNumber?: string;
  pickUpDate: string; // MM/DD/YYYY
  pickUpTime: string; // HH:MM AM/PM
  dropOffDate?: string;
  dropOffTime?: string;
  orderType: OrderType;
  totalGroupSize: number;
  pickUpAddress: string;
  pickUpNotes?: string;
  dropOffAddress: string;
  dropOffNotes?: string;
  bookingContactFirstName: string;
  bookingContactLastName: string;
  bookingContactEmail: string;
  bookingContactPhoneNumber: string;
  tripContactFirstName: string;
  tripContactLastName: string;
  tripContactEmail: string;
  tripContactPhoneNumber: string;
  vehicle: string;
  tripNotes?: string;
  baseRateAmt?: number;
  stop1Address?: string;
  stop1Notes?: string;
  stop2Address?: string;
  stop2Notes?: string;
  stop3Address?: string;
  stop3Notes?: string;
  stop4Address?: string;
  stop4Notes?: string;
  stop5Address?: string;
  stop5Notes?: string;
  stop6Address?: string;
  stop6Notes?: string;
  stop7Address?: string;
  stop7Notes?: string;
  stop8Address?: string;
  stop8Notes?: string;
  stop9Address?: string;
  stop9Notes?: string;
  stop10Address?: string;
  stop10Notes?: string;
}

// Valid Order Types
export const ORDER_TYPES = [
  'airport', 'airport-drop-off', 'airport-pick-up', 'bachelor-bachelorette', 'bar',
  'bar-bat-mitzvah', 'baseball', 'basketball', 'birthday', 'birthday-21', 'brew-tour',
  'bridal-party', 'bride-groom', 'business-trip', 'concert', 'corporate', 'family-reunion',
  'field-trip', 'football', 'funeral', 'golf', 'graduation', 'hockey', 'holiday', 'kids-birthday',
  'leisure', 'medical', 'night-out', 'personal-trip', 'point-to-point', 'prom-homecoming',
  'quinceanera', 'retail', 'school', 'school-fundraiser', 'seaport', 'special-occasion',
  'sporting-event', 'sweet-16', 'train-station', 'wedding', 'wine-tour'
] as const;

export type OrderType = typeof ORDER_TYPES[number];

// Workflow types
export type WorkflowType = 'contacts' | 'reservations';
export type FormatType = 'limoanywhere' | 'hudson' | 'custom';

// Column mapping
export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  transform?: 'combine' | 'none';
  combineWith?: string[];
}

// Issue types - 'info' is for informational notes that don't require action
export interface DataIssue {
  rowIndex: number;
  field: string;
  type: 'missing' | 'invalid' | 'duplicate' | 'info';
  message: string;
  currentValue?: string;
  suggestedValue?: string;
}

// Contact for deduplication
export interface ParsedContact {
  rowIndex: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  originalData: Record<string, string>;
}

// Duplicate group
export interface DuplicateGroup {
  contacts: ParsedContact[];
  matchReason: string;
}

// Workflow state
export interface WorkflowState {
  step: 'select-workflow' | 'select-format' | 'upload-contacts' | 'upload' | 'map-columns' | 'analyze' | 'fix-issues' | 'preview' | 'export';
  workflow: WorkflowType | null;
  format: FormatType | null;
  rawData: string[][];
  headers: string[];
  columnMappings: ColumnMapping[];
  parsedData: Record<string, string>[];
  issues: DataIssue[];
  duplicates: DuplicateGroup[];
  operatorId: string;
  uploadedContacts?: Record<string, string>[]; // Optional contacts for reservation matching
}
