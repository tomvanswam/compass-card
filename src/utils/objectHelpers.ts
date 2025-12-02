import { CCColors, CCCompass, CCDynamicStyle, CCHeader, CCIndicatorSensor, CCSensorAttrib, CCStyleBand, CCValueSensor } from '../cardTypes.js';
import { CCDynamicStyleConfig, CCIndicatorSensorConfig, CCStyleBandConfig, CCValueSensorConfig, CompassCardConfig } from '../editorTypes.js';
import { DEFAULT_CIRCLE_STROKE_WIDTH, DEFAULT_DECIMALS, DEFAULT_ICON_VALUE, DEFAULT_INDICATOR_RADIUS, DEFAULT_INDICATOR_SIZE, DEFAULT_RADIUS_SIZE, DEFAULT_START_SIZE, DEGREES_MIN, ICON_VALUES, ICONS, INDEX_ELEMENT_0, LENGTH_TO_INDEX, NO_ELEMENTS, OPACITY_TRANSPARENT, OPACITY_VISIBLE, SVG_SCALE_MIN, TO_PERCENTAGE_FACTOR } from '../const.js';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';

export function getBoolean(value: boolean | number | string | undefined, defValue: boolean): boolean {
  if (value === undefined) {
    return defValue;
  }
  return Boolean(value).valueOf();
}

function getSensorAttrib(config: CompassCardConfig, dynStyle: CCDynamicStyleConfig | undefined, entities: HassEntities): CCSensorAttrib {
  const sa: CCSensorAttrib = {
    attribute: config.indicator_sensors[0]?.attribute || '',
    decimals: config.indicator_sensors[0]?.decimals || DEFAULT_DECIMALS,
    entity: entities[config.indicator_sensors[0]?.sensor],
    sensor: config.indicator_sensors[0]?.sensor || '',
    units: config.indicator_sensors[0]?.units || entities[config.indicator_sensors[0].sensor].attributes.unit_of_measurement || '',
  };

  if (config.value_sensors && config.value_sensors.length > NO_ELEMENTS && entities[config.value_sensors[0].sensor]) {
    sa.attribute = config.value_sensors[0].attribute || '';
    sa.decimals = config.value_sensors[0].decimals || DEFAULT_DECIMALS;
    sa.entity = entities[config.value_sensors[0].sensor];
    sa.sensor = config.value_sensors[0].sensor;
    sa.units = config.value_sensors[0].units || entities[config.value_sensors[0].sensor].attributes.unit_of_measurement || '';
  }

  if (dynStyle && dynStyle.sensor) {
    sa.attribute = dynStyle.attribute || '';
    sa.decimals = 0;
    sa.entity = entities[dynStyle.sensor];
    sa.sensor = dynStyle.sensor;
    sa.units = '';
  }

  return sa;
}

function getBands(bands: CCStyleBandConfig[] | undefined, startColor: string, startVisibility: boolean, startBgImage: string, startImage: string, startSize: number, startRadius: number, startOpacity: number): CCStyleBand[] {
  const styleBands: CCStyleBand[] = [];
  const newBands = [...(bands || [])];
  if (newBands && newBands.length > NO_ELEMENTS) {
    newBands.sort((a, b) => {
      return a.from_value - b.from_value;
    });
    newBands.forEach((band, i) => {
      const color = band.color || (i === INDEX_ELEMENT_0 ? startColor : styleBands[i + LENGTH_TO_INDEX].color) || startColor;
      const prevVisibility = i === INDEX_ELEMENT_0 ? startVisibility : getBoolean(styleBands[i + LENGTH_TO_INDEX].show, startVisibility);
      const background_image = band.background_image || (i === INDEX_ELEMENT_0 ? startBgImage : styleBands[i + LENGTH_TO_INDEX].background_image) || startBgImage;
      const image = band.image || (i === INDEX_ELEMENT_0 ? startImage : styleBands[i + LENGTH_TO_INDEX].image) || startImage;
      const size = band.size || (i === INDEX_ELEMENT_0 ? startSize : styleBands[i + LENGTH_TO_INDEX].size) || startSize;
      const radius = band.radius || (i === INDEX_ELEMENT_0 ? startRadius : styleBands[i + LENGTH_TO_INDEX].radius) || startRadius;
      const opacity = band.opacity || (i === INDEX_ELEMENT_0 ? startOpacity : styleBands[i + LENGTH_TO_INDEX].opacity) || startOpacity;
      const scale = (DEFAULT_INDICATOR_RADIUS / Math.max(radius, DEFAULT_INDICATOR_RADIUS)) * TO_PERCENTAGE_FACTOR;
      const show = getBoolean(band.show, prevVisibility);
      styleBands.push({ background_image: background_image, color: color, from_value: band.from_value, image: image, opacity: opacity, radius: radius, scale: scale, show: show, size: size });
    });
  }
  return styleBands;
}


