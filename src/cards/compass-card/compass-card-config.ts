import { assign, boolean, object, optional, string } from "superstruct";
import {
  ActionsSharedConfig,
  actionsSharedConfigStruct,
} from "../../shared/config/actions-config";
import {
  entitySharedConfigStruct,
  EntitySharedConfig,
} from "../../shared/config/entity-config";
import { lovelaceCardConfigStruct } from "../../shared/config/lovelace-card-config";
import { LovelaceCardConfig } from "../../ha";
import { HassEntity } from "home-assistant-js-websocket";

export type CompassCardConfig = LovelaceCardConfig &
  ActionsSharedConfig & {
    header?: CcHeaderConfig;
    compass?: CcCompassConfig;
    indicator_sensors: CcIndicatorSensorConfig[];
    value_sensors?: CcValueSensorConfig[];

    tap_action?: ActionConfig;
    language?: string;
    debug?: boolean;
  };

export const compassCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  assign(entitySharedConfigStruct, actionsSharedConfigStruct),
  object({
    icon_color: optional(string()),
  })
);

export interface CcSensorConfig extends CcEntityConfig {
  state_value?: CcPropertiesConfig;
  state_units?: CcPropertiesConfig;
}

export interface CcValueSensorConfig extends CcSensorConfig {
  state_min?: CcPropertiesConfig;
  state_max?: CcPropertiesConfig;
}

export interface CcIndicatorSensorConfig extends CcSensorConfig {
  indicator?: CcIndicatorConfig;
  state_abbreviation?: CcPropertiesConfig;
}

export interface CcIndicatorConfig extends CcPropertiesConfig {
  type?: string;
}

export interface CcHeaderConfig {
  icon?: CcHeaderItemConfig;
  title?: CcHeaderItemConfig;
}

export interface CcHeaderItemConfig extends CcPropertiesConfig {
  value?: string;
}

export interface CcCompassConfig {
  circle?: CcCircleConfig;
  north?: CcNorthConfig;
  east?: CcPropertiesConfig;
  south?: CcPropertiesConfig;
  west?: CcPropertiesConfig;
}

export interface CcCircleConfig extends CcPropertiesConfig {
  background_image?: string;
  background_opacity?: number;
  offset_background?: boolean;
}

export interface CcNorthConfig extends CcPropertiesConfig {
  offset?: number;
}

export interface CcPropertiesConfig {
  color?: string;
  dynamic_style?: CcDynamicStyleConfig;
  show?: boolean;
}

export interface CcDynamicStyleConfig {
  sensor?: string;
  attribute?: string;
  bands: CcStyleBandConfig[];
  unknown?: CcStyleConfig;
}

export interface CcStyleBandConfig extends CcStyleConfig {
  from_value: number;
}

export interface CcStyleConfig {
  color?: string;
  show?: boolean;
}

export interface CcEntityConfig {
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

export interface CcSensor extends CcEntity {
  state_value: CcProperties;
  state_units: CcProperties;
}

export interface CcValueSensor extends CcSensor {
  state_min: CcProperties;
  state_max: CcProperties;
}

export interface CcIndicatorSensor extends CcSensor {
  indicator: CcIndicator;
  state_abbreviation: CcProperties;
}

export interface CcIndicator extends CcProperties {
  type: string;
}

export interface CcHeader {
  label: string;
  title: CcHeaderItem;
  icon: CcHeaderItem;
}

export interface CcHeaderItem extends CcProperties {
  value: string;
}

export interface CcCompass {
  circle: CcCircle;
  north: CcNorth;
  east: CcProperties;
  south: CcProperties;
  west: CcProperties;
}

export interface CcCircle extends CcProperties {
  background_image: string;
  background_opacity: number;
  offset_background: boolean;
}

export interface CcNorth extends CcProperties {
  offset: number;
}

export interface CcProperties {
  color: string;
  dynamic_style: CcDynamicStyle;
  show: boolean;
}

export interface CcDynamicStyle extends CcEntity {
  bands: CcStyleBand[];
  unknown: CcStyle;
}

export interface CcStyleBand extends CcStyle {
  from_value: number;
}

export interface CcStyle {
  color: string;
  show: boolean;
}

export interface CcEntity {
  entity: HassEntity;
  sensor: string;
  is_attribute: boolean;
  units: string;
  decimals: number;
}

export interface CcDirectionInfo {
  abbreviation: string;
  degrees: number;
}

export interface CcSensorAttrib {
  entity: HassEntity;
  sensor: string;
  attribute: string;
  units: string;
  decimals: number;
}

export interface CcColors {
  [propName: string]: string;
}

export interface CcValue {
  value: string;
  units: string;
}
