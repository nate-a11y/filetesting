import Papa from 'papaparse';
import type { OneSchemaContact, OneSchemaReservation, ColumnMapping, DataIssue } from '@/types/schemas';

// Parse CSV file
export function parseCSV(file: File): Promise<{ headers: string[]; data: string[][] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length === 0) {
          reject(new Error('Empty CSV file'));
          return;
        }
        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell.trim() !== ''));
        resolve({ headers, data: rows });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Apply column mappings to raw data
export function applyMappings(
  headers: string[],
  data: string[][],
  mappings: ColumnMapping[]
): Record<string, string>[] {
  return data.map((row) => {
    const result: Record<string, string> = {};

    mappings.forEach((mapping) => {
      const sourceIndex = headers.indexOf(mapping.sourceColumn);

      if (mapping.transform === 'combine' && mapping.combineWith) {
        // Combine multiple columns
        const values = [mapping.sourceColumn, ...mapping.combineWith]
          .map((col) => {
            const idx = headers.indexOf(col);
            return idx >= 0 ? row[idx]?.trim() : '';
          })
          .filter(Boolean);
        result[mapping.targetField] = values.join(', ');
      } else if (sourceIndex >= 0) {
        result[mapping.targetField] = row[sourceIndex]?.trim() || '';
      }
    });

    return result;
  });
}

// Generate CSV string from data
export function generateCSV(data: Record<string, string>[], headers: string[]): string {
  const rows = [headers];

  data.forEach((row) => {
    const values = headers.map((h) => {
      const value = row[h] || '';
      // Escape quotes and wrap in quotes if contains comma or quote
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    rows.push(values);
  });

  return rows.map((r) => r.join(',')).join('\n');
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// OneSchema Contact headers
export const CONTACT_HEADERS = [
  'operatorId',
  'firstName',
  'lastName',
  'mobilePhone',
  'email',
  'homeAddress',
  'workAddress',
  'preferences',
];

// OneSchema Reservation headers
export const RESERVATION_HEADERS = [
  'operatorId',
  'confirmationNumber',
  'pickUpDate',
  'pickUpTime',
  'dropOffDate',
  'dropOffTime',
  'orderType',
  'totalGroupSize',
  'pickUpAddress',
  'pickUpNotes',
  'dropOffAddress',
  'dropOffNotes',
  'bookingContactFirstName',
  'bookingContactLastName',
  'bookingContactEmail',
  'bookingContactPhoneNumber',
  'tripContactFirstName',
  'tripContactLastName',
  'tripContactEmail',
  'tripContactPhoneNumber',
  'vehicle',
  'tripNotes',
  'baseRateAmt',
  'stop1Address',
  'stop1Notes',
  'stop2Address',
  'stop2Notes',
  'stop3Address',
  'stop3Notes',
  'stop4Address',
  'stop4Notes',
  'stop5Address',
  'stop5Notes',
  'stop6Address',
  'stop6Notes',
  'stop7Address',
  'stop7Notes',
  'stop8Address',
  'stop8Notes',
  'stop9Address',
  'stop9Notes',
  'stop10Address',
  'stop10Notes',
];
