import { ActionConfig, CompassCardConfig } from '../editorTypes.js';
import { CompassCard } from '../compass-card.js';
import { fireEvent } from './ha-helpers.js';

/**
 * Translate the card's tap_action into a Home Assistant action config, so the
 * frontend's own action handling (confirmation, perform-action, toggle, ...) is used.
 * Legacy options (call-service + service_data, new_tab) are converted for backwards compatibility.
 */
export function toHaAction(actionConfig: ActionConfig): Record<string, unknown> | undefined {
  const { action = 'more-info', entity, navigation_path, new_tab, service, service_data, url, ...rest } = actionConfig;
  const newTab = new_tab === undefined || new_tab;
  switch (action) {
    case 'more-info':
      return { action, entity, ...rest };
    case 'navigate':
      if (!navigation_path) return undefined;
      return newTab ? { action: 'url', url_path: navigation_path, ...rest } : { action, navigation_path, ...rest };
    case 'url': {
      const urlPath = rest.url_path ?? url;
      if (!urlPath) return undefined;
      return { action, ...rest, url_path: urlPath };
    }
    case 'call-service':
    case 'perform-action': {
      const performAction = rest.perform_action ?? service;
      if (!performAction) return undefined;
      return { action: 'perform-action', data: service_data ? JSON.parse(service_data) : undefined, ...rest, perform_action: performAction };
    }
    default:
      return { action, ...rest };
  }
}

export default (node: CompassCard, config: CompassCardConfig, actionConfig: ActionConfig, entity?: string): void => {
  const tapAction = toHaAction(actionConfig);
  if (!tapAction) return;
  // the url action in Home Assistant always opens a new tab, keep same-tab behaviour for new_tab: false
  if (tapAction.action === 'url' && actionConfig.new_tab === false) {
    window.location.href = tapAction.url_path as string;
    return;
  }
  fireEvent(node, 'hass-action', {
    action: 'tap',
    config: { entity: entity ?? config.indicator_sensors[0]?.sensor, tap_action: tapAction },
  });
};
