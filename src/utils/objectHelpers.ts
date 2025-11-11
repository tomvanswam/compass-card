import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { ICONS, DEFAULT_ICON_VALUE, ICON_VALUES } from '../const';
import { CCColors, CCCompass, CCHeader, CCIndicatorSensor, CCValueSensor, CCSensorAttrib, CCStyleBand, CCDynamicStyle } from '../cardTypes';
import { CCDynamicStyleConfig, CCIndicatorSensorConfig, CCStyleBandConfig, CCValueSensorConfig, CompassCardConfig } from '../editorTypes';

export function getHeader(config: CompassCardConfig, colors: CCColors, indicatorEntity: HassEntity, entities: HassEntities): CCHeader {
  const titleColor = config.header?.title?.color || colors.secondaryText;
  const titleShow = getBoolean(config.header?.title?.show, getBoolean(config.header?.title?.value !== undefined, false));
  const iconColor = config.header?.icon?.color || colors.stateIcon;
  const iconShow = getBoolean(config.header?.icon?.show, getBoolean(config.header?.icon?.value, false) || getBoolean(config.header?.title?.value, false));
  const header: CCHeader = {
    label: config.header?.title?.value || indicatorEntity?.attributes?.friendly_name || indicatorEntity?.entity_id,
    title: {
      value: config.header?.title?.value || '',
      color: titleColor,
      dynamic_style: getDynamicStyle(config.header?.title?.dynamic_style, config, entities, titleColor, titleShow),
      show: titleShow,
    },
    icon: {
      value: config.header?.icon?.value || indicatorEntity?.attributes?.icon || ICONS.compass,
      color: iconColor,
      dynamic_style: getDynamicStyle(config.header?.icon?.dynamic_style, config, entities, iconColor, iconShow),
      show: iconShow,
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
  const bgOpacity = config.compass?.circle?.background_opacity ? config.compass?.circle?.background_opacity : config.compass?.circle?.background_image ? 1.0 : 0.0;
  const bgOffset = getBoolean(config.compass?.circle?.offset_background, true);
  const circleStrokeWidth = config.compass?.circle?.stroke_width || 2;
  const compass: CCCompass = {
    scale: config.compass?.scale || 0,
    circle: {
      background_image: bgImage,
      background_opacity: bgOpacity,
      offset_background: bgOffset,
      stroke_width: circleStrokeWidth,
      color: circleColor,
      dynamic_style: getDynamicStyle(config.compass?.circle?.dynamic_style, config, entities, circleColor, circleShow, bgImage),
      show: circleShow,
    },
    north: {
      offset: config.compass?.north?.offset || 0,
      color: northColor,
      dynamic_style: getDynamicStyle(config.compass?.north?.dynamic_style, config, entities, northColor, northShow),
      show: northShow,
    },
    east: {
      color: eastColor,
      dynamic_style: getDynamicStyle(config.compass?.east?.dynamic_style, config, entities, eastColor, eastShow),
      show: eastShow,
    },
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

export function getIndicatorSensors(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCIndicatorSensor[] {
  const sensors: CCIndicatorSensor[] = [];
  config.indicator_sensors.forEach((indicatorSensor) => {
    if (indicatorSensor.sensor && entities[indicatorSensor.sensor]) {
      sensors.push(getIndicatorSensor(config, colors, indicatorSensor, sensors.length, entities));
    }
  });
  return sensors;
}

function getIndicatorSensor(config: CompassCardConfig, colors: CCColors, indicatorSensor: CCIndicatorSensorConfig, validIndex: number, entities: HassEntities): CCIndicatorSensor {
  const sens = indicatorSensor.sensor || '';
  const attrib = indicatorSensor.attribute || '';
  const indColor = indicatorSensor.indicator?.color || colors.accent;
  const indShow = getBoolean(indicatorSensor.indicator?.show, true);
  const indIconImage = indicatorSensor.indicator?.image || ICON_VALUES[DEFAULT_ICON_VALUE];
  const abbrColor = indicatorSensor.state_abbreviation?.color || colors.secondaryText;
  const abbrShow = getBoolean(indicatorSensor.state_abbreviation?.show, validIndex === 0);
  const valueColor = indicatorSensor.state_value?.color || colors.secondaryText;
  const valueShow = getBoolean(indicatorSensor.state_value?.show, false);
  const unitsColor = indicatorSensor.state_units?.color || colors.secondaryText;
  const unitsShow = getBoolean(indicatorSensor.state_units?.show, false);
  const size = indicatorSensor.indicator?.size || 19;
  const radius = indicatorSensor.indicator?.radius ?? 70;
  const scale = 70 / Math.max(radius, 70);
  const sensor: CCIndicatorSensor = {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    entity: entities[sens],
    decimals: indicatorSensor.decimals || 0,
    units: attrib !== '' ? indicatorSensor.units || '' : indicatorSensor.units || entities[sens].attributes?.unit_of_measurement || '',
    indicator: {
      image: indIconImage,
      dynamic_style: getDynamicStyle(indicatorSensor.indicator?.dynamic_style, config, entities, indColor, indShow),
      color: indColor,
      show: indShow,
      size: size,
      radius: radius,
      scale: scale * 100,
    },
    state_abbreviation: {
      color: abbrColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_abbreviation?.dynamic_style, config, entities, abbrColor, abbrShow),
      show: abbrShow,
    },
    state_value: {
      color: valueColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_value?.dynamic_style, config, entities, valueColor, valueShow),
      show: valueShow,
    },
    state_units: {
      color: unitsColor,
      dynamic_style: getDynamicStyle(indicatorSensor.state_units?.dynamic_style, config, entities, unitsColor, unitsShow),
      show: unitsShow,
    },
  };
  return sensor;
}

export function getValueSensors(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCValueSensor[] {
  const sensors: CCValueSensor[] = [];
  if (config.value_sensors && config.value_sensors.length > 0) {
    config.value_sensors.forEach((valueSensor) => {
      if (valueSensor.sensor && entities[valueSensor.sensor]) {
        sensors.push(getValueSensor(config, colors, valueSensor, entities));
      }
    });
  }
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
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    entity: entities[sens],
    decimals: valueSensor.decimals || 0,
    units: attrib !== '' ? valueSensor.units || '' : valueSensor.units || entities[sens].attributes?.unit_of_measurement || '',
    is_attribute: attrib !== '',
    state_value: {
      color: valueColor,
      dynamic_style: getDynamicStyle(valueSensor.state_value?.dynamic_style, config, entities, valueColor, valueShow),
      show: valueShow,
    },
    state_units: {
      color: unitsColor,
      dynamic_style: getDynamicStyle(valueSensor.state_units?.dynamic_style, config, entities, unitsColor, unitsShow),
      show: unitsShow,
    },
  };
  return sensor;
}

function getBands(bands: CCStyleBandConfig[] | undefined, startColor: string, startVisibility: boolean): CCStyleBand[] {
  const styleBands: CCStyleBand[] = [];
  const newBands = [...(bands || [])];
  if (newBands && newBands.length > 0) {
    newBands.sort((a, b) => {
      return a.from_value - b.from_value;
    });
    newBands.forEach((band, i) => {
      const color = band.color || (i === 0 ? startColor : styleBands[i - 1].color) || startColor;
      const prevVisibility = i === 0 ? startVisibility : getBoolean(styleBands[i - 1].show, startVisibility);
      const background_image = band.background_image? band.background_image : '';
      const show = getBoolean(band.show, prevVisibility);
      styleBands.push({ from_value: band.from_value, color: color, show: show, background_image: background_image });
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
  startBgImage: string = ''
): CCDynamicStyle {
  const sensorAttributes = getSensorAttrib(config, dynamicStyle, entities);
  const sens = dynamicStyle?.sensor || sensorAttributes.sensor;
  const attrib = dynamicStyle?.attribute || sensorAttributes.attribute;
  const units = sensorAttributes.units;
  const decimals = sensorAttributes.decimals;
  const is_attribute = attrib !== '';
  const entity = entities[sens];
  return {
    entity: entity,
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: is_attribute,
    bands: getBands(dynamicStyle?.bands, startColor, startVisibility),
    decimals: decimals,
    units: units,
    unknown: {
      color: dynamicStyle?.unknown?.color || startColor,
      show: dynamicStyle?.unknown?.show || startVisibility,
      background_image: dynamicStyle?.unknown?.background_image || startBgImage,
    },
  };
}

function getSensorAttrib(config: CompassCardConfig, dynStyle: CCDynamicStyleConfig | undefined, entities: HassEntities): CCSensorAttrib {
  const sa: CCSensorAttrib = {
    entity: entities[config.indicator_sensors[0]?.sensor],
    sensor: config.indicator_sensors[0]?.sensor || '',
    attribute: config.indicator_sensors[0]?.attribute || '',
    units: config.indicator_sensors[0]?.units || entities[config.indicator_sensors[0].sensor].attributes['unit_of_measurement'] || '',
    decimals: config.indicator_sensors[0]?.decimals || 0,
  };

  if (config.value_sensors && config.value_sensors.length > 0 && entities[config.value_sensors[0].sensor]) {
    sa.entity = entities[config.value_sensors[0].sensor];
    sa.sensor = config.value_sensors[0].sensor;
    sa.attribute = config.value_sensors[0].attribute || '';
    sa.units = config.value_sensors[0].units || entities[config.value_sensors[0].sensor].attributes['unit_of_measurement'] || '';
    sa.decimals = config.value_sensors[0].decimals || 0;
  }

  if (dynStyle && dynStyle.sensor) {
    sa.entity = entities[dynStyle.sensor];
    sa.sensor = dynStyle.sensor;
    sa.attribute = dynStyle.attribute || '';
    sa.units = '';
    sa.decimals = 0;
  }

  return sa;
}

export function getBoolean(value: boolean | number | string | undefined, defValue: boolean): boolean {
  if (value === undefined) {
    return defValue;
  }
  return Boolean(value).valueOf();
}

export function isNumeric(str: string): boolean {
  if (typeof str !== 'string' && typeof str !== 'number') return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveAttrPath(obj: any, path: string): any {
  if (obj == null || typeof path !== 'string') return undefined;
  const tokens: string[] = [];
  const re = /([^.[\]]+)|\[(\d+)\]|\[(["'])(.*?)\3\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path))) {
    if (m[1] !== undefined) tokens.push(m[1]);       // dot token
    else if (m[2] !== undefined) tokens.push(m[2]);  // [123]
    else tokens.push(m[4]);                           // ["key"] or ['key']
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return tokens.reduce<any>((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

export function findValues(obj: CompassCardConfig, entities: HassEntities, debug: boolean, root = ''): string[] {
  const active = [obj];
  let found: string[] = [];
  for (let currentElement = 0; currentElement < active.length; currentElement++) {
    Object.keys(active[currentElement]).forEach(function (currentKey, index, currentKeys) {
      const currentValue = active[currentElement][currentKey];
      let name = '';
      if (isNumeric(currentKeys[index])) {
        name = root !== '' ? root + '[' + currentKeys[index] + ']' : '';
      } else if (currentKeys[index] !== '') {
        name = root !== '' ? root + '.' + currentKeys[index] : currentKeys[index];
      }
      switch (currentKey) {
      case 'sensor':
        if (entities[currentValue]) {
          found.push(currentValue);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          debug && console.warn('Compass-Card configuration: ' + name + ' (' + currentValue + ') is invalid');
        }
        break;

      case 'attribute': {
        const sensor = active[currentElement]?.sensor;
        const entity = entities?.[sensor];
        const path = String(currentValue).trim();
        const attrs = entity?.attributes;
        const val = attrs ? resolveAttrPath(attrs, path) : undefined;

        //eslint-disable-next-line @typescript-eslint/no-unused-expressions
        debug && console.warn('Attr check', { sensor, path, val, type: typeof val, keys: attrs && Object.keys(attrs) });

        if (val !== undefined && val !== null) {
          found.push(sensor); // accepts 0, false, and ""
        } else {
          //eslint-disable-next-line @typescript-eslint/no-unused-expressions
          debug && console.warn(
            'Compass-Card configuration: attribute ' + name +
              ' (' + currentValue + ') is invalid for entity ' +
              name.slice(0, name.lastIndexOf('.')) + '.sensor (' + sensor + ')'
          );
        }
        break;
      }
      default:
        if (currentValue && typeof currentValue === 'object') {
          found = [...found, ...findValues(currentValue, entities, debug, name)];
        }
        break;
      }
    });
  }
  return found.length ? [...new Set(found)] : [];
}
