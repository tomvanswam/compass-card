/* eslint-disable no-console */

// Debug output of the card, only when the configuration has `debug: true`

export function debugLog(enabled: boolean, message: string, ...data: unknown[]): void {
  if (enabled) console.info(`Compass-Card ${message}`, ...data);
}

export function debugWarn(enabled: boolean, message: string, ...data: unknown[]): void {
  if (enabled) console.warn(`Compass-Card ${message}`, ...data);
}
