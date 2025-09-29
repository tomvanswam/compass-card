import { LovelaceCardConfig } from 'custom-card-helpers';
import { object, any, optional, assign, array, refine, boolean, string, enums, number, type Infer } from 'superstruct';
import { ICON_TYPES } from './const';

/* seems needed to cover runtime validation, cannot find a clean solution within superstruct */
export interface CompassCardConfigV1 extends LovelaceCardConfig {
  header?: CCHeaderConfig;
  compass?: CCCompassConfig;
  indicator_sensors: CCIndicatorSensorConfig[];
  value_sensors?: CCValueSensorConfig[];
  tap_action?: ActionConfig;
  language?: string;
  debug?: boolean;
}

/* part modified for superstruct */
export const numberBetween = (min: number, max: number) =>
  refine(number(), `numberBetween(${min}-${max})`, (value) => (value >= min && value <= max ? true : `Expected a number between ${min} and ${max}, got ${value}`));

export const percentage = () => refine(number(), 'percentage', (value) => (value >= 0 && value <= 100 ? true : `Expected a percentage between 0 and 100, got ${value}`));

export const ActionConfigStruct = object({
  action: string(),
  entity: optional(string()),
  service: optional(string()),
  service_data: optional(string()),
  navigation_path: optional(string()),
  url: optional(string()),
  new_tab: optional(boolean()),
});
export type ActionConfig = Infer<typeof ActionConfigStruct>;

export const CCStyleConfigStruct = object({
  color: optional(string()),
  show: optional(boolean()),
});

export const CCStyleBandConfigStruct = assign(
  CCStyleConfigStruct,
  object({
    from_value: number(),
    background_image: optional(string()),
  }),
);
export type CCStyleBandConfig = Infer<typeof CCStyleBandConfigStruct>;

export const CCDynamicStyleConfigStruct = object({
  sensor: string(),
  attribute: optional(string()),
  bands: array(CCStyleBandConfigStruct),
  unknown: optional(CCStyleConfigStruct),
});
export type CCDynamicStyleConfig = Infer<typeof CCDynamicStyleConfigStruct>;

export const CCPropertiesConfigStruct = object({
  color: optional(string()),
  dynamic_style: optional(CCDynamicStyleConfigStruct),
  show: optional(boolean()),
});
export type CCPropertiesConfig = Infer<typeof CCPropertiesConfigStruct>;

export const IconTypeConfigStruct = enums([...ICON_TYPES]);

export const CCIndicatorConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    icon_type: optional(IconTypeConfigStruct),
    icon_value: optional(string()),
    size: optional(number()),
    radius: optional(numberBetween(0, 90)),
  }),
);
export type CCIndicatorConfig = Infer<typeof CCIndicatorConfigStruct>;

export const CCNorthConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    offset: optional(numberBetween(0, 359)),
  }),
);
export type CCNorthConfig = Infer<typeof CCNorthConfigStruct>;

export const CCEntityConfigStruct = object({
  sensor: string(),
  attribute: optional(string()),
  units: optional(string()),
  decimals: optional(number()),
});

export const CCSensorConfigStruct = assign(
  CCEntityConfigStruct,
  object({
    state_value: optional(CCPropertiesConfigStruct),
    state_units: optional(CCPropertiesConfigStruct),
  }),
);

export const CCIndicatorSensorConfigStruct = assign(
  CCSensorConfigStruct,
  object({
    indicator: optional(CCIndicatorConfigStruct),
    state_abbreviation: optional(CCPropertiesConfigStruct),
  }),
);
export type CCIndicatorSensorConfig = Infer<typeof CCIndicatorSensorConfigStruct>;

export const CCValueSensorConfigStruct = assign(
  CCSensorConfigStruct,
  object({
    state_min: optional(CCPropertiesConfigStruct),
    state_max: optional(CCPropertiesConfigStruct),
  }),
);
export type CCValueSensorConfig = Infer<typeof CCValueSensorConfigStruct>;

export const CCHeaderItemConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    value: optional(string()),
  }),
);
export type CCHeaderItemConfig = Infer<typeof CCHeaderItemConfigStruct>;

export const CCHeaderConfigStruct = object({
  icon: optional(CCHeaderItemConfigStruct),
  title: optional(CCHeaderItemConfigStruct),
});
export type CCHeaderConfig = Infer<typeof CCHeaderConfigStruct>;

export const CCCircleConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    background_image: optional(string()),
    background_opacity: optional(number()),
    offset_background: optional(boolean()),
    stroke_width: optional(number()),
  }),
);

export const CCCompassConfigStruct = object({
  circle: optional(CCCircleConfigStruct),
  north: optional(CCNorthConfigStruct),
  east: optional(CCPropertiesConfigStruct),
  south: optional(CCPropertiesConfigStruct),
  west: optional(CCPropertiesConfigStruct),
  scale: optional(number()),
});
export type CCCompassConfig = Infer<typeof CCCompassConfigStruct>;

export const LovelaceCardBaseStruct = object({
  // keep optional or delete entirely if you don't want it validated
  // type: optional(string()),
  view_layout: optional(object({ 'grid-area': optional(string()) })),
});

export const CompassCardConfigStruct = assign(
  LovelaceCardBaseStruct,
  object({
    type: string(),
    header: optional(CCHeaderConfigStruct),
    compass: optional(CCCompassConfigStruct),
    indicator_sensors: array(CCIndicatorSensorConfigStruct),
    value_sensors: optional(array(CCValueSensorConfigStruct)),
    tap_action: optional(ActionConfigStruct),
    language: optional(string()),
    debug: optional(boolean()),
    test_gui: optional(boolean()),
    grid_options: optional(any()),
    card_mod: optional(any()),
  }),
);

export type CompassCardExtras = Infer<typeof CompassCardConfigStruct>;

export type CompassCardConfig = LovelaceCardConfig & CompassCardExtras;
