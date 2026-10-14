import { CCCircle, CCIndicator, CCProperties, CCStyle } from '../cardTypes.js';
import { getBoolean, isNumeric } from '../utils/objectHelpers.js';
import { getValue } from './direction.js';
import { HassEntities } from 'home-assistant-js-websocket';
import { LENGTH_TO_INDEX } from '../const.js';

// The style an element has right now: its own options, overridden by the dynamic style of the current value

/**
 * The dynamic style that applies now: the band matching the sensor value (highest from_value <= value), the unknown
 * style when the value is not a number (e.g. unknown or unavailable), or none when the value is below the first band.
 * The unknown style is filled with the element's own options for what it does not set (see getDynamicStyle).
 */
export function getActiveStyle(properties: CCProperties, entities: HassEntities): CCStyle | undefined {
  const { value } = getValue(properties.dynamic_style, entities);
  if (!isNumeric(value)) {
    return properties.dynamic_style.unknown;
  }
  const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value));
  return usableBands[usableBands.length + LENGTH_TO_INDEX];
}

export const isVisible = (properties: CCProperties, entities: HassEntities): boolean => getBoolean(getActiveStyle(properties, entities)?.show, properties.show);
export const activeColor = (properties: CCProperties, entities: HassEntities): string => getActiveStyle(properties, entities)?.color || properties.color;
export const activeSize = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.size ?? properties.size;
export const activeRadius = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.radius ?? properties.radius;
export const activeOpacity = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.opacity ?? properties.opacity;
export const activeImage = (properties: CCIndicator, entities: HassEntities): string => getActiveStyle(properties, entities)?.image || properties.image;
export const activeBackgroundImage = (properties: CCCircle, entities: HassEntities): string => getActiveStyle(properties, entities)?.background_image || properties.background_image;
