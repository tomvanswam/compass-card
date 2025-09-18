import { LovelaceCardConfig } from 'custom-card-helpers';

export type CompassCardConfig = CompassCardConfigV1;

export interface CompassCardConfigV1 extends LovelaceCardConfig {
  header?: CCHeaderConfig;
  compass?: CCCompassConfig;
  indicator_sensors: CCIndicatorSensorConfig[];
  value_sensors?: CCValueSensorConfig[];

  tap_action?: ActionConfig;
  language?: string;
  debug?: boolean;
}

export interface CCSensorConfig extends CCEntityConfig {
  state_value?: CCPropertiesConfig;
  state_units?: CCPropertiesConfig;
}

export interface CCValueSensorConfig extends CCSensorConfig {
  state_min?: CCPropertiesConfig;
  state_max?: CCPropertiesConfig;
}

export interface CCIndicatorSensorConfig extends CCSensorConfig {
  indicator?: CCIndicatorConfig;
  state_abbreviation?: CCPropertiesConfig;
}

export interface CCIndicatorConfig extends CCPropertiesConfig {
  type?: string;
}

export interface CCHeaderConfig {
  icon?: CCHeaderItemConfig;
  title?: CCHeaderItemConfig;
}

export interface CCHeaderItemConfig extends CCPropertiesConfig {
  value?: string;
}

export interface CCCompassConfig {
  circle?: CCCircleConfig;
  north?: CCNorthConfig;
  east?: CCPropertiesConfig;
  south?: CCPropertiesConfig;
  west?: CCPropertiesConfig;
}

export interface CCCircleConfig extends CCPropertiesConfig {
  background_image?: string;
  background_opacity?: number;
  offset_background?: boolean;
}

export interface CCNorthConfig extends CCPropertiesConfig {
  offset?: number;
}

export interface CCPropertiesConfig {
  color?: string;
  dynamic_style?: CCDynamicStyleConfig;
  show?: boolean;
}

export interface CCDynamicStyleConfig {
  sensor?: string;
  attribute?: string;
  bands: CCStyleBandConfig[];
  unknown?: CCStyleConfig;
}

export interface CCStyleBandConfig extends CCStyleConfig {
  from_value: number;
  background_image: string;
}

export interface CCStyleConfig {
  color?: string;
  show?: boolean;
}

export interface CCEntityConfig {
  sensor: string;
  attribute?: string;
  units?: string;
  decimals?: number;
}

export interface ActionConfig {
  action?: string;
  entity?: string;
  service?: string;
  service_data?: string;
  navigation_path?: string;
  url?: string;
  new_tab?: boolean;
}
