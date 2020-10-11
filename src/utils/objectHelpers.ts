import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { DEFAULT_INDICATOR, ICONS, INDICATORS } from '../const';
import { CCColors, CCCompass, CCHeader, CCIndicatorSensor, CCValueSensor, CCSensorAttrib, CCStyleBand, CCDynamicStyle } from '../cardTypes';
import { CCDynamicStyleConfig, CCIndicatorSensorConfig, CCStyleBandConfig, CCValueSensorConfig, CompassCardConfig } from '../editorTypes';

export function getHeader(config: CompassCardConfig, colors: CCColors, indicatorEntity: HassEntity, entities: HassEntities): CCHeader {
  const header: CCHeader = {
    label: config.header?.title?.value || indicatorEntity?.attributes?.friendly_name || indicatorEntity?.entity_id,
    title: {
      value: config.header?.title?.value || '',
      color: config.header?.title?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(config.header?.title?.dynamic_style, config, entities),
      show: getBoolean(config.header?.title?.show, getBoolean(config.header?.title?.value !== undefined, false)),
    },
    icon: {
      value: config.header?.icon?.value || indicatorEntity?.attributes?.icon || ICONS.compass,
      color: config.header?.icon?.color || colors.stateIcon,
      dynamic_style: getDynamicStyle(config.header?.icon?.dynamic_style, config, entities),
      show: getBoolean(config.header?.icon?.show, getBoolean(config.header?.icon?.value, false) || getBoolean(config.header?.title?.value, false)),
    },
  };
  return header;
}

export function getCompass(config: CompassCardConfig, colors: CCColors, entities: HassEntities): CCCompass {
  const compass: CCCompass = {
    circle: {
      color: config.compass?.circle?.color || colors.primary,
      dynamic_style: getDynamicStyle(config.compass?.circle?.dynamic_style, config, entities),
      show: getBoolean(config.compass?.circle?.show, true),
    },
    north: {
      offset: config.compass?.north?.offset || 0,
      color: config.compass?.north?.color || colors.primary,
      dynamic_style: getDynamicStyle(config.compass?.north?.dynamic_style, config, entities),
      show: getBoolean(config.compass?.north?.show, false),
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

function getIndicatorSensor(config: CompassCardConfig, colors: CCColors, indicatorSensor: CCIndicatorSensorConfig, index: number, entities: HassEntities): CCIndicatorSensor {
  const sens = indicatorSensor.sensor || '';
  const attrib = indicatorSensor.attribute || '';
  const sensor: CCIndicatorSensor = {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    entity: entities[sens],
    decimals: indicatorSensor.decimals || 0,
    units: attrib !== '' ? indicatorSensor.units || '' : indicatorSensor.units || entities[sens].attributes?.unit_of_measurement || '',
    indicator: {
      type: indicatorSensor.indicator?.type || INDICATORS[DEFAULT_INDICATOR],
      dynamic_style: getDynamicStyle(indicatorSensor.indicator?.dynamic_style, config, entities),
      color: indicatorSensor.indicator?.color || colors.accent,
      show: getBoolean(indicatorSensor.indicator?.show, true),
    },
    state_abbreviation: {
      color: indicatorSensor.state_abbreviation?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_abbreviation?.dynamic_style, config, entities),
      show: getBoolean(indicatorSensor.state_abbreviation?.show, index === 0),
    },
    state_value: {
      color: indicatorSensor.state_value?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_value?.dynamic_style, config, entities),
      show: getBoolean(indicatorSensor.state_value?.show, false),
    },
    state_units: {
      color: indicatorSensor.state_units?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_units?.dynamic_style, config, entities),
      show: getBoolean(indicatorSensor.state_units?.show, false),
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
  const sensor: CCValueSensor = {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    entity: entities[sens],
    decimals: valueSensor.decimals || 0,
    units: attrib !== '' ? valueSensor.units || '' : valueSensor.units || entities[sens].attributes?.unit_of_measurement || '',
    is_attribute: attrib !== '',
    state_min: {
      color: valueSensor.state_min?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_min?.dynamic_style, config, entities),
      show: getBoolean(valueSensor.state_min?.show, false),
    },
    state_max: {
      color: valueSensor.state_max?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_max?.dynamic_style, config, entities),
      show: getBoolean(valueSensor.state_max?.show, false),
    },
    state_value: {
      color: valueSensor.state_value?.color || colors.primaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_value?.dynamic_style, config, entities),
      show: getBoolean(valueSensor.state_value?.show, true),
    },
    state_units: {
      color: valueSensor.state_units?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_units?.dynamic_style, config, entities),
      show: getBoolean(valueSensor.state_units?.show, true),
    },
  };
  return sensor;
}

function getBands(bands: CCStyleBandConfig[] | undefined): CCStyleBand[] {
  const styleBands: CCStyleBand[] = [];
  if (bands) {
    bands.forEach((band) => {
      styleBands.push({ from_value: band.from_value, color: band.color || 'black', show: getBoolean(band.show, true) });
    });
  }
  return styleBands;
}

function getDynamicStyle(dynamicStyle: CCDynamicStyleConfig | undefined, config: CompassCardConfig, entities: HassEntities): CCDynamicStyle {
  const sensorAttributes = getSensorAttrib(config, entities);
  const sens = dynamicStyle?.sensor || sensorAttributes.sensor;
  const attrib = dynamicStyle?.attribute || sensorAttributes.attribute;
  const units = sensorAttributes.units;
  const numberFormat = sensorAttributes.decimals;
  return {
    entity: entities[sens],
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    bands: getBands(dynamicStyle?.bands),
    decimals: numberFormat,
    units: units,
  };
}

function getSensorAttrib(config: CompassCardConfig, entities: HassEntities): CCSensorAttrib {
  const sa: CCSensorAttrib = {
    entity: entities[config.indicator_sensors[0]?.sensor],
    sensor: config.indicator_sensors[0]?.sensor || '',
    attribute: config.indicator_sensors[0]?.attribute || '',
    units: config.indicator_sensors[0]?.units || '',
    decimals: config.indicator_sensors[0]?.decimals || 0,
  };

  if (config.value_sensors && config.value_sensors.length > 0 && entities[config.value_sensors[0].sensor]) {
    sa.entity = entities[config.value_sensors[0].sensor];
    sa.sensor = config.value_sensors[0].sensor;
    sa.attribute = config.value_sensors[0].attribute || sa.attribute;
    sa.units = config.value_sensors[0].units || sa.units;
    sa.decimals = config.value_sensors[0].decimals || sa.decimals;
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

// eslint-disable-next-line
export function findValues(obj: any, key: string): string[] {
  const seen = new Set();
  let active = [obj];
  while (active.length) {
    const new_active: string[] = [];
    const found: string[] = [];
    for (let i = 0; i < active.length; i++) {
      Object.keys(active[i]).forEach(function (k) {
        const x = active[i][k];
        if (k === key) {
          found.push(x);
        } else if (x && typeof x === 'object' && !seen.has(x)) {
          seen.add(x);
          new_active.push(x);
        }
      });
    }
    if (found.length) return [...new Set(found)];
    active = new_active;
  }
  return [];
}
