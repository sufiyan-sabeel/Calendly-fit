export interface ValidationResult { isValid: boolean; error: string | null; }

export function validateEmail(email: string): ValidationResult {
  if (!email?.trim()) return { isValid: false, error: 'Email is required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { isValid: false, error: 'Please enter a valid email address' };
  return { isValid: true, error: null };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: 'Password must contain an uppercase letter' };
  if (!/[a-z]/.test(password)) return { isValid: false, error: 'Password must contain a lowercase letter' };
  if (!/[0-9]/.test(password)) return { isValid: false, error: 'Password must contain a number' };
  return { isValid: true, error: null };
}

export function validateName(name: string, field = 'Name'): ValidationResult {
  if (!name?.trim()) return { isValid: false, error: `${field} is required` };
  if (name.trim().length < 2) return { isValid: false, error: `${field} must be at least 2 characters` };
  if (name.trim().length > 50) return { isValid: false, error: `${field} is too long` };
  return { isValid: true, error: null };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone?.trim()) return { isValid: false, error: 'Phone is required' };
  const c = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!/^\d{7,15}$/.test(c)) return { isValid: false, error: 'Please enter a valid phone number' };
  return { isValid: true, error: null };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  return value?.trim() ? { isValid: true, error: null } : { isValid: false, error: `${fieldName} is required` };
}

export function validateForm<T extends Record<string, string>>(
  data: T,
  validators: Record<keyof T, (val: string) => ValidationResult>
): Record<string, string | null> {
  const errors: Record<string, string | null> = {};
  for (const [field, fn] of Object.entries(validators)) {
    errors[field] = fn(data[field]).isValid ? null : fn(data[field]).error;
  }
  return errors;
}

export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some((e) => e !== null);
}
