import { CCDynamicStyleConfig, CCIndicatorSensorConfig, CCValueSensorConfig } from '../editor/editorTypes.js';
import { HaFormData } from '../editor/haTypes.js';

// The events the card and its editors fire, with the detail each one carries

// A sensor row in the indicator / value lists
export interface SensorRow {
  sensor: string;
}

// The sensor opened in a detail editor
export interface SubElementConfig {
  elementConfig: CCIndicatorSensorConfig | CCValueSensorConfig;
  index: number;
  type: 'indicator' | 'value';
}

export interface CompassCardEventMap {
  // a changed (part of the) configuration; the receiver knows which part it edits
  'config-changed': { config: object };
  'dynamic-style-changed': { value: CCDynamicStyleConfig | undefined };
  'edit-detail-element': { subElementConfig: SubElementConfig };
  'entities-changed': { entities: SensorRow[] };
  'go-back': Record<string, never>;
  // handled by Home Assistant: runs the tap action
  'hass-action': { action: string; config: object };
  'part-changed': { value: HaFormData };
}

export type CompassCardEvent<K extends keyof CompassCardEventMap> = CustomEvent<CompassCardEventMap[K]>;

interface FireEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

// Fires a bubbling, composed event (like Home Assistant's own fireEvent)
export function fireEvent<K extends keyof CompassCardEventMap>(node: EventTarget, type: K, detail: CompassCardEventMap[K], options: FireEventOptions = {}): Event {
  const event = new CustomEvent(type, { bubbles: options.bubbles ?? true, cancelable: Boolean(options.cancelable), composed: options.composed ?? true, detail });
  node.dispatchEvent(event);
  return event;
}
