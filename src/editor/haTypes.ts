// Types for Home Assistant's ha-form as used by the editors

// One field (with a selector) or a layout item (grid / expandable with its own schema)
export interface HaFormSchemaItem {
  column_min_width?: string;
  helper?: string;
  name: string;
  required?: boolean;
  schema?: readonly HaFormSchemaItem[];
  selector?: object;
  title?: string;
  type?: 'expandable' | 'grid';
}

export type HaFormSchema = readonly HaFormSchemaItem[];

/**
 * Values of an ha-form. The fields of each form differ, so the values are loosely typed here and checked where
 * they are written into the card configuration (setOrDelete / updateObject and the superstruct schema).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HaFormData = Record<string, any>;

// eslint-disable-next-line no-unused-vars
export type HaFormComputeText = (schema: HaFormSchemaItem) => string;

// The value-changed event of ha-form
export type HaFormValueChanged = CustomEvent<{ value: HaFormData }>;
