/**
 * Input validation utilities
 */

import { AppError, ErrorCodes } from './errors';

export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// String validation
export function validateString(value: any, fieldName: string, options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
} = {}): ValidationResult<string> {
  if (value === undefined || value === null) {
    if (options.required) {
      return { success: false, error: `${fieldName} is required` };
    }
    return { success: true, data: '' };
  }

  const str = String(value).trim();

  if (options.required && str === '') {
    return { success: false, error: `${fieldName} cannot be empty` };
  }

  if (options.minLength && str.length < options.minLength) {
    return { success: false, error: `${fieldName} must be at least ${options.minLength} characters long` };
  }

  if (options.maxLength && str.length > options.maxLength) {
    return { success: false, error: `${fieldName} must be no more than ${options.maxLength} characters long` };
  }

  if (options.pattern && !options.pattern.test(str)) {
    return { success: false, error: `${fieldName} format is invalid` };
  }

  return { success: true, data: str };
}

// Email validation
export function validateEmail(email: any): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validateString(email, 'Email', {
    required: true,
    pattern: emailRegex
  });
}

// Password validation
export function validatePassword(password: any): ValidationResult<string> {
  return validateString(password, 'Password', {
    required: true,
    minLength: 8,
    maxLength: 128
  });
}

// Integer validation
export function validateInteger(value: any, fieldName: string, options: {
  required?: boolean;
  min?: number;
  max?: number;
} = {}): ValidationResult<number> {
  if (value === undefined || value === null) {
    if (options.required) {
      return { success: false, error: `${fieldName} is required` };
    }
    return { success: true, data: 0 };
  }

  const num = Number(value);
  if (isNaN(num) || !Number.isInteger(num)) {
    return { success: false, error: `${fieldName} must be a valid integer` };
  }

  if (options.min !== undefined && num < options.min) {
    return { success: false, error: `${fieldName} must be at least ${options.min}` };
  }

  if (options.max !== undefined && num > options.max) {
    return { success: false, error: `${fieldName} must be no more than ${options.max}` };
  }

  return { success: true, data: num };
}

// Date validation
export function validateDate(value: any, fieldName: string, options: {
  required?: boolean;
} = {}): ValidationResult<Date> {
  if (value === undefined || value === null) {
    if (options.required) {
      return { success: false, error: `${fieldName} is required` };
    }
    return { success: true, data: new Date() };
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return { success: false, error: `${fieldName} must be a valid date` };
  }

  return { success: true, data: date };
}

// Enum validation
export function validateEnum<T extends Record<string, string | number>>(
  value: any,
  enumObject: T,
  fieldName: string,
  options: { required?: boolean } = {}
): ValidationResult<T[keyof T]> {
  if (value === undefined || value === null) {
    if (options.required) {
      return { success: false, error: `${fieldName} is required` };
    }
    return { success: true, data: undefined as any };
  }

  const values = Object.values(enumObject);
  if (!values.includes(value)) {
    return { success: false, error: `${fieldName} must be one of: ${values.join(', ')}` };
  }

  return { success: true, data: value };
}

// File validation
export function validateFile(file: File | null, fieldName: string, options: {
  required?: boolean;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
} = {}): ValidationResult<File> {
  if (!file) {
    if (options.required) {
      return { success: false, error: `${fieldName} is required` };
    }
    return { success: true, data: undefined as any };
  }

  if (options.maxSize && file.size > options.maxSize) {
    return { success: false, error: `${fieldName} size must be less than ${options.maxSize / 1024 / 1024}MB` };
  }

  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return { success: false, error: `${fieldName} type must be one of: ${options.allowedTypes.join(', ')}` };
  }

  return { success: true, data: file };
}

// Combined validation for request body
export function validateRequestBody<T>(
  body: any,
  validators: Record<keyof T, (value: any) => ValidationResult>
): { success: boolean; data?: T; errors: string[] } {
  const errors: string[] = [];
  const data: any = {};

  for (const [field, validator] of Object.entries(validators) as [keyof T, (value: any) => ValidationResult][]) {
    const result = validator(body[field]);
    if (!result.success) {
      errors.push(result.error!);
    } else {
      data[field] = result.data;
    }
  }

  return {
    success: errors.length === 0,
    data: errors.length === 0 ? data : undefined,
    errors
  };
}