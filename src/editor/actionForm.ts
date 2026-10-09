import { ActionConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { NO_ELEMENTS } from '../const';
import { setOrDelete } from './editorHelpers';

/*
 * ha-form schema for a tap_action, following the card's own action handling (utils/handleClick.ts):
 * - without an action the card does nothing on tap; an action without fields falls back to more-info
 * - navigate and url open a new tab unless new_tab is false
 * HA's ui_action selector is not used because its navigate/url semantics differ from the card's new_tab default.
 */

const NEW_TAB_DEFAULT = true;
const BOOLEAN_FIELDS: (keyof ActionConfig)[] = ['navigation_replace', 'start_listening'];
const LEGACY_ACTION = 'call-service';
const ACTIONS = ['more-info', 'navigate', 'url', 'perform-action', 'toggle', 'assist', 'none'];

// Fields that belong to each action; all other fields are removed when the action changes
const ACTION_FIELDS: Record<string, (keyof ActionConfig)[]> = {
  'assist': ['pipeline_id', 'start_listening'],
  'call-service': ['service', 'service_data'],
  'more-info': ['entity'],
  'navigate': ['navigation_path', 'new_tab', 'navigation_replace'],
  'none': [],
  'perform-action': ['perform_action', 'target', 'data'],
  'toggle': ['entity'],
  'url': ['url', 'url_path', 'new_tab'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormData = Record<string, any>;

function actionOptions(current: string | undefined) {
  const actions = current === LEGACY_ACTION ? [...ACTIONS, LEGACY_ACTION] : ACTIONS;
  return actions.map((action) => ({ label: localize(`editor.tap_action.actions.${action}`) || action, value: action }));
}

export function actionSchema(data: FormData) {
  const action = data.action as string | undefined;
  const fields: FormData[] = [{ name: 'action', selector: { select: { mode: 'dropdown', options: actionOptions(action) } } }];
  switch (action) {
    case 'more-info':
    case 'toggle':
      fields.push({ name: 'entity', selector: { entity: {} } });
      break;
    case 'navigate':
      fields.push({ name: 'navigation_path', selector: { navigation: {} } }, { name: 'new_tab', selector: { boolean: {} } }, { name: 'navigation_replace', selector: { boolean: {} } });
      break;
    case 'url':
      fields.push({ name: 'url', selector: { text: {} } }, { name: 'new_tab', selector: { boolean: {} } });
      break;
    case 'perform-action':
      fields.push({ name: 'perform_action', selector: { text: {} } }, { name: 'target', selector: { object: {} } }, { name: 'data', selector: { object: {} } });
      break;
    case LEGACY_ACTION:
      fields.push({ name: 'service', selector: { text: {} } }, { name: 'service_data', selector: { text: { multiline: true } } });
      break;
    case 'assist':
      fields.push({ name: 'pipeline_id', selector: { text: {} } }, { name: 'start_listening', selector: { boolean: {} } });
      break;
    default:
      break;
  }
  if (action && action !== 'none') {
    fields.push({ name: 'confirmation', selector: { boolean: {} } });
  }
  return fields;
}

// Values shown in the form; includes the defaults the card applies
export function actionData(config: ActionConfig | undefined): FormData {
  if (!config) return {};
  return {
    ...config,
    action: config.action || 'more-info',
    confirmation: config.confirmation === true,
    navigation_replace: config.navigation_replace === true,
    new_tab: config.new_tab ?? NEW_TAB_DEFAULT,
    start_listening: config.start_listening === true,
    url: config.url_path ?? config.url,
  };
}

// Converts the form values back into a minimal tap_action, or undefined when no action is selected
export function actionFromData(data: FormData | undefined, previous: ActionConfig | undefined): ActionConfig | undefined {
  if (!data?.action) return undefined;
  const fields = ACTION_FIELDS[data.action] || [];
  const result: ActionConfig = { action: data.action };
  fields.forEach((field) => {
    if (field === 'url_path') return;
    const value = field === 'url' ? data.url : data[field];
    const isEmptyObject = typeof value === 'object' && value !== null && Object.keys(value).length === NO_ELEMENTS;
    const defaultValue = field === 'new_tab' ? NEW_TAB_DEFAULT : BOOLEAN_FIELDS.includes(field) ? false : undefined;
    setOrDelete(result, field, (isEmptyObject ? undefined : value) as never, defaultValue as never);
  });
  // keep the key the config already used for the url
  if (data.action === 'url' && result.url && previous?.url_path !== undefined) {
    result.url_path = result.url;
    delete result.url;
  }
  // only a plain boolean confirmation is editable here; keep an existing confirmation object as is
  if (typeof previous?.confirmation === 'object' && previous.confirmation !== null) {
    result.confirmation = previous.confirmation;
  } else {
    setOrDelete(result, 'confirmation', data.action === 'none' ? undefined : data.confirmation, false as never);
  }
  return result;
}