function getDynamicStyle(
  dynamicStyle: CCDynamicStyleConfig | undefined,
  config: CompassCardConfig,
  entities: HassEntities,
  startColor: string,
  startVisibility: boolean,
  startBgImage: string = '',
  startImage: string = '',
  startSize: number = DEFAULT_START_SIZE,
  startRadius: number = DEFAULT_RADIUS_SIZE,
  startOpacity: number = OPACITY_VISIBLE
): CCDynamicStyle {
  const sensorAttributes = getSensorAttrib(config, dynamicStyle, entities);
  const sens = dynamicStyle?.sensor || sensorAttributes.sensor;
  const attrib = dynamicStyle?.attribute || sensorAttributes.attribute;
  const { units } = sensorAttributes;
  const { decimals } = sensorAttributes;
  const isAttribute = attrib !== '';
  const entity = entities[sens];
  return {
    bands: getBands(dynamicStyle?.bands, startColor, startVisibility, startBgImage, startImage, startSize, startRadius, startOpacity),
    decimals: decimals,
    entity: entity,
    is_attribute: isAttribute,
    sensor: attrib === '' ? sens : `${sens}.${attrib}`,
    units: units,
    unknown: {
      background_image: dynamicStyle?.unknown?.background_image || startBgImage,
      color: dynamicStyle?.unknown?.color || startColor,
      image: dynamicStyle?.unknown?.image || startImage,
      opacity: dynamicStyle?.unknown?.opacity || startOpacity,
      radius: dynamicStyle?.unknown?.radius || startRadius,
      scale: (DEFAULT_INDICATOR_RADIUS / Math.max(dynamicStyle?.unknown?.radius || startRadius, DEFAULT_INDICATOR_RADIUS)) * TO_PERCENTAGE_FACTOR,
      show: dynamicStyle?.unknown?.show || startVisibility,
      size: dynamicStyle?.unknown?.size || startSize,
    },
  };
}


export function getHeader(config: CompassCardConfig, colors: CCColors, indicatorEntity: HassEntity, entities: HassEntities): CCHeader {
  const titleColor = config.header?.title?.color || colors.secondaryText;
  const titleShow = getBoolean(config.header?.title?.show, getBoolean(config.header?.title?.value !== undefined, false));
  const iconColor = config.header?.icon?.color || colors.stateIcon;
  const iconShow = getBoolean(config.header?.icon?.show, getBoolean(config.header?.icon?.value, false) || getBoolean(config.header?.title?.value, false));
  const header: CCHeader = {
    icon: {
      color: iconColor,
      dynamic_style: getDynamicStyle(config.header?.icon?.dynamic_style, config, entities, iconColor, iconShow),
      show: iconShow,
      value: config.header?.icon?.value || indicatorEntity?.attributes?.icon || ICONS.compass,
    },
    label: config.header?.title?.value || indicatorEntity?.attributes?.friendly_name || indicatorEntity?.entity_id,
    title: {
      color: titleColor,
      dynamic_style: getDynamicStyle(config.header?.title?.dynamic_style, config, entities, titleColor, titleShow),
      show: titleShow,
      value: config.header?.title?.value || '',
    },
  };
  return header;
}

