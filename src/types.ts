import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CompassCardConfig extends LovelaceCardConfig {
  type: string;
  name: string;
  direction_offset: string;
  entity: string;
  secondary_entity?: string;
  compass?: CCCompass;
  tap_action?: ActionConfig;
}

export interface CCColorThreshold {
  style_css: string;
  from_value?: number;
}

export interface CCProperties {
  color_thresholds?: CCColorThreshold[];
  style_css?: string;
}

export interface CCIndicatorEntity {
  entity: string;
  properties?: CCProperties;
}

export interface CCValueEntity {
  secondary_entity: string;
  properties?: CCProperties;
}

export interface CCCompass extends CCProperties {
  indicator?: string;
  show_north?: boolean;
  language?: string;
}

export interface ActionConfig {
  action: string;
  entity?: string;
  service?: string;
  service_data?: string;
  navigation_path?: string;
  url?: string;
}
