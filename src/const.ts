import { localize } from './localize/localize';

export const CARD_VERSION = '0.2.1';
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
export const COMPASS_ABBREVIATIONS = Object.keys(COMPASS_POINTS);
export const UNAVAILABLE = localize('common.invalid');

export const INDICATORS = ['arrow_outward', 'arrow_inward', 'circle'];

export const CONFIG_ENTITY = 'entity';
export const CONFIG_SECONDARY_ENTITY = 'secondary_entity';
export const CONFIG_COMPASS = 'compass';
export const CONFIG_INDICATOR = 'indicator';
export const CONFIG_DIRECTION_OFFSET = 'direction_offset';
export const CONFIG_NAME = 'name';
export const CONFIG_SHOW_NORTH = 'show_north';
export const CONFIG_DOMAINS = ['sensor', 'input_number', 'input_text'];
