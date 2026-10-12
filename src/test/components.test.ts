// @vitest-environment jsdom
import { beforeAll, describe, expect, it } from 'vitest';
import { cardConfig, ENTITIES } from './fixtures';
import type { CompassCard } from '../compass-card';
import { CompassCardConfig } from '../editor/editorTypes';

/*
 * The card and its editor rendered in jsdom. Home Assistant's own elements (ha-form, ha-expansion-panel, ...) do not
 * exist here, so the editor is driven the way those elements would drive it: by dispatching their events.
 */

const hass = { language: 'en', localize: (key: string) => key, states: ENTITIES };
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

let CompassCardClass: typeof CompassCard;

beforeAll(async () => {
  // the editor loads Home Assistant's card helpers when it gets a config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).loadCardHelpers = async () => ({ importMoreInfoControl: () => undefined });
  ({ CompassCard: CompassCardClass } = await import('../compass-card'));
});

describe('compass-card setConfig', () => {
  const setConfig = (config: object) => () => (document.createElement('compass-card') as CompassCard).setConfig(config as CompassCardConfig);

  it('accepts a valid config', () => {
    expect(setConfig(cardConfig())).not.toThrow();
  });

  it('explains an invalid indicator image and background image', () => {
    expect(setConfig(cardConfig({ indicator_sensors: [{ indicator: { image: 'bad' }, sensor: 'sun.sun' }] }))).toThrow(/indicator\.image should be either/);
    expect(setConfig(cardConfig({ compass: { circle: { background_image: 'bg.png' } } }))).toThrow(/background_image should be an image URL/);
  });

  it('requires a direction entity', () => {
    expect(setConfig({ indicator_sensors: [{ indicator: {}, sensor: '' }], type: 'custom:compass-card' })).toThrow();
  });
});

describe('compass-card getStubConfig', () => {
  it('prefers a wind direction sensor and falls back to the sun', () => {
    expect(CompassCardClass.getStubConfig(hass as never).indicator_sensors[0].sensor).toBe('sensor.wind_direction');
    const stub = CompassCardClass.getStubConfig({ ...hass, states: {} } as never);
    expect(stub.indicator_sensors[0]).toMatchObject({ attribute: 'azimuth', sensor: 'sun.sun' });
  });
});

