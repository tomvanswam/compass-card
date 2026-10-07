import { any, array, assign, boolean, enums, Infer, number, object, optional, pattern, record, refine, size, string, type, union } from 'superstruct';
import { DEGREES_MAX, DEGREES_MID, DEGREES_MIN, DEGREES_ONE, ICON_VALUES, MAX_INDICATOR_ARRAY_SIZE, MAX_PERCENTAGE, MIN_INDICATOR_ARRAY_SIZE, MIN_PERCENTAGE, OPACITY_TRANSPARENT, OPACITY_VISIBLE, UNKNOWN_DIRECTION_VALUES, URL_REGEX } from './const.js';
import { COMPASS_LANGUAGES } from './localize/localize.js';
import { LovelaceCardConfig } from './utils/ha-helpers.js';

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

export const percentage = () => refine(number(), 'percentage', (value) => (value >= MIN_PERCENTAGE && value <= MAX_PERCENTAGE ? true : `Expected a percentage between 0 and 100, got ${value}`));

const CCImageStruct = optional(union([enums([...ICON_VALUES]), pattern(string(), /^mdi:.*/), pattern(string(), URL_REGEX)]));

export const ActionConfigStruct = object({
  action: optional(enums(['more-info', 'navigate', 'call-service', 'perform-action', 'url', 'toggle', 'assist', 'none'])),
  confirmation: optional(any()),
  data: optional(record(string(), any())),
  entity: optional(string()),
  navigation_path: optional(string()),
  navigation_replace: optional(boolean()),
  new_tab: optional(boolean()),
  perform_action: optional(string()),
  pipeline_id: optional(string()),
  service: optional(string()),
  service_data: optional(string()),
  start_listening: optional(boolean()),
  target: optional(record(string(), any())),
  url: optional(string()),
  url_path: optional(string()),
});
export type ActionConfig = Infer<typeof ActionConfigStruct>;

export const CCStyleConfigStruct = object({
  background_image: optional(pattern(string(), URL_REGEX)),
  color: optional(string()),
  image: CCImageStruct,
  opacity: optional(numberBetween(OPACITY_TRANSPARENT, OPACITY_VISIBLE)),
  radius: optional(number()),
  show: optional(boolean()),
  size: optional(number()),
});

export const CCStyleBandConfigStruct = assign(
  CCStyleConfigStruct,
  object({
    from_value: number(),
  }),
);
export type CCStyleBandConfig = Infer<typeof CCStyleBandConfigStruct>;

export const CCDynamicStyleConfigStruct = object({
  attribute: optional(string()),
  bands: array(CCStyleBandConfigStruct),
  sensor: string(),
  unknown: optional(CCStyleConfigStruct),
});
export type CCDynamicStyleConfig = Infer<typeof CCDynamicStyleConfigStruct>;

export const CCPropertiesConfigStruct = object({
  color: optional(string()),
  dynamic_style: optional(CCDynamicStyleConfigStruct),
  show: optional(boolean()),
});
export type CCPropertiesConfig = Infer<typeof CCPropertiesConfigStruct>;

export const CCIndicatorConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    image: CCImageStruct,
    opacity: optional(numberBetween(OPACITY_TRANSPARENT, OPACITY_VISIBLE)),
    radius: optional(number()),
    size: optional(number()),
  }),
);
export type CCIndicatorConfig = Infer<typeof CCIndicatorConfigStruct>;

export const CCNorthConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    offset: optional(numberBetween(DEGREES_MIN, DEGREES_MAX)),
  }),
);
export type CCNorthConfig = Infer<typeof CCNorthConfigStruct>;

export const CCTicksConfigStruct = assign(
  CCPropertiesConfigStruct,
  object({
    radius: optional(number()),
    step: optional(numberBetween(DEGREES_ONE, DEGREES_MID)),
  }),
);
export type CCTicksConfig = Infer<typeof CCTicksConfigStruct>;

export const CCEntityConfigStruct = object({
  attribute: optional(string()),
  decimals: optional(number()),
  sensor: string(),
  units: optional(string()),
});

export const CCSensorConfigStruct = assign(
  CCEntityConfigStruct,
  object({
    state_units: optional(CCPropertiesConfigStruct),
    state_value: optional(CCPropertiesConfigStruct),
    tap_action: optional(ActionConfigStruct),
  }),
);

export const CCIndicatorSensorConfigStruct = assign(
  CCSensorConfigStruct,
  object({
    indicator: CCIndicatorConfigStruct,
    state_abbreviation: optional(CCPropertiesConfigStruct),
  }),
);
export type CCIndicatorSensorConfig = Infer<typeof CCIndicatorSensorConfigStruct>;

export const CCValueSensorConfigStruct = CCSensorConfigStruct;

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
    background_opacity: optional(numberBetween(OPACITY_TRANSPARENT, OPACITY_VISIBLE)),
    offset_background: optional(boolean()),
    stroke_width: optional(number()),
  }),
);

export const CCCompassConfigStruct = object({
  circle: optional(CCCircleConfigStruct),
  east: optional(CCPropertiesConfigStruct),
  north: optional(CCNorthConfigStruct),
  scale: optional(number()),
  south: optional(CCPropertiesConfigStruct),
  ticks: optional(CCTicksConfigStruct),
  west: optional(CCPropertiesConfigStruct),
});
export type CCCompassConfig = Infer<typeof CCCompassConfigStruct>;

export const CompassCardConfigStruct = type({
  compass: optional(CCCompassConfigStruct),
  debug: optional(boolean()),
  header: optional(CCHeaderConfigStruct),
  indicator_sensors: size(array(CCIndicatorSensorConfigStruct), MIN_INDICATOR_ARRAY_SIZE, MAX_INDICATOR_ARRAY_SIZE),
  language: optional(enums([...COMPASS_LANGUAGES])),
  tap_action: optional(ActionConfigStruct),
  // deprecated, ignored; kept so existing configurations stay valid
  test_gui: optional(boolean()),
  type: string(),
  unknown_direction: optional(enums([...UNKNOWN_DIRECTION_VALUES])),
  value_sensors: optional(array(CCValueSensorConfigStruct)),
});

export type CompassCardExtras = Infer<typeof CompassCardConfigStruct>;

export type CompassCardConfig = LovelaceCardConfig & CompassCardExtras;
