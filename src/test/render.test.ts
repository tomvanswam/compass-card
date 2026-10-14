// @vitest-environment jsdom
import { activeColor, activeOpacity, activeSize, getActiveBand, isVisible } from '../render/activeStyle';
import { ARROW_ART, CIRCLE } from '../const';
import { arrowTransform, circleTransform, svgIconIndicator, svgImageIndicator } from '../render/indicators';
import { cardConfig, COLORS, ENTITIES } from './fixtures';
import { describe, expect, it } from 'vitest';
import { getCompassAbbreviation, getValue, parseDirection, positiveDegrees } from '../render/direction';
import { render, SVGTemplateResult } from 'lit';
import { svgTicks, tickLevel, tickLines } from '../render/compass';
import { CCTicks } from '../cardTypes';
import { getIndicatorSensors } from '../utils/objectHelpers';

// The pure render functions of the card: positions in the 152x152 viewBox, scale, direction and active style

function renderSvg(template: SVGTemplateResult): SVGSVGElement {
  const root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  render(template, root);
  return root;
}

describe('compass ticks', () => {
  it('has major ticks at N/E/S/W, medium ones near the 22.5 degree points and minor ones elsewhere', () => {
    expect(tickLevel(0)).toBe('major');
    expect(tickLevel(270)).toBe('major');
    expect(tickLevel(22.5)).toBe('medium');
    expect(tickLevel(45)).toBe('medium');
    expect(tickLevel(21.5)).toBe('medium');
    expect(tickLevel(15)).toBe('minor');
    expect(tickLevel(30)).toBe('minor');
  });

  it('draws one tick per step, starting at north, from inside the radius to just outside it', () => {
    const ticks = tickLines(62, 15);
    expect(ticks).toHaveLength(24);
    expect(ticks.filter((tick) => tick.level === 'major')).toHaveLength(4);
    const [north] = ticks;
    expect(north).toEqual({ level: 'major', x1: CIRCLE.CENTER, x2: CIRCLE.CENTER, y1: CIRCLE.CENTER - 52, y2: CIRCLE.CENTER - 64 });
    const [, , , , , , east] = ticks;
    expect(east.x1).toBeCloseTo(CIRCLE.CENTER + 52);
    expect(east.x2).toBeCloseTo(CIRCLE.CENTER + 64);
    expect(east.y1).toBeCloseTo(CIRCLE.CENTER);
  });

  it('renders the ticks as svg lines with their level as class', () => {
    const root = renderSvg(svgTicks({ color: 'red', radius: 62, show: true, step: 45 } as CCTicks));
    expect(root.querySelectorAll('line.tick')).toHaveLength(8);
    expect(root.querySelectorAll('line.major')).toHaveLength(4);
    expect(root.querySelectorAll('line.medium')).toHaveLength(4);
    expect(root.querySelector('g.ticks')?.getAttribute('style')).toContain('--compass-card-tick-color: red');
  });
});

describe('indicator placement', () => {
  it('scales the arrow to the smallest of radius and size', () => {
    expect(arrowTransform(ARROW_ART.SIZE, ARROW_ART.RADIUS).scale).toBeCloseTo(1);
    expect(arrowTransform(36, 52).scale).toBeCloseTo(36 / ARROW_ART.SIZE);
    expect(arrowTransform(36, 4).scale).toBeCloseTo(4 / ARROW_ART.RADIUS);
  });

  it('keeps the arrow centered on the north line', () => {
    for (const [size, radius] of [[19, 52], [40, 30], [10, 62]]) {
      const { scale, x } = arrowTransform(size, radius);
      expect(x + scale * CIRCLE.CENTER).toBeCloseTo(CIRCLE.CENTER, 2);
    }
  });

  it('centers the circle `radius` above the compass center', () => {
    const { scale, x, y } = circleTransform(20, 40);
    expect(scale).toBeCloseTo(20 / ARROW_ART.SIZE);
    expect(x + scale * CIRCLE.CENTER).toBeCloseTo(CIRCLE.CENTER);
    // the circle artwork's center is at y = top + radius
    expect(y + scale * (ARROW_ART.TOP + ARROW_ART.RADIUS)).toBeCloseTo(CIRCLE.CENTER - 40);
  });

  it('draws icons and images in a box centered on the indicator position', () => {
    const icon = renderSvg(svgIconIndicator('M0 0h24v24H0z', { opacity: 0.5, radius: 40, size: 48 })).querySelector('svg');
    expect(icon?.getAttribute('x')).toBe(String(CIRCLE.CENTER - 24));
    expect(icon?.getAttribute('y')).toBe(String(CIRCLE.CENTER - 40 - 24));
    expect(icon?.getAttribute('width')).toBe('48');
    // small icons keep the 24x24 mdi box
    expect(renderSvg(svgIconIndicator('M0 0', { opacity: 1, radius: 40, size: 12 })).querySelector('svg')?.getAttribute('width')).toBe('24');
    const image = renderSvg(svgImageIndicator('/local/arrow.png', { opacity: 0.3, radius: 30, size: 20 })).querySelector('image');
    expect(image?.getAttribute('x')).toBe(String(CIRCLE.CENTER - 10));
    expect(image?.getAttribute('y')).toBe(String(CIRCLE.CENTER - 30 - 10));
    expect(image?.getAttribute('opacity')).toBe('0.3');
  });
});

