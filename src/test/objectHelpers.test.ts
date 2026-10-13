import { abbreviationShowDefault, backgroundOpacityDefault, CONFIG_DEFAULTS, headerIconShowDefault, headerTitleShowDefault } from '../defaults';
import { cardConfig, COLORS, ENTITIES } from './fixtures';
import { describe, expect, it } from 'vitest';
import { getBoolean, getCompass, getHeader, getIndicatorScale, getIndicatorSensors, getValueSensors } from '../utils/objectHelpers';
import { CompassCardConfig } from '../editor/editorTypes';
import { DEFAULT_INDICATOR_RADIUS } from '../const';

const band = { bands: [{ color: 'red', from_value: 0 }] };

describe('defaults.ts', () => {
  it('derives the header visibility from title and icon', () => {
    expect(headerTitleShowDefault(undefined)).toBe(false);
    expect(headerTitleShowDefault('')).toBe(true);
    expect(headerIconShowDefault(undefined, undefined)).toBe(false);
    expect(headerIconShowDefault('mdi:home', undefined)).toBe(true);
    expect(headerIconShowDefault(undefined, 'Wind')).toBe(true);
  });

  it('shows the abbreviation only for the first indicator and derives the background opacity from the image', () => {
    expect(abbreviationShowDefault(0)).toBe(true);
    expect(abbreviationShowDefault(1)).toBe(false);
    expect(backgroundOpacityDefault('/local/bg.png')).toBe(1);
    expect(backgroundOpacityDefault(undefined)).toBe(0);
  });
});

describe('getBoolean', () => {
  it('uses the default only for undefined', () => {
    expect(getBoolean(undefined, true)).toBe(true);
    expect(getBoolean(false, true)).toBe(false);
    expect(getBoolean('x', false)).toBe(true);
  });
});

describe('getCompass', () => {
  it('applies the shared defaults to an empty compass config', () => {
    const compass = getCompass(cardConfig(), COLORS, ENTITIES);
    const defaults = CONFIG_DEFAULTS.compass;
    expect(compass.north.show).toBe(defaults.north.show);
    expect(compass.east.show).toBe(defaults.east.show);
    expect(compass.circle.show).toBe(defaults.circle.show);
    expect(compass.circle.stroke_width).toBe(defaults.circle.stroke_width);
    expect(compass.circle.offset_background).toBe(defaults.circle.offset_background);
    expect(compass.ticks).toMatchObject({ radius: defaults.ticks.radius, show: defaults.ticks.show, step: defaults.ticks.step });
    expect(compass.north.offset).toBe(defaults.north.offset);
    expect(compass.scale).toBe(defaults.scale);
    expect(compass.north.color).toBe(COLORS.primary);
  });

  it('uses configured values', () => {
    const compass = getCompass(cardConfig({ compass: { circle: { background_image: '/local/bg.png', stroke_width: 1.5 }, north: { color: 'red', offset: 45, show: true } } }), COLORS, ENTITIES);
    expect(compass.north).toMatchObject({ color: 'red', offset: 45, show: true });
    expect(compass.circle.stroke_width).toBe(1.5);
    expect(compass.circle.background_opacity).toBe(1);
  });
});

describe('getHeader', () => {
  it('shows title and icon only when configured', () => {
    expect(getHeader(cardConfig(), COLORS, ENTITIES['sun.sun'], ENTITIES).title.show).toBe(false);
    const header = getHeader(cardConfig({ header: { title: { value: 'Wind' } } }), COLORS, ENTITIES['sun.sun'], ENTITIES);
    expect(header.title.show).toBe(true);
    expect(header.icon.show).toBe(true);
  });
});

describe('getIndicatorSensors', () => {
  it('applies the indicator defaults and skips sensors without entity', () => {
    const config = cardConfig({ indicator_sensors: [{ indicator: {}, sensor: 'input_number.wind_direction_1' }, { indicator: {}, sensor: 'sensor.missing' }, { indicator: {}, sensor: 'input_number.wind_direction_2' }] });
    const sensors = getIndicatorSensors(config, COLORS, ENTITIES);
    expect(sensors).toHaveLength(2);
    const defaults = CONFIG_DEFAULTS.indicator_sensor;
    expect(sensors[0].indicator).toMatchObject({ image: defaults.indicator.image, opacity: defaults.indicator.opacity, radius: defaults.indicator.radius, show: true, size: defaults.indicator.size });
    expect(sensors[0].state_abbreviation.show).toBe(true);
    expect(sensors[1].state_abbreviation.show).toBe(false);
    expect(sensors[0].state_value.show).toBe(defaults.state_value.show);
    expect(sensors[0].units).toBe('°');
  });

  it('reads attributes', () => {
    const [sensor] = getIndicatorSensors(cardConfig({ indicator_sensors: [{ attribute: 'azimuth', indicator: {}, sensor: 'sun.sun' }] }), COLORS, ENTITIES);
    expect(sensor.is_attribute).toBe(true);
    expect(sensor.sensor).toBe('sun.sun.azimuth');
  });
});

