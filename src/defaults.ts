import { CIRCLE, DEFAULT_CIRCLE_STROKE_WIDTH, DEFAULT_DECIMALS, DEFAULT_ICON_VALUE, DEFAULT_INDICATOR_RADIUS, DEFAULT_INDICATOR_SIZE, DEFAULT_TICK_STEP, DEGREES_MIN, INDEX_ELEMENT_0, OPACITY_TRANSPARENT, OPACITY_VISIBLE, SVG_SCALE_MIN } from './const.js';

/*
 * Single source of truth for the defaults the card applies to options that are missing from the config.
 * Used by objectHelpers.ts (rendering), the editor (displayed values and which values are left out of the YAML)
 * and getStubConfig (new cards). Change a default here and all three stay in sync.
 */
export const CONFIG_DEFAULTS = {
  compass: {
    circle: { offset_background: true, show: true, stroke_width: DEFAULT_CIRCLE_STROKE_WIDTH },
    east: { show: false },
    north: { offset: DEGREES_MIN, show: false },
    // 0 lets the card pick the scale that fits all indicators
    scale: SVG_SCALE_MIN,
    south: { show: false },
    ticks: { radius: CIRCLE.RADIUS, show: false, step: DEFAULT_TICK_STEP },
    west: { show: false },
  },
  indicator_sensor: {
    decimals: DEFAULT_DECIMALS,
    indicator: { image: DEFAULT_ICON_VALUE, opacity: OPACITY_VISIBLE, radius: DEFAULT_INDICATOR_RADIUS, show: true, size: DEFAULT_INDICATOR_SIZE },
    state_units: { show: false },
    state_value: { show: false },
  },
  value_sensor: {
    decimals: DEFAULT_DECIMALS,
    state_units: { show: true },
    state_value: { show: true },
  },
} as const;

// Defaults that depend on other config values

export function headerTitleShowDefault(title: string | undefined): boolean {
  return title !== undefined;
}

export function headerIconShowDefault(icon: string | undefined, title: string | undefined): boolean {
  return Boolean(icon) || Boolean(title);
}

// Only the first (valid) indicator shows its direction abbreviation by default
export function abbreviationShowDefault(index: number): boolean {
  return index === INDEX_ELEMENT_0;
}

export function backgroundOpacityDefault(backgroundImage: string | undefined): number {
  return backgroundImage ? OPACITY_VISIBLE : OPACITY_TRANSPARENT;
}
