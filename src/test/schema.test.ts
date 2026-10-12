import { describe, expect, it } from 'vitest';
import { cardConfig } from './fixtures';
import { CompassCardConfigStruct } from '../editor/editorTypes';
import { is } from 'superstruct';
import { URL_REGEX } from '../const';

const valid = (config: object) => is(cardConfig(config), CompassCardConfigStruct);
const withImage = (image: string) => ({ indicator_sensors: [{ indicator: { image }, sensor: 'sun.sun' }] });
const circle = (circleConfig: object) => ({ compass: { circle: circleConfig } });
const northStyle = (dynamicStyle: object) => ({ compass: { north: { dynamic_style: dynamicStyle } } });

describe('URL_REGEX', () => {
  it.each(['https://example.com/a.png', 'http://host/a.png', '/local/images/a.png', '/media/local/a.png', '/api/image/x'])('accepts %s', (url) => {
    expect(URL_REGEX.test(url)).toBe(true);
  });

  it.each(['images/a.png', 'a.png', 'foo/local/x.png', 'ftp://host/a.png'])('rejects %s', (url) => {
    expect(URL_REGEX.test(url)).toBe(false);
  });
});

describe('CompassCardConfigStruct', () => {
  it('accepts a minimal config and extra card options like grid_options', () => {
    expect(valid({})).toBe(true);
    expect(valid({ card_mod: { style: '' }, grid_options: { columns: 6 }, view_layout: { position: 'main' } } as object)).toBe(true);
  });

  it('requires 1 to 10 indicator sensors with an indicator object', () => {
    expect(valid({ indicator_sensors: [] })).toBe(false);
    const eleven = Array.from({ length: 11 }, () => ({ indicator: {}, sensor: 'sun.sun' }));
    expect(valid({ indicator_sensors: eleven })).toBe(false);
    expect(valid({ indicator_sensors: [{ sensor: 'sun.sun' }] } as object)).toBe(false);
  });

  it.each(['arrow_inward', 'arrow_outward', 'circle', 'mdi:home', '/local/a.png', 'https://example.com/a.png'])('accepts indicator image %s', (image) => {
    expect(valid(withImage(image))).toBe(true);
  });

  it.each(['arrow', 'images/a.png', 'home'])('rejects indicator image %s', (image) => {
    expect(valid(withImage(image))).toBe(false);
  });

  it('checks background_image on the circle and in bands like an image URL, but allows an empty string', () => {
    expect(valid(circle({ background_image: '/local/bg.png' }))).toBe(true);
    expect(valid(circle({ background_image: '' }))).toBe(true);
    expect(valid(circle({ background_image: 'images/bg.png' }))).toBe(false);
    expect(valid(circle({ dynamic_style: { bands: [{ background_image: '/media/bg.png', from_value: 0 }] } }))).toBe(true);
    expect(valid(circle({ dynamic_style: { bands: [{ background_image: 'bg.png', from_value: 0 }] } }))).toBe(false);
    expect(valid(circle({ dynamic_style: { unknown: { background_image: 'bg.png' } } }))).toBe(false);
  });

  it('keeps opacity between 0 and 1', () => {
    expect(valid(circle({ background_opacity: 0.5 }))).toBe(true);
    expect(valid(circle({ background_opacity: 1.5 }))).toBe(false);
    expect(valid({ indicator_sensors: [{ indicator: { opacity: 0.3 }, sensor: 'sun.sun' }] })).toBe(true);
    expect(valid({ indicator_sensors: [{ indicator: { opacity: -0.1 }, sensor: 'sun.sun' }] })).toBe(false);
    expect(valid(northStyle({ bands: [{ from_value: 0, opacity: 2 }] }))).toBe(false);
  });

  it('makes sensor and bands of a dynamic style optional and keeps old configs valid', () => {
    expect(valid(northStyle({ unknown: { color: 'red' } }))).toBe(true);
    expect(valid(northStyle({ bands: [{ color: 'red', from_value: 0 }] }))).toBe(true);
    expect(valid(northStyle({ bands: [], sensor: '' }))).toBe(true);
    expect(valid(northStyle({ bands: [{ color: 'red' }] }))).toBe(false);
  });

  it('checks ranges of north offset and tick step', () => {
    expect(valid({ compass: { north: { offset: 360 } } })).toBe(true);
    expect(valid({ compass: { north: { offset: 361 } } })).toBe(false);
    expect(valid({ compass: { ticks: { step: 0 } } })).toBe(false);
    expect(valid({ compass: { ticks: { step: 180 } } })).toBe(true);
  });

  it('accepts the supported tap actions and unknown_direction values', () => {
    expect(valid({ tap_action: { action: 'navigate', navigation_path: '/lovelace/1', new_tab: false } })).toBe(true);
    expect(valid({ tap_action: { action: 'perform-action', data: { brightness: 50 }, perform_action: 'light.turn_on', target: { entity_id: 'light.x' } } })).toBe(true);
    expect(valid({ tap_action: { action: 'call-service', service: 'light.toggle', service_data: '{}' } })).toBe(true);
    expect(valid({ tap_action: { action: 'fly' } } as object)).toBe(false);
    expect(valid({ indicator_sensors: [{ indicator: {}, sensor: 'sun.sun', tap_action: { action: 'more-info' } }] })).toBe(true);
    expect(valid({ unknown_direction: 'last' })).toBe(true);
    expect(valid({ unknown_direction: 'west' } as object)).toBe(false);
  });

  it('rejects unknown keys inside nested objects', () => {
    expect(valid({ compass: { north: { colour: 'red' } } } as object)).toBe(false);
  });
});
