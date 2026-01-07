# Moovs Data Prep

A standalone web application for preparing contact and reservation data for import into Moovs via OneSchema.

## Features

- **Two workflows**: Contacts and Reservations
- **Two formats**: LimoAnywhere (auto-mapped) and Custom (manual mapping)
- **Data validation**: Phone numbers, emails, dates, times, addresses
- **Duplicate detection**: Identifies duplicate contacts within the file
- **Auto-fix**: Generate placeholder emails for contacts missing them
- **Preview**: Review data before export
- **Export**: Download OneSchema-compatible CSV files

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the tool.

### Usage

1. Optionally pass `?operator_id=xxx` or `?anon_operator_id=xxx` in the URL to pre-fill the operator ID
2. Select workflow (Contacts or Reservations)
3. Select format (LimoAnywhere or Custom)
4. Upload your CSV file
5. For Custom format: Map your columns to Moovs fields
6. Review analysis and fix any issues
7. Export the cleaned CSV for OneSchema upload

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

## Architecture

The core functionality is encapsulated in the `MoovsDataPrep` component (`src/components/moovs-data-prep/index.tsx`), which can be imported and used in other projects:

```tsx
import { MoovsDataPrep } from '@/components/moovs-data-prep';

// Use with optional operatorId prop
<MoovsDataPrep operatorId="your-operator-id" />
```

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TailwindCSS
- TypeScript
- libphonenumber-js (phone validation)
- papaparse (CSV parsing)
- lucide-react (icons)

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main page
│   └── layout.tsx                # Root layout
├── components/
│   └── moovs-data-prep/          # Main component (portable)
│       └── index.tsx
├── lib/                          # Utility functions
│   ├── csv-utils.ts              # CSV parsing and export
│   ├── phone-utils.ts            # Phone validation
│   ├── email-utils.ts            # Email validation and generation
│   ├── validation.ts             # Data validation logic
│   ├── limoanywhere-mappings.ts  # LimoAnywhere column mappings
│   └── cn.ts                     # Tailwind class utility
└── types/
    └── schemas.ts                # TypeScript types for OneSchema
```

## OneSchema Compatibility

Outputs conform to Moovs OneSchema templates:

### Contacts Schema
- operatorId, firstName, lastName, mobilePhone, email, homeAddress, workAddress, preferences

### Reservations Schema
- operatorId, confirmationNumber, pickUpDate, pickUpTime, dropOffDate, dropOffTime, orderType, totalGroupSize, pickUpAddress, pickUpNotes, dropOffAddress, dropOffNotes, bookingContact*, tripContact*, vehicle, tripNotes, baseRateAmt, stop1-10Address, stop1-10Notes