export function getCompass(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCCompass {
  const circleColor = config.compass?.circle?.color || colors.primary;
  const circleShow = getBoolean(config.compass?.circle?.show, true);
  const northColor = config.compass?.north?.color || colors.primary;
  const northShow = getBoolean(config.compass?.north?.show, false);
  const eastColor = config.compass?.east?.color || colors.primary;
  const eastShow = getBoolean(config.compass?.east?.show, false);
  const southColor = config.compass?.south?.color || colors.primary;
  const southShow = getBoolean(config.compass?.south?.show, false);
  const westColor = config.compass?.west?.color || colors.primary;
  const westShow = getBoolean(config.compass?.west?.show, false);
  const bgImage = config.compass?.circle?.background_image || '';
  const bgOpacity = config.compass?.circle?.background_opacity ? config.compass?.circle?.background_opacity : config.compass?.circle?.background_image ? OPACITY_VISIBLE : OPACITY_TRANSPARENT;
  const bgOffset = getBoolean(config.compass?.circle?.offset_background, true);
  const circleStrokeWidth = config.compass?.circle?.stroke_width || DEFAULT_CIRCLE_STROKE_WIDTH;
  const compass: CCCompass = {
    circle: {
      background_image: bgImage,
      background_opacity: bgOpacity,
      color: circleColor,
      dynamic_style: getDynamicStyle(config.compass?.circle?.dynamic_style, config, entities, circleColor, circleShow, bgImage),
      offset_background: bgOffset,
      show: circleShow,
      stroke_width: circleStrokeWidth,
    },
    east: {
      color: eastColor,
      dynamic_style: getDynamicStyle(config.compass?.east?.dynamic_style, config, entities, eastColor, eastShow),
      show: eastShow,
    },
    north: {
      color: northColor,
      dynamic_style: getDynamicStyle(config.compass?.north?.dynamic_style, config, entities, northColor, northShow),
      offset: config.compass?.north?.offset || DEGREES_MIN,
      show: northShow,
    },
    scale: config.compass?.scale || SVG_SCALE_MIN,
    south: {
      color: southColor,
      dynamic_style: getDynamicStyle(config.compass?.south?.dynamic_style, config, entities, southColor, southShow),
      show: southShow,
    },
    west: {
      color: westColor,
      dynamic_style: getDynamicStyle(config.compass?.west?.dynamic_style, config, entities, westColor, westShow),
      show: westShow,
    },
  };
  return compass;
}

function getIndicatorSensor(config: CompassCardConfig, colors: CCColors, indicatorSensor: CCIndicatorSensorConfig, validIndex: number, entities: HassEntities): CCIndicatorSensor {
  const sens = indicatorSensor.sensor || '';
  const attrib = indicatorSensor.attribute || '';
  const indColor = indicatorSensor.indicator?.color || colors.accent;
  const indShow = getBoolean(indicatorSensor.indicator?.show, true);
  const indIconImage = indicatorSensor.indicator?.image || ICON_VALUES[DEFAULT_ICON_VALUE];
  const abbrColor = indicatorSensor.state_abbreviation?.color || colors.secondaryText;
  const abbrShow = getBoolean(indicatorSensor.state_abbreviation?.show, validIndex === INDEX_ELEMENT_0);
  const valueColor = indicatorSensor.state_value?.color || colors.secondaryText;
  const valueShow = getBoolean(indicatorSensor.state_value?.show, false);
  const unitsColor = indicatorSensor.state_units?.color || colors.secondaryText;
  const unitsShow = getBoolean(indicatorSensor.state_units?.show, false);
  const size = indicatorSensor.indicator?.size || DEFAULT_INDICATOR_SIZE;
  const radius = indicatorSensor.indicator?.radius ?? DEFAULT_INDICATOR_RADIUS;
  const opacity = indicatorSensor.indicator?.opacity ?? OPACITY_VISIBLE;
  const scale = DEFAULT_INDICATOR_RADIUS / Math.max(radius, DEFAULT_INDICATOR_RADIUS);
  const sensor: CCIndicatorSensor = {
    decimals: indicatorSensor.decimals || DEFAULT_DECIMALS,
    entity: entities[sens],
    indicator: {
      color: indColor,
      dynamic_style: getDynamicStyle(indicatorSensor.indicator?.dynamic_style, config, entities, indColor, indShow),
      image: indIconImage,
      opacity: opacity,
      radius: radius,
      scale: scale * TO_PERCENTAGE_FACTOR,
      show: indShow,
      size: size,
    },
    is_attribute: attrib !== '',
    sensor: attrib === '' ? sens : `${sens}.${attrib}`,
    state_abbreviation: {
      color: abbrColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_abbreviation?.dynamic_style, config, entities, abbrColor, abbrShow),
      show: abbrShow,
    },
    state_units: {
      color: unitsColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_units?.dynamic_style, config, entities, unitsColor, unitsShow),
      show: unitsShow,
    },
    state_value: {
      color: valueColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_value?.dynamic_style, config, entities, valueColor, valueShow),
      show: valueShow,
    },
    units: attrib !== '' ? indicatorSensor.units || '' : indicatorSensor.units || entities[sens].attributes?.unit_of_measurement || '',
  };
  return sensor;
}

