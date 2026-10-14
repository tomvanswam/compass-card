import { CCDirectionInfo, CCEntity, CCValue } from '../cardTypes.js';
import { COMPASS_ABBREVIATIONS, COMPASS_POINTS, DEGREES_MAX, DEGREES_MIN, DEGREES_ONE, DEGREES_PER_ABBREVIATION, INDEX_ELEMENT_0, UNAVAILABLE, UNKNOWN_STATES } from '../const.js';
import { isNumeric, resolveAttrPath } from '../utils/objectHelpers.js';
import { HassEntities } from 'home-assistant-js-websocket';
import { localize } from '../localize/localize.js';

// Reading sensor values and turning them into a compass direction

const NOT_A_DIRECTION = DEGREES_MIN - DEGREES_ONE;
const ENTITY_PATH_PARTS = 2;

// Any angle as 0 <= degrees < 360
export function positiveDegrees(degrees: number): number {
  return degrees < DEGREES_MIN ? degrees + (Math.abs(Math.ceil(degrees / DEGREES_MAX)) + DEGREES_ONE) * DEGREES_MAX : degrees % DEGREES_MAX;
}

// Degrees of a compass point name like 'NNE', or -1 when it is no compass point
export function getDegrees(abbreviation: string): number {
  const key = abbreviation.toUpperCase() as keyof typeof COMPASS_POINTS;
  return COMPASS_POINTS[key] ?? NOT_A_DIRECTION;
}

// The nearest of the 16 compass point names, translated
export function getCompassAbbreviation(degrees: number, language: string | undefined): string {
  const index = Math.round(positiveDegrees(degrees) / DEGREES_PER_ABBREVIATION);
  const name = index >= COMPASS_ABBREVIATIONS.length ? COMPASS_ABBREVIATIONS[INDEX_ELEMENT_0] : COMPASS_ABBREVIATIONS[index];
  return localize(`directions.${name}`, '', '', language);
}

// The (formatted) value of a sensor or of one of its attributes (sensor 'domain.object.attribute.path')
export function getValue(entity: CCEntity, entities: HassEntities): CCValue {
  const format = (value: string) => (isNumeric(value) ? Number(value).toFixed(entity.decimals) : value);
  if (entity.is_attribute) {
    const parts = entity.sensor.split('.');
    const entityObj = entities[parts.slice(INDEX_ELEMENT_0, ENTITY_PATH_PARTS).join('.')];
    if (entityObj?.attributes) {
      const value = resolveAttrPath(entityObj.attributes, parts.slice(ENTITY_PATH_PARTS).join('.')) ?? UNAVAILABLE;
      return { units: entity.units, value: format(value) };
    }
    return { units: entity.units, value: UNAVAILABLE };
  }
  return { units: entity.units, value: format(entities[entity.sensor]?.state || UNAVAILABLE) };
}

/**
 * Direction of a sensor value: degrees (a number, or a number inside a text) or a compass point name.
 * unknown is set when the value is no direction at all (e.g. unavailable).
 */
export function parseDirection(value: string, language: string | undefined): CCDirectionInfo {
  let degrees: number;
  let unknown = false;
  if (Number.isNaN(Number(value))) {
    degrees = getDegrees(value);
    if (degrees === NOT_A_DIRECTION) {
      const matches = value.replace(/\s+/g, '').match(/[+-]?\d+(?:\.\d)?/);
      if (matches?.length) {
        degrees = positiveDegrees(parseFloat(matches[INDEX_ELEMENT_0]));
      } else {
        degrees = DEGREES_MIN;
        unknown = true;
      }
    }
  } else {
    degrees = positiveDegrees(parseFloat(value));
  }
  if (UNKNOWN_STATES.includes(String(value).toLowerCase())) {
    unknown = true;
  }
  return { abbreviation: getCompassAbbreviation(degrees, language), degrees: Math.round(degrees), unknown };
}
