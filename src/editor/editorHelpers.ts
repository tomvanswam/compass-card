import { NO_ELEMENTS } from '../const';

// Values the editor treats as "not set": cleared ha-form fields come back as undefined or ''
function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}

/**
 * Sets obj[key] to value, or removes the key when the value is empty or equals its default.
 * Keeps the YAML minimal: only options that differ from the card defaults are written.
 */
export function setOrDelete<T extends object, K extends keyof T>(obj: T, key: K, value: T[K] | undefined, defaultValue?: T[K]): void {
  if (isEmpty(value) || value === defaultValue) {
    delete obj[key];
  } else {
    obj[key] = value as T[K];
  }
}

/**
 * Returns a copy of base with updates applied via setOrDelete, or undefined when nothing is left.
 */
export function updateObject<T extends object>(base: T | undefined, updates: Partial<T>, defaults: Partial<T> = {}): T | undefined {
  const result = { ...base } as T;
  (Object.keys(updates) as (keyof T)[]).forEach((key) => setOrDelete(result, key, updates[key], defaults[key]));
  return Object.keys(result).length === NO_ELEMENTS ? undefined : result;
}
