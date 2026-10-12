import { describe, expect, it } from 'vitest';
import { languages, localize } from '../localize/localize';

// Key paths of a nested translation object, in order
function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => (value && typeof value === 'object' ? keyPaths(value as Record<string, unknown>, `${prefix}${key}.`) : [`${prefix}${key}`]));
}

// the json modules come as namespace objects; the translations are their default export
const table = (lang: string): Record<string, unknown> => languages[lang].default ?? languages[lang];

describe('localize', () => {
  it('translates and falls back to English for empty or missing translations', () => {
    expect(localize('directions.north', '', '', 'nl')).toBe('Noorden');
    expect(localize('editor.dynamic_style.bands', '', '', 'bg')).toBe(localize('editor.dynamic_style.bands', '', '', 'en'));
    expect(localize('editor.dynamic_style.bands', '', '', 'xx')).toBe(localize('editor.dynamic_style.bands', '', '', 'en'));
    expect(localize('editor.does.not.exist', '', '', 'nl')).toBe('');
  });

  it('replaces a placeholder', () => {
    expect(localize('editor.indicator_limit', '{max}', '10', 'en')).toContain('10');
  });
});

describe('language files', () => {
  const english = keyPaths(table('en'));

  it.each(Object.keys(languages).filter((lang) => lang !== 'en'))('%s has the same keys in the same order as en.json', (lang) => {
    expect(keyPaths(table(lang))).toEqual(english);
  });

  it('has an English text for every key', () => {
    const empty = english.filter((path) => !localize(path, '', '', 'en'));
    expect(empty).toEqual([]);
  });
});
