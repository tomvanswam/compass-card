import { CCCircle, CCIndicator, CCProperties, CCStyle } from '../cardTypes.js';
import { getBoolean, isNumeric } from '../utils/objectHelpers.js';
import { getValue, parseDirection } from './direction.js';
import { HassEntities } from 'home-assistant-js-websocket';
import { LENGTH_TO_INDEX } from '../const.js';

// The style an element has right now: its own options, overridden by the dynamic style of the current value

const styleCache = new WeakMap<HassEntities, WeakMap<CCProperties, CCStyle | undefined>>();

function computeActiveStyle(properties: CCProperties, entities: HassEntities): CCStyle | undefined {
  // compare the unrounded value with the bands
  const { value } = getValue(properties.dynamic_style, entities, true);
  if (!isNumeric(value)) {
    // text that is a direction ('NNE', '275 °') is a known value: no band applies, but it is not unknown either
    return parseDirection(String(value), undefined).unknown ? properties.dynamic_style.unknown : undefined;
  }
  const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value));
  return usableBands[usableBands.length + LENGTH_TO_INDEX];
}

/**
 * The dynamic style that applies now: the band matching the sensor value (highest from_value <= value), the unknown
 * style when the value is not a number (e.g. unknown or unavailable), or none when the value is below the first band.
 * The unknown style is filled with the element's own options for what it does not set (see getDynamicStyle).
 */
export function getActiveStyle(properties: CCProperties, entities: HassEntities): CCStyle | undefined {
  // the active* helpers below ask for the same style several times per render; hass replaces entities on every update
  let cache = styleCache.get(entities);
  if (!cache) {
    cache = new WeakMap();
    styleCache.set(entities, cache);
  }
  if (cache.has(properties)) return cache.get(properties);
  const style = computeActiveStyle(properties, entities);
  cache.set(properties, style);
  return style;
}

export const isVisible = (properties: CCProperties, entities: HassEntities): boolean => getBoolean(getActiveStyle(properties, entities)?.show, properties.show);
export const activeColor = (properties: CCProperties, entities: HassEntities): string => getActiveStyle(properties, entities)?.color || properties.color;
export const activeSize = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.size ?? properties.size;
export const activeRadius = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.radius ?? properties.radius;
export const activeOpacity = (properties: CCIndicator, entities: HassEntities): number => getActiveStyle(properties, entities)?.opacity ?? properties.opacity;
export const activeImage = (properties: CCIndicator, entities: HassEntities): string => getActiveStyle(properties, entities)?.image || properties.image;
export const activeBackgroundImage = (properties: CCCircle, entities: HassEntities): string => getActiveStyle(properties, entities)?.background_image || properties.background_image;