export function getIndicatorSensors(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCIndicatorSensor[] {
  const sensors: CCIndicatorSensor[] = [];
  config.indicator_sensors.forEach((indicatorSensor) => {
    if (indicatorSensor.sensor && entities[indicatorSensor.sensor]) {
      sensors.push(getIndicatorSensor(config, colors, indicatorSensor, sensors.length, entities));
    }
  });
  return sensors;
}

function getValueSensor(config: CompassCardConfig, colors: CCColors, valueSensor: CCValueSensorConfig, entities: HassEntities): CCValueSensor {
  const sens = valueSensor.sensor || '';
  const attrib = valueSensor.attribute || '';
  const valueColor = valueSensor.state_value?.color || colors.primaryText;
  const valueShow = getBoolean(valueSensor.state_value?.show, true);
  const unitsColor = valueSensor.state_units?.color || colors.secondaryText;
  const unitsShow = getBoolean(valueSensor.state_units?.show, true);
  const sensor: CCValueSensor = {
    decimals: valueSensor.decimals || DEFAULT_DECIMALS,
    entity: entities[sens],
    is_attribute: attrib !== '',
    sensor: attrib === '' ? sens : `${sens}.${attrib}`,
    state_units: {
      color: unitsColor,
      dynamic_style: getDynamicStyle(valueSensor.state_units?.dynamic_style, config, entities, unitsColor, unitsShow),
      show: unitsShow,
    },
    state_value: {
      color: valueColor,
      dynamic_style: getDynamicStyle(valueSensor.state_value?.dynamic_style, config, entities, valueColor, valueShow),
      show: valueShow,
    },
    units: attrib !== '' ? valueSensor.units || '' : valueSensor.units || entities[sens].attributes?.unit_of_measurement || '',
  };
  return sensor;
}

export function getValueSensors(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCValueSensor[] {
  const sensors: CCValueSensor[] = [];
  if (config.value_sensors && config.value_sensors.length > NO_ELEMENTS) {
    config.value_sensors.forEach((valueSensor) => {
      if (valueSensor.sensor && entities[valueSensor.sensor]) {
        sensors.push(getValueSensor(config, colors, valueSensor, entities));
      }
    });
  }
  return sensors;
}

export function isNumeric(str: string): boolean {
  if (typeof str !== 'string' && typeof str !== 'number') return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAttrPath(obj: any, path: string): any {
  if (obj === null || typeof path !== 'string') return undefined;

  const tokens: string[] = [];
  const REGEX_PATTERN = /(?:[^.[\]]+)|\[(?:\d+)\]|\[(?<quote>["'])(?:.*?)\k<quote>\]/g;

  let m: RegExpExecArray | null;
  while ((m = REGEX_PATTERN.exec(path))) {
    const [fullMatch] = m;
    tokens.push(fullMatch);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tokens.reduce<any>((acc, k) => (acc === null ? undefined : acc[k]), obj);
}

export function findValues(obj: CompassCardConfig, entities: HassEntities, debug: boolean, root = ''): string[] {
  const active = [obj];
  let found: string[] = [];
  for (let currentElement = 0; currentElement < active.length; currentElement++) {
    const currentKeys = Object.keys(active[currentElement]);
    for (let index = 0; index < currentKeys.length; index++) {
      const currentKey = currentKeys[index];
      const currentValue = active[currentElement][currentKey];
      let name = '';
      if (isNumeric(currentKeys[index])) {
        name = root !== '' ? `${root}[${currentKeys[index]}]` : '';
      } else if (currentKeys[index] !== '') {
        name = root !== '' ? `${root}.${currentKeys[index]}` : currentKeys[index];
      }
      switch (currentKey) {
        case 'sensor':
          if (entities[currentValue]) {
            found.push(currentValue);
            // eslint-disable-next-line no-console
          } else if (debug) console.warn(`Compass-Card configuration: ${name} (${currentValue}) is invalid`);
          break;

        case 'attribute': {
          const sensor = active[currentElement]?.sensor;
          const entity = entities?.[sensor];
          const path = String(currentValue).trim();
          const attrs = entity?.attributes;
          const val = attrs ? resolveAttrPath(attrs, path) : undefined;

          // eslint-disable-next-line no-console
          if (debug) console.warn('Attr check', { keys: attrs && Object.keys(attrs), path, sensor, type: typeof val, val });

          if (val !== undefined && val !== null) {
            found.push(sensor); // accepts 0, false, and ""
            // eslint-disable-next-line no-console
          } else if (debug) console.warn(
            `Compass-Card configuration: attribute ${name} (${currentValue}) is invalid for entity ${name.slice(INDEX_ELEMENT_0, name.lastIndexOf('.'))}.sensor (${sensor})`
          );
          break;
        }
        default:
          if (currentValue && typeof currentValue === 'object') {
            found = [...found, ...findValues(currentValue, entities, debug, name)];
          }
          break;
      }
    }
  }
  return found.length ? [...new Set(found)] : [];
}