describe('compass-card-editor', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createEditor(config: CompassCardConfig): Promise<{ editor: any; changes: CompassCardConfig[] }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editor = document.createElement('compass-card-editor') as any;
    const changes: CompassCardConfig[] = [];
    // like Home Assistant: every change is passed back with setConfig
    editor.addEventListener('config-changed', (ev: CustomEvent) => {
      changes.push(JSON.parse(JSON.stringify(ev.detail.config)));
      editor.setConfig(ev.detail.config);
    });
    editor.hass = hass;
    editor.setConfig(config);
    document.body.appendChild(editor);
    await tick();
    await editor.updateComplete;
    return { changes, editor };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shadow = (el: any, selector: string) => el.shadowRoot.querySelector(selector);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shadowAll = (el: any, selector: string) => [...el.shadowRoot.querySelectorAll(selector)];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function changeForm(form: any, values: object, owner: any) {
    form.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: { ...form.data, ...values } } }));
    await tick();
    await owner.updateComplete;
  }

  const fullConfig = cardConfig({
    compass: { circle: { background_image: '/local/bg.png', background_opacity: 0.333 }, north: { color: 'red', show: true } },
    header: { title: { value: 'Wind' } },
    indicator_sensors: [{ attribute: 'azimuth', indicator: { image: 'mdi:home', opacity: 0.333 }, sensor: 'sun.sun' }],
    language: 'nl',
    value_sensors: [{ sensor: 'input_number.wind_speed' }],
  });

  it('renders all groups and does not change the config when opened', async () => {
    const { changes, editor } = await createEditor(fullConfig);
    const tags = [...editor.shadowRoot.children].map((child: Element) => child.tagName.toLowerCase());
    expect(tags).toEqual(expect.arrayContaining(['compass-card-header-editor', 'compass-card-compass-editor', 'compass-card-sensor-row-editor', 'ha-form']));
    expect(changes).toEqual([]);
  });

  it('writes a compass item, leaving defaults out', async () => {
    const { changes, editor } = await createEditor(cardConfig());
    const compass = shadow(editor, 'compass-card-compass-editor');
    await compass.updateComplete;
    const [, east] = shadowAll(compass, 'compass-card-part-editor');
    await east.updateComplete;
    await changeForm(shadow(east, 'ha-form'), { color: 'blue', show: true }, east);
    expect(changes.at(-1)?.compass).toEqual({ east: { color: 'blue', show: true } });
    await changeForm(shadow(east, 'ha-form'), { color: '', show: false }, east);
    expect(changes.at(-1)?.compass).toBeUndefined();
  });

  it('adds a dynamic style band without sensor or empty keys', async () => {
    const { changes, editor } = await createEditor(cardConfig());
    const compass = shadow(editor, 'compass-card-compass-editor');
    await compass.updateComplete;
    const [north] = shadowAll(compass, 'compass-card-part-editor');
    await north.updateComplete;
    const dynamic = shadow(north, 'compass-card-dynamic-style-editor');
    await dynamic.updateComplete;
    shadow(dynamic, 'ha-button').click();
    await tick();
    expect(changes.at(-1)?.compass).toEqual({ north: { dynamic_style: { bands: [{ from_value: 0 }] } } });
  });

  it('shows a newly entered header title without writing show', async () => {
    const { changes, editor } = await createEditor(cardConfig());
    const header = shadow(editor, 'compass-card-header-editor');
    await header.updateComplete;
    const [title] = shadowAll(header, 'compass-card-part-editor');
    await title.updateComplete;
    await changeForm(shadow(title, 'ha-form'), { value: 'Wind' }, title);
    expect(changes.at(-1)?.header).toEqual({ title: { value: 'Wind' } });
  });

  it('updates the language and the unknown direction fallback', async () => {
    const { changes, editor } = await createEditor(cardConfig());
    const row = shadow(editor, 'compass-card-sensor-row-editor');
    await changeForm(row.querySelector('ha-form'), { language: 'de', unknown_direction: 'last' }, editor);
    expect(changes.at(-1)).toMatchObject({ language: 'de', unknown_direction: 'last' });
    await changeForm(row.querySelector('ha-form'), { language: undefined, unknown_direction: 'north' }, editor);
    expect(changes.at(-1)).not.toHaveProperty('language');
    expect(changes.at(-1)).not.toHaveProperty('unknown_direction');
  });

  it('writes the card tap action and debug', async () => {
    const { changes, editor } = await createEditor(cardConfig());
    // the card options form is the last direct child of the editor
    const cardForm = [...editor.shadowRoot.children].filter((child: Element) => child.tagName === 'HA-FORM').pop();
    await changeForm(cardForm, { card_conf: { debug: true, tap_action: { action: 'navigate', navigation_path: '/x', new_tab: true } } }, editor);
    expect(changes.at(-1)).toMatchObject({ debug: true, tap_action: { action: 'navigate', navigation_path: '/x' } });
    expect(changes.at(-1)?.tap_action).not.toHaveProperty('new_tab');
  });

  it('edits an indicator in the detail editor without rewriting unchanged values', async () => {
    const { changes, editor } = await createEditor(fullConfig);
    const row = shadow(editor, 'compass-card-sensor-row-editor');
    await row.updateComplete;
    shadow(row, '.edit-icon').click();
    await tick();
    await editor.updateComplete;
    const detail = shadow(editor, 'compass-card-indicator-editor');
    await detail.updateComplete;
    const indicatorPart = shadow(detail, 'compass-card-part-editor');
    await indicatorPart.updateComplete;
    const form = shadow(indicatorPart, 'ha-form');
    expect(form.data).toMatchObject({ indicator: 'mdi', indicator_icon: 'mdi:home', opacity: 33 });
    // change only the size: the opacity of 0.333 must stay as it is
    await changeForm(form, { size: 25 }, indicatorPart);
    expect(changes.at(-1)?.indicator_sensors[0].indicator).toEqual({ image: 'mdi:home', opacity: 0.333, size: 25 });
    await changeForm(shadow(indicatorPart, 'ha-form'), { opacity: 100 }, indicatorPart);
    expect(changes.at(-1)?.indicator_sensors[0].indicator).toEqual({ image: 'mdi:home', size: 25 });
  });

  it('limits the number of indicators and keeps the first one', async () => {
    const many = Array.from({ length: 10 }, () => ({ indicator: {}, sensor: 'sun.sun' }));
    const { editor } = await createEditor(cardConfig({ indicator_sensors: many }));
    const row = shadow(editor, 'compass-card-sensor-row-editor');
    await row.updateComplete;
    expect(shadow(row, '.add-entity')).toBeNull();
    expect(shadow(row, '.secondary').textContent).toContain('10');
    expect(shadowAll(row, '.remove-icon')[0].disabled).toBe(true);
    expect(shadowAll(row, '.remove-icon')[1].disabled).toBe(false);
  });
});
