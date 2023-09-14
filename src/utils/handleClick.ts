import { HomeAssistant } from 'custom-card-helpers';
import { CompassCard } from '../compass-card';
import { CCActionConfig, CompassCardConfig } from '../editorTypes';

export default (node: CompassCard, hass: HomeAssistant, config: CompassCardConfig, actionConfig: CCActionConfig): void => {
  let e;
  switch (actionConfig.action || 'more-info') {
    case 'more-info': {
      e = new Event('hass-more-info', { composed: true });
      e.detail = {
        entityId: actionConfig.entity || config?.['tap_action'],
      };
      node.dispatchEvent(e);
      break;
    }
    case 'navigate': {
      if (!actionConfig.navigation_path) return;
      if (actionConfig.new_tab || actionConfig.new_tab === undefined) {
        window.open(actionConfig.navigation_path, '_blank');
        break;
      }
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
      if (actionConfig.new_tab || actionConfig.new_tab === undefined) {
        window.open(actionConfig.url, '_blank');
        break;
      }
      window.location.href = actionConfig.url;
      break;
    }
    default:
      return;
  }
};
