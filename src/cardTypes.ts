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
  circle: CCProperties;
  north: CCNorth;
}

export interface CCNorth extends CCProperties {
  offset: number;
}

export interface CCProperties {
  color: string;
  dynamic_style: CCDynamicStyle;
  show: boolean;
}

export interface CCDynamicStyle {
  sensor: string;
  is_attribute: boolean;
  bands: CCStyleBand[];
}

export interface CCStyleBand {
  from_value: number;
  color: string;
  show: boolean;
}

export interface CCEntity {
  sensor: string;
  is_attribute: boolean;
}

export interface CCDirectionInfo {
  abbreviation: string;
  degrees: number;
}

export interface CCSensorAttrib {
  sensor: string;
  attribute: string;
}

export interface CCColors {
  [propName: string]: string;
}
