import { actionData, actionFromData, actionSchema } from '../editor/actionForm';
import { describe, expect, it } from 'vitest';
import { imageData, imageFromData, imageType } from '../editor/imageForm';
import { opacityFromPercent, opacityToPercent, setOrDelete, updateObject, withoutEmpty } from '../editor/editorHelpers';
import { toHaAction } from '../utils/handleClick';

describe('setOrDelete / updateObject / withoutEmpty', () => {
  it('removes empty values and values equal to the default', () => {
    const obj: Record<string, unknown> = { a: 1, b: 'x' };
    setOrDelete(obj, 'a', undefined);
    setOrDelete(obj, 'b', '');
    setOrDelete(obj, 'c', true, true);
    setOrDelete(obj, 'd', false, true);
    setOrDelete(obj, 'e', 0);
    expect(obj).toEqual({ d: false, e: 0 });
  });

  it('returns undefined when nothing is left and keeps other keys', () => {
    expect(updateObject({ show: true }, { show: true }, { show: true })).toBeUndefined();
    expect(updateObject({ color: 'red', dynamic_style: { bands: [] } }, { color: '' })).toEqual({ dynamic_style: { bands: [] } });
    expect(withoutEmpty({})).toBeUndefined();
    expect(withoutEmpty({ a: 1 })).toEqual({ a: 1 });
  });
});

describe('opacity percentage', () => {
  it('converts between 0-1 and 0-100%', () => {
    expect(opacityToPercent(0.35)).toBe(35);
    expect(opacityToPercent(0.333)).toBe(33);
    expect(opacityToPercent(undefined)).toBeUndefined();
    expect(opacityFromPercent(37)).toBe(0.37);
    expect(opacityFromPercent(100)).toBe(1);
  });

  it('keeps the stored value while the slider shows its rounded percentage', () => {
    expect(opacityFromPercent(33, 0.333)).toBe(0.333);
    expect(opacityFromPercent(34, 0.333)).toBe(0.34);
  });
});

describe('imageForm', () => {
  it('detects the type of a stored image', () => {
    expect(imageType('circle')).toBe('circle');
    expect(imageType('mdi:home')).toBe('mdi');
    expect(imageType('/local/a.png')).toBe('url');
    expect(imageType(undefined)).toBe('arrow_outward');
    expect(imageType(undefined, 'mdi')).toBe('mdi');
  });

  it('converts between image and form values', () => {
    expect(imageData('mdi:home', 'mdi')).toEqual({ indicator: 'mdi', indicator_icon: 'mdi:home', indicator_url: '' });
    expect(imageFromData({ indicator: 'mdi', indicator_icon: 'mdi:home' })).toBe('mdi:home');
    expect(imageFromData({ indicator: 'url', indicator_url: '' })).toBeUndefined();
    expect(imageFromData({ indicator: 'circle' })).toBe('circle');
  });
});

describe('actionForm', () => {
  it('shows only the fields of the selected action', () => {
    const names = (data: object) => actionSchema(data).map((field) => field.name);
    expect(names({})).toEqual(['action']);
    expect(names({ action: 'more-info' })).toEqual(['action', 'entity', 'confirmation']);
    expect(names({ action: 'navigate' })).toEqual(['action', 'navigation_path', 'new_tab', 'navigation_replace', 'confirmation']);
    expect(names({ action: 'none' })).toEqual(['action']);
    expect(actionSchema({ action: 'more-info' }, 'helper text').find((field) => field.name === 'entity')?.helper).toBe('helper text');
  });

  it('shows the card defaults', () => {
    expect(actionData(undefined)).toEqual({});
    expect(actionData({ navigation_path: '/x' })).toMatchObject({ action: 'more-info', confirmation: false, new_tab: true });
    expect(actionData({ action: 'url', url_path: 'https://x' }).url).toBe('https://x');
  });

  it('writes a minimal tap action', () => {
    expect(actionFromData({ action: '' }, undefined)).toBeUndefined();
    expect(actionFromData({ action: 'more-info', confirmation: false, entity: '' }, undefined)).toEqual({ action: 'more-info' });
    expect(actionFromData({ action: 'navigate', confirmation: false, navigation_path: '/x', new_tab: true }, undefined)).toEqual({ action: 'navigate', navigation_path: '/x' });
    expect(actionFromData({ action: 'navigate', navigation_path: '/x', new_tab: false }, undefined)).toEqual({ action: 'navigate', navigation_path: '/x', new_tab: false });
  });

  it('drops fields of a previous action and keeps the key used for the url', () => {
    expect(actionFromData({ action: 'url', entity: 'sun.sun', navigation_path: '/x', url: 'https://x' }, undefined)).toEqual({ action: 'url', url: 'https://x' });
    expect(actionFromData({ action: 'url', url: 'https://y' }, { action: 'url', url_path: 'https://x' })).toEqual({ action: 'url', url_path: 'https://y' });
  });

  it('keeps a confirmation object and empty perform-action objects are left out', () => {
    const confirmation = { text: 'Sure?' };
    expect(actionFromData({ action: 'toggle', confirmation: true }, { action: 'toggle', confirmation } as never)?.confirmation).toBe(confirmation);
    expect(actionFromData({ action: 'perform-action', data: {}, perform_action: 'light.toggle', target: {} }, undefined)).toEqual({ action: 'perform-action', perform_action: 'light.toggle' });
  });
});

describe('toHaAction', () => {
  it('converts the card tap actions to Home Assistant actions', () => {
    expect(toHaAction({ action: 'more-info' })).toEqual({ action: 'more-info', entity: undefined });
    expect(toHaAction({})).toEqual({ action: 'more-info', entity: undefined });
    expect(toHaAction({ action: 'navigate', navigation_path: '/lovelace/1' })).toEqual({ action: 'url', url_path: '/lovelace/1' });
    expect(toHaAction({ action: 'navigate', navigation_path: '/lovelace/1', new_tab: false })).toEqual({ action: 'navigate', navigation_path: '/lovelace/1' });
    expect(toHaAction({ action: 'navigate' })).toBeUndefined();
    expect(toHaAction({ action: 'url', url: 'https://x' })).toEqual({ action: 'url', url_path: 'https://x' });
  });

  it('converts legacy call-service with service_data', () => {
    expect(toHaAction({ action: 'call-service', service: 'light.toggle', service_data: '{"entity_id":"light.x"}' })).toEqual({ action: 'perform-action', data: { entity_id: 'light.x' }, perform_action: 'light.toggle' });
    expect(toHaAction({ action: 'call-service' })).toBeUndefined();
  });
});
