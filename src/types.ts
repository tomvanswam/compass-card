import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CompassCardConfig extends LovelaceCardConfig {
  type: string;
  name: string;
  direction_offset: string;
  entity: string;
  secondary_entity?: string;
  compass?: CCCompass;
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
}
