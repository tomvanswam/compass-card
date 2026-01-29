/* eslint-disable sort-keys */
import { localize } from './localize/localize.js';

export const CARD_VERSION = '3.4.0';
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

export const ICON_VALUES = ['arrow_inward', 'arrow_outward', 'circle'] as const;
export const [, DEFAULT_ICON_VALUE] = ICON_VALUES;
export type IconValue = (typeof ICON_VALUES)[number];

export const CIRCLE = {
  CENTER: 76,
  RADIUS: 62,
};
export const UNAVAILABLE = localize('common.invalid');
export const DEFAULT_CARD_SIZE = 4;
export const DEFAULT_CIRCLE_STROKE_WIDTH = 2;
export const DEFAULT_DECIMALS = 0;
export const DEFAULT_INDICATOR_RADIUS = 62;
export const DEFAULT_INDICATOR_SIZE = 19;
export const DEFAULT_TICK_STEP = 15;
export const DEFAULT_SECTIONS_SIZE = {
  COLUMNS_DEFAULT: 12,
  COLUMNS_MIN: 1,
  ROWS_DEFAULT: 3,
  ROWS_MIN: 1,
};
export const DEFAULT_START_SIZE = 0;
export const DEGREES_MAX = 360;
export const DEGREES_MID = 180;
export const DEGREES_QRT = 90;
export const DEGREES_MIN = 0;
export const DEGREES_ONE = 1;
export const DEGREES_PER_ABBREVIATION = 22.5;
export const HALF = 0.5;
export const INDEX_ELEMENT_0 = 0;
export const LENGTH_TO_INDEX = -1;
export const MAX_INDICATOR_ARRAY_SIZE = 10;
export const MAX_PERCENTAGE = 100;
export const MIN_INDICATOR_ARRAY_SIZE = 1;
export const MIN_PERCENTAGE = 0;
export const NO_ELEMENTS = 0;
export const CENTER_OBJECT_FACTOR = 0.5;
export const OPACITY_TRANSPARENT = 0;
export const OPACITY_VISIBLE = 1;
export const RADIUS_TO_DIAMETER_FACTOR = 2;
export const SVG_SCALE_MAX = 100;
export const SVG_SCALE_MIN = 0;
export const TICKS_OUTER_RADIUS_OFFSET = 2;
export const TICKS_TOLERANCE_DEGREE = 1;
export const BASE_TICK_INNER_RADIUS_LENGTH = 4;
export const MINOR_TICK_INNER_RADIUS_LENGTH = 6;
export const MEDIUM_TICK_INNER_RADIUS_LENGTH = 8;
export const MAJOR_TICK_INNER_RADIUS_LENGTH = 10;
export const MAJOR_TICK_ANGLE = 22.5;
