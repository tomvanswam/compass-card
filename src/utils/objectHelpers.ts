import { HassEntity } from 'home-assistant-js-websocket';
import { DEFAULT_INDICATOR, ICONS, INDICATORS } from '../const';
import { CCColors, CCCompass, CCHeader, CCIndicatorSensor, CCValueSensor, CCSensorAttrib, CCStyleBand, CCDynamicStyle } from '../cardTypes';
import { CCDynamicStyleConfig, CCIndicatorSensorConfig, CCStyleBandConfig, CCValueSensorConfig, CompassCardConfig } from '../editorTypes';

export function getHeader(config: CompassCardConfig, colors: CCColors, indicatorEntity: HassEntity): CCHeader {
  const header: CCHeader = {
    label: config.header?.title?.value || indicatorEntity?.attributes?.friendly_name || indicatorEntity?.entity_id,
    title: {
      value: config.header?.title?.value || '',
      color: config.header?.title?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(config.header?.title?.dynamic_style, config),
      show: getBoolean(config.header?.title?.show, getBoolean(config.header?.title?.value !== undefined, false)),
    },
    icon: {
      value: config.header?.icon?.value || indicatorEntity?.attributes?.icon || ICONS.compass,
      color: config.header?.icon?.color || colors.stateIcon,
      dynamic_style: getDynamicStyle(config.header?.icon?.dynamic_style, config),
      show: getBoolean(config.header?.icon?.show, getBoolean(config.header?.icon?.value, false) || getBoolean(config.header?.title?.value, false)),
    },
  };
  return header;
}

export function getCompass(config: CompassCardConfig, colors: CCColors): CCCompass {
  const compass: CCCompass = {
    circle: {
      color: config.compass?.circle?.color || colors.primary,
      dynamic_style: getDynamicStyle(config.compass?.circle?.dynamic_style, config),
      show: getBoolean(config.compass?.circle?.show, true),
    },
    north: {
      offset: config.compass?.north?.offset || 0,
      color: config.compass?.north?.color || colors.primary,
      dynamic_style: getDynamicStyle(config.compass?.north?.dynamic_style, config),
      show: getBoolean(config.compass?.north?.show, false),
    },
  };
  return compass;
}

export function getIndicatorSensors(config: CompassCardConfig, colors: CCColors): CCIndicatorSensor[] {
  const sensors: CCIndicatorSensor[] = [];
  config.indicator_sensors.forEach((indicatorSensor) => {
    if (indicatorSensor.sensor) {
      sensors.push(getIndicatorSensor(config, colors, indicatorSensor, sensors.length));
    }
  });
  return sensors;
}

function getIndicatorSensor(config: CompassCardConfig, colors: CCColors, indicatorSensor: CCIndicatorSensorConfig, index: number): CCIndicatorSensor {
  const sens = indicatorSensor.sensor || '';
  const attrib = indicatorSensor.attribute || '';
  const sensor: CCIndicatorSensor = {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    indicator: {
      type: indicatorSensor.indicator?.type || INDICATORS[DEFAULT_INDICATOR],
      dynamic_style: getDynamicStyle(indicatorSensor.indicator?.dynamic_style, config),
      color: indicatorSensor.indicator?.color || colors.accent,
      show: getBoolean(indicatorSensor.indicator?.show, true),
    },
    state_abbreviation: {
      color: indicatorSensor.state_abbreviation?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_abbreviation?.dynamic_style, config),
      show: getBoolean(indicatorSensor.state_abbreviation?.show, index === 0),
    },
    state_value: {
      color: indicatorSensor.state_value?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_value?.dynamic_style, config),
      show: getBoolean(indicatorSensor.state_value?.show, false),
    },
    state_units: {
      color: indicatorSensor.state_units?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(indicatorSensor.state_units?.dynamic_style, config),
      show: getBoolean(indicatorSensor.state_units?.show, false),
    },
  };
  return sensor;
}

export function getValueSensors(config: CompassCardConfig, colors: CCColors): CCValueSensor[] {
  const sensors: CCValueSensor[] = [];
  if (config.value_sensors && config.value_sensors.length > 0) {
    config.value_sensors.forEach((valueSensor) => {
      if (valueSensor.sensor) {
        sensors.push(getValueSensor(config, colors, valueSensor));
      }
    });
  }
  return sensors;
}

function getValueSensor(config: CompassCardConfig, colors: CCColors, valueSensor: CCValueSensorConfig): CCValueSensor {
  const sens = valueSensor.sensor || '';
  const attrib = valueSensor.attribute || '';
  const sensor: CCValueSensor = {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    state_min: {
      color: valueSensor.state_min?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_min?.dynamic_style, config),
      show: getBoolean(valueSensor.state_min?.show, false),
    },
    state_max: {
      color: valueSensor.state_max?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_max?.dynamic_style, config),
      show: getBoolean(valueSensor.state_max?.show, false),
    },
    state_value: {
      color: valueSensor.state_value?.color || colors.primaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_value?.dynamic_style, config),
      show: getBoolean(valueSensor.state_value?.show, true),
    },
    state_units: {
      color: valueSensor.state_units?.color || colors.secondaryText,
      dynamic_style: getDynamicStyle(valueSensor.state_units?.dynamic_style, config),
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

function getDynamicStyle(dynamicStyle: CCDynamicStyleConfig | undefined, config: CompassCardConfig): CCDynamicStyle {
  const sens = dynamicStyle?.sensor || getSensorAttrib(config).sensor;
  const attrib = dynamicStyle?.attribute || getSensorAttrib(config).attribute;
  return {
    sensor: attrib === '' ? sens : sens + '.' + attrib,
    is_attribute: attrib !== '',
    bands: getBands(dynamicStyle?.bands),
  };
}

function getSensorAttrib(config: CompassCardConfig): CCSensorAttrib {
  const sa: CCSensorAttrib = {
    sensor: config.indicator_sensors[0]?.sensor || '',
    attribute: config.indicator_sensors[0]?.attribute || '',
  };
  if (config.value_sensors && config.value_sensors.length > 0) {
    sa.sensor = config.value_sensors[0].sensor;
    sa.attribute = config.value_sensors[0].attribute || sa.attribute;
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
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
