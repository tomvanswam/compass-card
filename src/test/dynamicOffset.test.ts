// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest';
import { cardConfig, COLORS, ENTITIES } from './fixtures';
import { CompassCardConfig, CompassCardConfigStruct } from '../editor/editorTypes';
import { findValues, getCompass } from '../utils/objectHelpers';
import { assert } from 'superstruct';
import type { CompassCard } from '../compass-card';
import { compassRotation } from '../render/direction';

// compass.north.dynamic_offset: the compass rotates with the value of an entity (#1125), in mode heading_up against it (#1040)

const HEADING = 'input_number.wind_direction_1'; // 90
const withOffset = (north: object, circle?: object) => cardConfig({ compass: { circle, north }, indicator_sensors: [{ indicator: { image: 'arrow_outward' }, sensor: 'sensor.wind_direction' }] } as Partial<CompassCardConfig>);

describe('compassRotation', () => {
  it('adds the dynamic value to the fixed offset, or subtracts it for heading up', () => {
    expect(compassRotation(15)).toBe(15);
    expect(compassRotation(15, 90)).toBe(105);
    expect(compassRotation(15, 90, 'heading_up')).toBe(285);
    expect(compassRotation(300, 90)).toBe(30);
    expect(compassRotation(0, 0, 'heading_up')).toBe(0);
  });
});

describe('dynamic offset configuration', () => {
  const valid = (north: object) => {
    try {
      assert(withOffset(north), CompassCardConfigStruct);
      return true;
    } catch {
      return false;
    }
  };

  it('needs a sensor and accepts attribute and mode', () => {
    expect(valid({ dynamic_offset: { sensor: HEADING } })).toBe(true);
    expect(valid({ dynamic_offset: { attribute: 'azimuth', mode: 'heading_up', sensor: 'sun.sun' }, offset: 10 })).toBe(true);
    expect(valid({ dynamic_offset: { mode: 'heading_up' } })).toBe(false);
    expect(valid({ dynamic_offset: { mode: 'inverted', sensor: HEADING } })).toBe(false);
  });

  it('is resolved by getCompass and absent without a sensor', () => {
    expect(getCompass(cardConfig(), COLORS, ENTITIES).north.dynamic_offset).toBeUndefined();
    expect(getCompass(withOffset({ dynamic_offset: { sensor: HEADING } }), COLORS, ENTITIES).north.dynamic_offset).toMatchObject({ is_attribute: false, mode: 'follow', sensor: HEADING });
    const attribute = getCompass(withOffset({ dynamic_offset: { attribute: 'azimuth', mode: 'heading_up', sensor: 'sun.sun' } }), COLORS, ENTITIES).north.dynamic_offset;
    expect(attribute).toMatchObject({ is_attribute: true, mode: 'heading_up', sensor: 'sun.sun.azimuth' });
  });

  it('makes the card listen to the offset entity', () => {
    expect(findValues(withOffset({ dynamic_offset: { sensor: HEADING } }), ENTITIES, false)).toContain(HEADING);
    expect(findValues(withOffset({ dynamic_offset: { attribute: 'azimuth', sensor: 'sun.sun' } }), ENTITIES, false)).toContain('sun.sun');
  });
});

describe('compass-card with a dynamic offset', () => {
  beforeAll(async () => {
    await import('../compass-card');
  });

  async function rotations(config: CompassCardConfig, states = ENTITIES) {
    const card = document.createElement('compass-card') as CompassCard;
    card.setConfig(config);
    card.hass = { language: 'en', localize: (key: string) => key, states } as never;
    document.body.appendChild(card);
    await card.updateComplete;
    const rotation = (selector: string) => card.shadowRoot?.querySelector(selector)?.getAttribute('transform')?.replace(/\s/g, '');
    const result = { card, circle: rotation('circle.circle'), compass: rotation('g.indicators') };
    return result;
  }

  it('rotates the compass and circle with the entity on top of the fixed offset', async () => {
    const { card, circle, compass } = await rotations(withOffset({ dynamic_offset: { sensor: HEADING }, offset: 15 }));
    expect(compass).toBe('rotate(105,76,76)');
    expect(circle).toBe('rotate(105,76,76)');
    card.remove();
  });

  it('turns against the entity in mode heading_up and keeps the background in place without offset_background', async () => {
    const { card, circle, compass } = await rotations(withOffset({ dynamic_offset: { mode: 'heading_up', sensor: HEADING } }, { offset_background: false }));
    expect(compass).toBe('rotate(270,76,76)');
    expect(circle).toBe('rotate(0,76,76)');
    card.remove();
  });

  it('follows changes of the entity and an attribute', async () => {
    const { card, compass } = await rotations(withOffset({ dynamic_offset: { attribute: 'azimuth', sensor: 'sun.sun' } }));
    expect(compass).toBe('rotate(120,76,76)');
    card.hass = { language: 'en', localize: (key: string) => key, states: { ...ENTITIES, 'sun.sun': { ...ENTITIES['sun.sun'], attributes: { azimuth: 200 } } } } as never;
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector('g.indicators')?.getAttribute('transform')?.replace(/\s/g, '')).toBe('rotate(200,76,76)');
    card.remove();
  });

  it('uses only the fixed offset while the entity is unavailable or missing', async () => {
    const unavailable = { ...ENTITIES, [HEADING]: { ...ENTITIES[HEADING], state: 'unavailable' } };
    const first = await rotations(withOffset({ dynamic_offset: { sensor: HEADING }, offset: 15 }), unavailable);
    expect(first.compass).toBe('rotate(15,76,76)');
    first.card.remove();
    const second = await rotations(withOffset({ dynamic_offset: { sensor: 'sensor.does_not_exist' }, offset: 15 }));
    expect(second.compass).toBe('rotate(15,76,76)');
    second.card.remove();
  });
});
