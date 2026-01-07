// Validate email format
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}

// Normalize email for comparison
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Generate deterministic placeholder email
// Uses name + phone (partial) to ensure same person gets same email
export function generatePlaceholderEmail(
  firstName: string,
  lastName: string,
  phone?: string
): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '') || 'unknown';
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '') || 'contact';

  // Use phone digits as part of the email to make it unique but deterministic
  let suffix = '';
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    suffix = `.${digits.slice(-4)}`;
  } else {
    // Generate a hash from the name
    const seed = `${cleanFirst}${cleanLast}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash;
    }
    suffix = `.${Math.abs(hash).toString().slice(0, 4)}`;
  }

  return `${cleanFirst}.${cleanLast}${suffix}@import.moovs.com`;
}