describe('dynamic style source (getSensorAttrib)', () => {
  const config = (): CompassCardConfig =>
    cardConfig({
      compass: { north: { dynamic_style: band } },
      header: { title: { dynamic_style: band, value: 'Wind' } },
      indicator_sensors: [
        { indicator: {}, sensor: 'input_number.wind_direction_1' },
        { indicator: { dynamic_style: band }, sensor: 'input_number.wind_direction_2', state_abbreviation: { dynamic_style: band }, state_units: { dynamic_style: band }, state_value: { dynamic_style: band } },
      ],
      value_sensors: [{ sensor: 'input_number.wind_speed', state_units: { dynamic_style: band }, state_value: { dynamic_style: band } }],
    });

  it('uses the own sensor for the parts of an indicator sensor', () => {
    const [, second] = getIndicatorSensors(config(), COLORS, ENTITIES);
    for (const part of [second.indicator, second.state_value, second.state_units, second.state_abbreviation]) {
      expect(part.dynamic_style.sensor).toBe('input_number.wind_direction_2');
    }
  });

  it('uses the own sensor for the parts of a value sensor', () => {
    const [value] = getValueSensors(config(), COLORS, ENTITIES);
    expect(value.state_value.dynamic_style.sensor).toBe('input_number.wind_speed');
    expect(value.state_units.dynamic_style.sensor).toBe('input_number.wind_speed');
  });

  it('uses the first value sensor, else the first indicator for header and compass', () => {
    expect(getCompass(config(), COLORS, ENTITIES).north.dynamic_style.sensor).toBe('input_number.wind_speed');
    const header = getHeader(config(), COLORS, ENTITIES['input_number.wind_direction_1'], ENTITIES);
    expect(header.title.dynamic_style.sensor).toBe('input_number.wind_speed');
    const withoutValues = { ...config(), value_sensors: undefined };
    expect(getCompass(withoutValues, COLORS, ENTITIES).north.dynamic_style.sensor).toBe('input_number.wind_direction_1');
  });

  it('prefers a configured sensor and attribute', () => {
    const configured = cardConfig({ compass: { north: { dynamic_style: { ...band, attribute: 'elevation', sensor: 'sun.sun' } } } });
    expect(getCompass(configured, COLORS, ENTITIES).north.dynamic_style.sensor).toBe('sun.sun.elevation');
  });
});

describe('getDynamicStyle bands', () => {
  it('sorts bands and inherits unset options from the previous band or the element', () => {
    const style = { bands: [{ color: 'green', from_value: 10 }, { from_value: 0, opacity: 0.5, show: false }, { from_value: 20, image: 'circle' }] };
    const [sensor] = getIndicatorSensors(cardConfig({ indicator_sensors: [{ indicator: { color: 'blue', dynamic_style: style, image: 'arrow_inward' }, sensor: 'input_number.wind_direction_1' }] }), COLORS, ENTITIES);
    const { bands } = sensor.indicator.dynamic_style;
    expect(bands.map((b) => b.from_value)).toEqual([0, 10, 20]);
    expect(bands[0]).toMatchObject({ color: 'blue', image: 'arrow_inward', opacity: 0.5, show: false });
    expect(bands[1]).toMatchObject({ color: 'green', opacity: 0.5, show: false });
    expect(bands[2]).toMatchObject({ color: 'green', image: 'circle', show: false });
  });

  it('works without bands (unknown style only)', () => {
    const compass = getCompass(cardConfig({ compass: { north: { dynamic_style: { unknown: { color: 'red' } } } } }), COLORS, ENTITIES);
    expect(compass.north.dynamic_style.bands).toEqual([]);
    expect(compass.north.dynamic_style.unknown.color).toBe('red');
  });
});

describe('getIndicatorScale', () => {
  it('is 1 when the indicator fits inside the compass', () => {
    expect(getIndicatorScale('circle', 10, 40)).toBe(1);
    expect(getIndicatorScale('circle', 40, DEFAULT_INDICATOR_RADIUS)).toBeLessThan(1);
  });
});

describe('missing entities', () => {
  // every element builds its dynamic style from the first indicator, so a missing first entity must not throw
  it('renders the other elements when the first indicator entity does not exist', () => {
    const config = cardConfig({ indicator_sensors: [{ indicator: {}, sensor: 'sensor.removed' }, { indicator: {}, sensor: 'input_number.wind_direction_1' }], value_sensors: [{ sensor: 'sensor.also_removed' }] });
    expect(() => getCompass(config, COLORS, ENTITIES)).not.toThrow();
    expect(() => getHeader(config, COLORS, ENTITIES['sensor.removed'], ENTITIES)).not.toThrow();
    expect(getIndicatorSensors(config, COLORS, ENTITIES)).toHaveLength(1);
    expect(getValueSensors(config, COLORS, ENTITIES)).toHaveLength(0);
  });
});

describe('0 is a valid value for numeric options', () => {
  it('keeps 0 for circle, background opacity, indicator size and band opacity', () => {
    const compass = getCompass(cardConfig({ compass: { circle: { background_image: '/local/bg.png', background_opacity: 0, stroke_width: 0 } } }), COLORS, ENTITIES);
    expect(compass.circle.stroke_width).toBe(0);
    expect(compass.circle.background_opacity).toBe(0);
    const style = { bands: [{ from_value: 0, opacity: 0, size: 0 }, { from_value: 10 }] };
    const [sensor] = getIndicatorSensors(cardConfig({ indicator_sensors: [{ indicator: { dynamic_style: style, size: 0 }, sensor: 'input_number.wind_direction_1' }] }), COLORS, ENTITIES);
    expect(sensor.indicator.size).toBe(0);
    expect(sensor.indicator.dynamic_style.bands.map((b) => [b.opacity, b.size])).toEqual([[0, 0], [0, 0]]);
  });
});
