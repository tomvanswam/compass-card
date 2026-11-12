import { expect, test } from 'vitest';
import { resolveLanguage } from '../localize/localize';
import { toHaAction } from '../utils/handleClick';
test('multi-subtag languages and invalid service_data', () => {
  expect(resolveLanguage('zh-Hant-TW')).toBe('tw');
  expect(resolveLanguage('pt-BR')).toBeTruthy();
  expect(resolveLanguage('nl')).toBe('nl');
  expect(toHaAction({ action: 'call-service', service: 'a.b', service_data: '{x' } as never)).toMatchObject({ perform_action: 'a.b' });
});
