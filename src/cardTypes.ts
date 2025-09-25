import { HassEntity } from 'home-assistant-js-websocket';

export interface CCSensor extends CCEntity {
  state_value: CCProperties;
  state_units: CCProperties;
}

export interface CCValueSensor extends CCSensor {
  state_min: CCProperties;
  state_max: CCProperties;
}

export interface CCIndicatorSensor extends CCSensor {
  indicator: CCIndicator;
  state_abbreviation: CCProperties;
}

export interface CCIndicator extends CCProperties {
  type: string;
  size: number;
  radius: number;
  scale: number;
}

export interface CCHeader {
  label: string;
  title: CCHeaderItem;
  icon: CCHeaderItem;
}

export interface CCHeaderItem extends CCProperties {
  value: string;
}

export interface CCCompass {
  circle: CCCircle;
  north: CCNorth;
  east: CCProperties;
  south: CCProperties;
  west: CCProperties;
  scale: number;
}

export interface CCCircle extends CCProperties {
  background_image: string;
  background_opacity: number;
  offset_background: boolean;
  stroke_width: number;
}

export interface CCNorth extends CCProperties {
  offset: number;
}

export interface CCProperties {
  color: string;
  dynamic_style: CCDynamicStyle;
  show: boolean;
}

export interface CCDynamicStyle extends CCEntity {
  bands: CCStyleBand[];
  unknown: CCStyle;
}

export interface CCStyleBand extends CCStyle {
  from_value: number;
  background_image: string;
}

export interface CCStyle {
  color: string;
  show: boolean;
}

export interface CCEntity {
  entity: HassEntity;
  sensor: string;
  is_attribute: boolean;
  units: string;
  decimals: number;
}

export interface CCDirectionInfo {
  abbreviation: string;
  degrees: number;
}

export interface CCSensorAttrib {
  entity: HassEntity;
  sensor: string;
  attribute: string;
  units: string;
  decimals: number;
}

export interface CCColors {
  [propName: string]: string;
}

export interface CCValue {
  value: string;
  units: string;
}
