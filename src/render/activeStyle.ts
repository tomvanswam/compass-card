import { CCCircle, CCIndicator, CCProperties, CCStyleBand } from '../cardTypes.js';
import { getBoolean, isNumeric } from '../utils/objectHelpers.js';
import { LENGTH_TO_INDEX, NO_ELEMENTS } from '../const.js';
import { getValue } from './direction.js';
import { HassEntities } from 'home-assistant-js-websocket';

// The style an element has right now: its own options, overridden by the dynamic style band of the current value

/**
 * The dynamic style band matching the current sensor value (highest from_value <= value), if any.
 */
export function getActiveBand(properties: CCProperties, entities: HassEntities): CCStyleBand | undefined {
  const { bands } = properties.dynamic_style;
  if (bands.length === NO_ELEMENTS) {
    return undefined;
  }
  const { value } = getValue(properties.dynamic_style, entities);
  if (!isNumeric(value)) {
    return undefined;
  }
  const usableBands = bands.filter((band) => band.from_value <= Number(value));
  return usableBands[usableBands.length + LENGTH_TO_INDEX];
}

export const isVisible = (properties: CCProperties, entities: HassEntities): boolean => getBoolean(getActiveBand(properties, entities)?.show, properties.show);
export const activeColor = (properties: CCProperties, entities: HassEntities): string => getActiveBand(properties, entities)?.color || properties.color;
export const activeSize = (properties: CCIndicator, entities: HassEntities): number => getActiveBand(properties, entities)?.size ?? properties.size;
export const activeRadius = (properties: CCIndicator, entities: HassEntities): number => getActiveBand(properties, entities)?.radius ?? properties.radius;
export const activeOpacity = (properties: CCIndicator, entities: HassEntities): number => getActiveBand(properties, entities)?.opacity ?? properties.opacity;
export const activeImage = (properties: CCIndicator, entities: HassEntities): string => getActiveBand(properties, entities)?.image || properties.image;
export const activeBackgroundImage = (properties: CCCircle, entities: HassEntities): string => getActiveBand(properties, entities)?.background_image || properties.background_image;
