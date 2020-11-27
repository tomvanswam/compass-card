import { LovelaceCardConfig } from 'custom-card-helpers';
import { DEFAULT_INDICATOR, INDICATORS } from './const';
import { CompassCardConfigV1 } from './editorTypes';

export interface CompassCardConfigV0 extends LovelaceCardConfig {
  type: string;
  name: string;
  direction_offset: string;
  entity: string;
  secondary_entity?: string;
  compass?: CCCompassV0;
  tap_action?: ActionConfigV0;
}

export interface CCCompassV0 {
  indicator?: string;
  show_north?: boolean;
  language?: string;
}

export interface ActionConfigV0 {
  action?: string;
  entity?: string;
  service?: string;
  service_data?: string;
  navigation_path?: string;
  url?: string;
  new_tab?: boolean;
}

// eslint-disable-next-line
export function isV0Config(object: any): object is CompassCardConfigV0 {
  return object && object.entity && typeof object.entity == 'string';
}

export function configV0ToV1(dep: CompassCardConfigV0): CompassCardConfigV1 {
  const conf: CompassCardConfigV1 = { type: 'custom:compass-card', indicator_sensors: [{ sensor: dep.entity }] };

  if (dep.compass?.indicator && INDICATORS.indexOf(dep.compass?.indicator) !== DEFAULT_INDICATOR) {
    conf.indicator_sensors[0] = { ...conf.indicator_sensors[0], indicator: { type: dep.compass.indicator } };
  }
  if (dep.secondary_entity && dep.secondary_entity !== '') {
    conf.value_sensors = [{ sensor: dep.secondary_entity }];
  }
  if (dep.direction_offset && dep.direction_offset !== '0') {
    conf.compass = { ...conf.compass, north: { offset: Number(dep.direction_offset), ...conf.compass?.north } };
  }
  if (dep.compass?.show_north && dep.compass?.show_north) {
    conf.compass = { ...conf.compass, north: { show: true, ...conf.compass?.north } };
  }
  if (dep.compass?.language && dep.compass?.language !== '') {
    conf.language = dep.compass?.language;
  }
  if (dep.tap_action) {
    conf.tap_action = dep.tap_action;
  }
  if (dep.name) {
    conf.header = { title: { value: dep.name } };
  }

  return { ...conf };
}
