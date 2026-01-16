/**
 * Input sanitization and validation utilities for RecroPartnerPortal API routes
 * Provides XSS prevention, input validation, and data sanitization
 */

/**
 * RFC 5322 compliant email regex pattern
 * Validates: local-part@domain format with proper characters
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * URL validation pattern for solicitation links
 */
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

/**
 * Phone number pattern (basic validation, works with react-phone-number-input format)
 */
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// HTML entities to escape for XSS prevention
const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Validates a URL format (for solicitation links)
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL format
 */
export function isValidUrl(url) {
  if (typeof url !== 'string') return false;
  if (url.trim().length === 0) return true; // Empty URLs are allowed (optional field)
  return URL_REGEX.test(url.trim());
}

/**
 * Validates a phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  if (phone.trim().length === 0) return true; // Empty phone is allowed (optional field)
  return PHONE_REGEX.test(phone.replace(/[\s()-]/g, ''));
}

/**
 * Validates password complexity requirements
 * @param {string} password - The password to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result with error message
 */
export function validatePassword(password) {
  if (typeof password !== 'string') {
    return { valid: false, error: 'Password must be a string' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password must be less than 128 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      valid: false,
      error:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    };
  }

  return { valid: true };
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char]);
}

/**
 * Removes potentially dangerous patterns from strings
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  // Trim whitespace
  let sanitized = str.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters (except newlines and tabs for messages)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Escape HTML entities
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitizes a string but preserves newlines (for message/description fields)
 * @param {string} str - The string to sanitize
 * @returns {string} - Sanitized string with preserved newlines
 */
