import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { CCColors } from '../cardTypes';
import { CompassCardConfig } from '../editor/editorTypes';

// Shared test data: a few entities like the ones in the dev Home Assistant and the card's default colors

function entity(entityId: string, state: string, attributes: Record<string, unknown> = {}): HassEntity {
  return {
    attributes,
    context: { id: '', parent_id: null, user_id: null },
    entity_id: entityId,
    last_changed: '',
    last_updated: '',
    state,
  };
}

export const ENTITIES: HassEntities = {
  'input_number.wind_direction_1': entity('input_number.wind_direction_1', '90', { unit_of_measurement: '°' }),
  'input_number.wind_direction_2': entity('input_number.wind_direction_2', '180', { unit_of_measurement: '°' }),
  'input_number.wind_speed': entity('input_number.wind_speed', '11', { unit_of_measurement: 'm/s' }),
  'sensor.wind_direction': entity('sensor.wind_direction', '270', { device_class: 'wind_direction', unit_of_measurement: '°' }),
  'sun.sun': entity('sun.sun', 'above_horizon', { azimuth: 120, elevation: 30 }),
};

export const COLORS: CCColors = {
  accent: 'var(--accent-color)',
  primary: 'var(--primary-color)',
  primaryText: 'var(--primary-text-color)',
  secondaryText: 'var(--secondary-text-color)',
  stateIcon: 'var(--state-icon-color)',
};

// A minimal valid card configuration, extended per test
export function cardConfig(extra: Partial<CompassCardConfig> = {}): CompassCardConfig {
  return {
    indicator_sensors: [{ indicator: { image: 'arrow_outward' }, sensor: 'input_number.wind_direction_1' }],
    type: 'custom:compass-card',
    ...extra,
  } as CompassCardConfig;
}
