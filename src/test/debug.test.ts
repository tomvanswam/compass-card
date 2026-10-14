import { afterEach, describe, expect, it, vi } from 'vitest';
import { debugLog, debugWarn } from '../utils/debug';

describe('debugLog / debugWarn', () => {
  afterEach(() => vi.restoreAllMocks());

  it('only logs when debug is enabled', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    debugLog(false, 'hidden');
    debugWarn(false, 'hidden');
    expect(info).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    debugLog(true, 'shown', { a: 1 });
    debugWarn(true, 'warned');
    expect(info).toHaveBeenCalledWith('Compass-Card shown', { a: 1 });
    expect(warn).toHaveBeenCalledWith('Compass-Card warned');
  });
});