describe('direction', () => {
  it('normalizes any angle to 0 <= degrees < 360', () => {
    expect(positiveDegrees(370)).toBe(10);
    expect(positiveDegrees(720)).toBe(0);
    expect(positiveDegrees(-10)).toBe(350);
    expect(positiveDegrees(-450)).toBe(270);
  });

  it('gives the nearest of the 16 compass points, translated', () => {
    expect(getCompassAbbreviation(0, 'en')).toBe('N');
    expect(getCompassAbbreviation(350, 'en')).toBe('N');
    expect(getCompassAbbreviation(45, 'en')).toBe('NE');
    expect(getCompassAbbreviation(200, 'en')).toBe('SSW');
    expect(getCompassAbbreviation(22.5, 'nl')).toBe('NNO');
  });

  it('parses degrees, numbers in a text and compass point names', () => {
    expect(parseDirection('90', 'en')).toEqual({ abbreviation: 'E', degrees: 90, unknown: false });
    expect(parseDirection('-90', 'en')).toEqual({ abbreviation: 'W', degrees: 270, unknown: false });
    expect(parseDirection('275.4 °', 'en')).toEqual({ abbreviation: 'W', degrees: 275, unknown: false });
    expect(parseDirection('nne', 'en')).toEqual({ abbreviation: 'NNE', degrees: 23, unknown: false });
  });

  it('marks values that are no direction as unknown', () => {
    expect(parseDirection('unavailable', 'en').unknown).toBe(true);
    expect(parseDirection('unknown', 'en').unknown).toBe(true);
    expect(parseDirection('calm', 'en')).toEqual({ abbreviation: 'N', degrees: 0, unknown: true });
  });

  it('reads the state or an attribute of a sensor with the configured decimals', () => {
    const entity = ENTITIES['sun.sun'];
    expect(getValue({ decimals: 1, entity, is_attribute: true, sensor: 'sun.sun.azimuth', units: '°' }, ENTITIES)).toEqual({ units: '°', value: '120.0' });
    expect(getValue({ decimals: 0, entity, is_attribute: false, sensor: 'sun.sun', units: '' }, ENTITIES).value).toBe('above_horizon');
    expect(getValue({ decimals: 2, entity: ENTITIES['input_number.wind_speed'], is_attribute: false, sensor: 'input_number.wind_speed', units: 'm/s' }, ENTITIES).value).toBe('11.00');
  });
});

describe('active style', () => {
  // wind speed is 11
  const indicatorWithBands = (bands: object[], sensor = 'input_number.wind_speed') =>
    getIndicatorSensors(cardConfig({ indicator_sensors: [{ indicator: { dynamic_style: { bands, sensor } }, sensor: 'input_number.wind_direction_1' }] } as never), COLORS, ENTITIES)[0].indicator;

  it('uses the band with the highest from_value at or below the sensor value', () => {
    const indicator = indicatorWithBands([
      { color: 'green', from_value: 0 },
      { color: 'orange', from_value: 10 },
      { color: 'red', from_value: 20 },
    ]);
    expect(getActiveBand(indicator, ENTITIES)?.color).toBe('orange');
    expect(activeColor(indicator, ENTITIES)).toBe('orange');
  });

  it('keeps the own style below the first band and for a non-numeric sensor', () => {
    const below = indicatorWithBands([{ color: 'red', from_value: 20 }]);
    expect(getActiveBand(below, ENTITIES)).toBeUndefined();
    expect(activeColor(below, ENTITIES)).toBe(below.color);
    const text = indicatorWithBands([{ color: 'red', from_value: 0 }], 'sun.sun');
    expect(getActiveBand(text, ENTITIES)).toBeUndefined();
  });

  it('respects 0 and false in the active band', () => {
    const indicator = indicatorWithBands([{ from_value: 10, opacity: 0, show: false, size: 0 }]);
    expect(activeSize(indicator, ENTITIES)).toBe(0);
    expect(activeOpacity(indicator, ENTITIES)).toBe(0);
    expect(isVisible(indicator, ENTITIES)).toBe(false);
  });
});