export function sanitizeMultilineString(str) {
  if (typeof str !== 'string') return str;

  // Trim whitespace
  let sanitized = str.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove control characters except newlines (\n), carriage returns (\r), and tabs (\t)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Escape HTML entities
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitizes and validates a numeric amount
 * @param {string|number} amount - The amount to sanitize
 * @returns {{ valid: boolean, value: number, error?: string }} - Sanitized amount or error
 */
export function sanitizeAmount(amount) {
  if (amount === undefined || amount === null || amount === '') {
    return { valid: false, value: 0, error: 'Amount is required' };
  }

  let numericValue;
  if (typeof amount === 'string') {
    // Remove commas and whitespace
    numericValue = parseFloat(amount.replace(/,/g, '').trim());
  } else {
    numericValue = Number(amount);
  }

  if (isNaN(numericValue)) {
    return { valid: false, value: 0, error: 'Invalid amount format' };
  }

  if (numericValue <= 0) {
    return { valid: false, value: 0, error: 'Amount must be greater than 0' };
  }

  // Round to 2 decimal places for currency
  numericValue = Math.round(numericValue * 100) / 100;

  return { valid: true, value: numericValue };
}

/**
 * Sanitizes an object's string properties recursively
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - Object with sanitized string values
 */
export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

/**
 * Validates that all required string fields are present and are strings
 * @param {Object} obj - The object to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export function validateRequiredStrings(obj, requiredFields) {
  for (const field of requiredFields) {
    if (typeof obj[field] !== 'string') {
      return { valid: false, error: `Invalid ${field} format` };
    }
    if (obj[field].trim().length === 0) {
      return { valid: false, error: `${field} is required` };
    }
  }
  return { valid: true };
}

/**
 * Validates that optional string fields are strings if provided
 * @param {Object} obj - The object to validate
 * @param {string[]} optionalFields - Array of optional field names
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export function validateOptionalStrings(obj, optionalFields) {
  for (const field of optionalFields) {
    if (obj[field] !== undefined && obj[field] !== null && obj[field] !== '') {
      if (typeof obj[field] !== 'string') {
        return { valid: false, error: `${field} must be a string` };
      }
    }
  }
  return { valid: true };
}

/**
 * Sanitizes signup form data
 * @param {Object} data - The signup form data
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeSignupData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  const requiredFields = ['email', 'password', 'firstName', 'lastName', 'organization', 'phone'];
  const validation = validateRequiredStrings(data, requiredFields);
  if (!validation.valid) {
    return validation;
  }

  // Validate email format
  if (!isValidEmail(data.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate password complexity
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  // Validate phone format
  if (!isValidPhone(data.phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  return {
    valid: true,
    data: {
      email: sanitizeString(data.email).toLowerCase(),
      password: data.password, // Don't sanitize password - it will be hashed
      firstName: sanitizeString(data.firstName),
      lastName: sanitizeString(data.lastName),
      organization: sanitizeString(data.organization),
      phone: sanitizeString(data.phone),
    },
  };
}

/**
 * Sanitizes login credentials
 * @param {Object} data - The login data
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeLoginData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  if (typeof data.email !== 'string' || typeof data.password !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }

  if (!data.email.trim() || !data.password) {
    return { valid: false, error: 'Email and password are required' };
  }

  return {
    valid: true,
    data: {
      email: sanitizeString(data.email).toLowerCase(),
      password: data.password, // Don't sanitize password
    },
  };
}

/**
 * Sanitizes deal/ticket submission data
 * @param {Object} deal - The deal object from form submission
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeDealData(deal) {
  if (!deal || typeof deal !== 'object') {
    return { valid: false, error: 'Invalid deal data' };
  }

  // Validate required fields
  const requiredValidation = validateRequiredStrings(deal, ['subject', 'description']);
  if (!requiredValidation.valid) {
    return { valid: false, error: 'Not all required fields were filled out' };
  }

  // Validate and sanitize amount
  const amountResult = sanitizeAmount(deal.amount);
  if (!amountResult.valid) {
    return { valid: false, error: amountResult.error };
  }

  // Validate optional string fields
  const optionalValidation = validateOptionalStrings(deal, [
    'agency',
    'program',
    'vehicle',
    'solicitationLink',
  ]);
  if (!optionalValidation.valid) {
    return optionalValidation;
  }

  // Validate URL format for solicitation link
  if (deal.solicitationLink && !isValidUrl(deal.solicitationLink)) {
    return { valid: false, error: 'Invalid solicitation link URL format' };
  }

  return {
    valid: true,
    data: {
      subject: sanitizeString(deal.subject),
      description: sanitizeMultilineString(deal.description),
      amount: amountResult.value,
      agency: sanitizeString(deal.agency || ''),
      program: sanitizeString(deal.program || ''),
      vehicle: sanitizeString(deal.vehicle || ''),
      solicitationLink: sanitizeString(deal.solicitationLink || ''),
    },
  };
}

/**
 * Sanitizes contact form data
 * @param {Object} form - The form data object
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeContactFormData(form) {
  if (!form || typeof form !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  // Validate required fields
  const requiredValidation = validateRequiredStrings(form, [
    'email',
    'subject',
    'message',
    'firstName',
    'lastName',
  ]);
  if (!requiredValidation.valid) {
    return { valid: false, error: 'Missing required fields' };
  }

  // Validate email format
  if (!isValidEmail(form.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Validate optional fields
  const optionalValidation = validateOptionalStrings(form, ['organization', 'phone']);
  if (!optionalValidation.valid) {
    return optionalValidation;
  }

  // Validate phone if provided
  if (form.phone && !isValidPhone(form.phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  return {
    valid: true,
    data: {
      firstName: sanitizeString(form.firstName),
      lastName: sanitizeString(form.lastName),
      email: sanitizeString(form.email).toLowerCase(),
      subject: sanitizeString(form.subject),
      message: sanitizeMultilineString(form.message),
      organization: form.organization ? sanitizeString(form.organization) : null,
      phone: form.phone ? sanitizeString(form.phone) : null,
    },
  };
}

/**
 * Sanitizes user profile update data
 * @param {Object} data - The profile update data
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeProfileData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  const sanitized = {};

  // Validate and sanitize email if provided
  if (data.email !== undefined) {
    if (typeof data.email !== 'string') {
      return { valid: false, error: 'Invalid email format' };
    }
    if (!isValidEmail(data.email)) {
      return { valid: false, error: 'Invalid email format' };
    }
    sanitized.email = sanitizeString(data.email).toLowerCase();
  }

  // Validate and sanitize name fields if provided
  if (data.firstName !== undefined) {
    if (typeof data.firstName !== 'string') {
      return { valid: false, error: 'Invalid firstName format' };
    }
    sanitized.firstName = sanitizeString(data.firstName);
  }

  if (data.lastName !== undefined) {
    if (typeof data.lastName !== 'string') {
      return { valid: false, error: 'Invalid lastName format' };
    }
    sanitized.lastName = sanitizeString(data.lastName);
  }

  // Validate and sanitize interests array if provided
  if (data.interests !== undefined) {
    if (!Array.isArray(data.interests)) {
      return { valid: false, error: 'Interests must be an array' };
    }
    sanitized.interests = data.interests
      .filter((i) => typeof i === 'string')
      .map((i) => sanitizeString(i));
  }

  return { valid: true, data: sanitized };
}

/**
 * Sanitizes password reset data
 * @param {Object} data - The password reset data
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizePasswordResetData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  if (typeof data.resetToken !== 'string' || typeof data.newPassword !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }

  if (!data.resetToken.trim()) {
    return { valid: false, error: 'Reset token is required' };
  }

  // Validate password complexity
  const passwordValidation = validatePassword(data.newPassword);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  // Validate token format (should be hex string from crypto.randomBytes)
  if (!/^[a-f0-9]{64}$/i.test(data.resetToken.trim())) {
    return { valid: false, error: 'Invalid reset token format' };
  }

  return {
    valid: true,
    data: {
      resetToken: data.resetToken.trim(),
      newPassword: data.newPassword, // Don't sanitize password
    },
  };
}

/**
 * Sanitizes download tracking data
 * @param {Object} data - The download data
 * @returns {{ valid: boolean, data?: Object, error?: string }} - Sanitized data or error
 */
export function sanitizeDownloadData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid input' };
  }

  if (typeof data.pdfUrl !== 'string' || typeof data.type !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }

  const validTypes = ['Paper', 'Sheet', 'Statements'];
  if (!validTypes.includes(data.type)) {
    return { valid: false, error: 'Invalid download type' };
  }

  return {
    valid: true,
    data: {
      pdfUrl: sanitizeString(data.pdfUrl),
      type: data.type,
      relativePath: data.relativePath ? sanitizeString(data.relativePath) : '',
    },
  };
}

/**
 * Sanitizes pagination parameters
 * @param {Object} query - The query parameters
 * @param {number} maxLimit - Maximum allowed limit (default 200)
 * @returns {{ limit: number, offset: number }} - Sanitized pagination params
 */
export function sanitizePagination(query, maxLimit = 200) {
  const limit = query?.limit
    ? Math.min(Math.max(1, parseInt(query.limit, 10) || 100), maxLimit)
    : 100;
  const offset = query?.offset ? Math.max(0, parseInt(query.offset, 10) || 0) : 0;

  return { limit, offset };
}
