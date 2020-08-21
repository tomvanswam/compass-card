import { CONFIG_ENTITY } from '../const';
import { HomeAssistant } from 'custom-card-helpers';
import { CompassCard } from '../compass-card';
import { ActionConfig, CompassCardConfig } from '../types';

export default (node: CompassCard, hass: HomeAssistant, config: CompassCardConfig, actionConfig: ActionConfig): void => {
  let e;
  switch (actionConfig.action || 'more-info') {
    case 'more-info': {
      e = new Event('hass-more-info', { composed: true });
      e.detail = {
        entityId: actionConfig.entity || config?.[CONFIG_ENTITY],
      };
      node.dispatchEvent(e);
      break;
    }
    case 'navigate': {
      if (!actionConfig.navigation_path) return;
      window.history.pushState(null, '', actionConfig.navigation_path);
      e = new Event('location-changed', { composed: true });
      e.detail = { replace: false };
      window.dispatchEvent(e);
      break;
    }
    case 'call-service': {
      if (!actionConfig.service) return;
      const [domain, service] = actionConfig.service.split('.', 2);
      const serviceData = actionConfig.service_data ? { ...JSON.parse(actionConfig.service_data) } : '';
      hass.callService(domain, service, serviceData);
      break;
    }
    case 'url': {
      if (!actionConfig.url) return;
      window.location.href = actionConfig.url;
      break;
    }
    default:
      return;
  }
};