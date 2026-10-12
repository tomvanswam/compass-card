import { css } from 'lit';
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

// An object without keys becomes undefined, so setOrDelete removes it from the config
export function withoutEmpty<T extends object>(value: T | undefined): T | undefined {
  return value && Object.keys(value).length > NO_ELEMENTS ? value : undefined;
}

// Show switch with the color field to its right on one row; the minimum column width keeps them side by side
export function showColorRow() {
  return {
    column_min_width: '120px',
    name: '',
    schema: [
      { name: 'show', selector: { boolean: {} } },
      { name: 'color', selector: { text: {} } },
    ],
    type: 'grid',
  };
}

// Opacity is edited as a 0-100% slider in 1% steps and stored in the YAML as 0-1
const PERCENT = 100;
export function opacitySelector() {
  return { number: { max: PERCENT, min: 0, mode: 'slider', step: 1, unit_of_measurement: '%' } };
}

export function opacityToPercent(opacity: number | undefined): number | undefined {
  return opacity === undefined ? undefined : Math.round(opacity * PERCENT);
}

// previous: the stored value; kept as is (e.g. 0.333) while the slider still shows its rounded percentage
export function opacityFromPercent(percent: number | undefined, previous?: number): number | undefined {
  if (percent === undefined || percent === null) return undefined;
  if (previous !== undefined && opacityToPercent(previous) === percent) return previous;
  return Math.round(percent) / PERCENT;
}

// Styles shared by the editor components
// Vertical stack inside a block, spaced like the main editor groups
export const contentStyles = css`
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    padding: 8px 0;
  }
`;

export const editorStyles = css`
  ${contentStyles}
  ha-form {
    width: 100%;
  }
`;

// Detail editors (indicator, value): title row with back button, then the groups
export const detailEditorStyles = css`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .back-title {
    display: flex;
    align-items: center;
    font-size: 18px;
  }
  /* general settings, one block per part and the tap action, spaced like the main editor groups */
  .groups {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
  }
  ${contentStyles}
`;
