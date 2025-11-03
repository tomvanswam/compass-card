import { localize } from './localize/localize';

export const CARD_VERSION = '3.2.1';
export const ICONS = {
  compass: 'mdi:compass',
};
export const COMPASS_POINTS = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
};
export const COMPASS_ABBREVIATIONS = [...Object.keys(COMPASS_POINTS)];

export const UNAVAILABLE = localize('common.invalid');

export const ICON_VALUES = ['arrow_inward', 'arrow_outward', 'circle'] as const;
export type IconValue = (typeof ICON_VALUES)[number];
export const DEFAULT_ICON_VALUE: IconValue = ICON_VALUES[1];

export const CIRCLE = {
  RADIUS: 62,
  CENTER: 76,
};
