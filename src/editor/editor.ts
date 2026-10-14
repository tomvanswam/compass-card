import { actionData, actionFromData, actionHelper, actionSchema } from './actionForm';
import { CCCompassConfig, CCHeaderConfig, CCIndicatorSensorConfig, CCValueSensorConfig, CompassCardConfig } from './editorTypes';
import { COMPASS_LANGUAGES, localize, setHassLanguage } from '../localize/localize.js';
import { CompassCardEvent, fireEvent, SubElementConfig } from '../utils/events';
import { css, CSSResult, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEFAULT_UNKNOWN_DIRECTION, MAX_INDICATOR_ARRAY_SIZE, MIN_INDICATOR_ARRAY_SIZE, UNKNOWN_DIRECTION_VALUES } from '../const';
import { HaFormSchemaItem, HaFormValueChanged } from './haTypes';
import { HomeAssistant, LovelaceCardEditor } from '../utils/ha-helpers';
import { setOrDelete, withoutEmpty } from './editorHelpers';

// eslint-disable-next-line sort-imports
import './compass-card-compass-editor';
import './compass-card-dynamic-style-editor';
import './compass-card-header-editor';
import './compass-card-indicator-editor';
import './compass-card-part-editor';
import './compass-card-value-editor';
import './compass-card-sensor-row-editor';

// The part of Home Assistant's card helpers (window.loadCardHelpers) the editor uses
interface CardHelpers {
  // eslint-disable-next-line no-unused-vars
  createCardElement?: (config: object) => Promise<HTMLElement>;
}

// Elements of Home Assistant the editor uses directly; the selectors inside ha-form are loaded by ha-form itself
const HA_ELEMENTS = ['ha-form', 'ha-entity-picker', 'ha-expansion-panel', 'ha-sortable'];

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _elementsLoaded = false;
  @state() private _config?: CompassCardConfig;
  @state() private _subElementEditorConfig?: SubElementConfig;

  public setConfig(config: CompassCardConfig): void {
    this._config = config;
    if (!this._elementsLoaded) {
      this._loadHaElements();
    }
  }

  // Labels follow the language of the Home Assistant user
  protected willUpdate(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass) {
      setHassLanguage(this.hass.locale?.language ?? this.hass.language);
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._elementsLoaded || !this._config) {
      return html``;
    }

    if (this._subElementEditorConfig) {
      if (this._subElementEditorConfig.type === 'indicator') {
        return html`
          <compass-card-indicator-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
            .index=${this._subElementEditorConfig.index}
            @go-back=${this._goBack}
            @config-changed=${this._handleSubElementChanged}
          ></compass-card-indicator-editor>
        `;
      }
      if (this._subElementEditorConfig.type === 'value') {
        return html`
          <compass-card-value-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
            @go-back=${this._goBack}
            @config-changed=${this._handleSubElementChanged}
          ></compass-card-value-editor>
        `;
      }
    }

    return html`
      <compass-card-header-editor
        .hass=${this.hass}
        .config=${this._config.header}
        @config-changed=${this._handleHeaderConfigChanged}
      ></compass-card-header-editor>
      <compass-card-compass-editor
        .hass=${this.hass}
        .config=${this._config.compass}
        @config-changed=${this._handleCompassConfigChanged}
      ></compass-card-compass-editor>
      <compass-card-sensor-row-editor
        .hass=${this.hass}
        .entities=${this._config.indicator_sensors}
        .label=${localize('editor.indicator_sensors')}
        type="indicator"
        .fixedRows=${MIN_INDICATOR_ARRAY_SIZE}
        .maxRows=${MAX_INDICATOR_ARRAY_SIZE}
        .limitMessage=${localize('editor.indicator_limit', '{max}', String(MAX_INDICATOR_ARRAY_SIZE))}
        .newRow=${CompassCardEditor._newIndicator}
        @entities-changed=${this._handleIndicatorEntitiesChanged}
        @edit-detail-element=${this._editDetailElement}
      >
        <ha-form
          .hass=${this.hass}
          .data=${{ language: this._config.language, unknown_direction: this._config.unknown_direction || DEFAULT_UNKNOWN_DIRECTION }}
          .schema=${CompassCardEditor._indicatorOptionsSchema()}
          .computeLabel=${(schema: { name: string }) => localize(`editor.sensor_config.${schema.name}`)}
          @value-changed=${this._indicatorOptionsChanged}
        ></ha-form>
      </compass-card-sensor-row-editor>
      <compass-card-sensor-row-editor
        .hass=${this.hass}
        .entities=${this._config.value_sensors}
        .label=${localize('editor.value_sensors')}
        type="value"
        @entities-changed=${this._handleValueEntitiesChanged}
        @edit-detail-element=${this._editDetailElement}
      ></compass-card-sensor-row-editor>
      <ha-form
        .hass=${this.hass}
        .data=${this._computeCardData()}
        .schema=${this._computeCardSchema()}
        .computeLabel=${CompassCardEditor._computeCardLabel}
        .computeHelper=${actionHelper}
        @value-changed=${this._handleCardConfigChanged}
      ></ha-form>
    `;
  }

  // Card level options: tap action and debug logging
  private _computeCardData() {
    return {
      card_conf: {
        debug: this._config?.debug === true,
        tap_action: actionData(this._config?.tap_action),
      },
    };
  }

  private _computeCardSchema() {
    return [
      {
        name: 'card_conf',
        schema: [
          { name: 'tap_action', schema: actionSchema(actionData(this._config?.tap_action), localize('editor.tap_action.entity_helper_card')), title: localize('editor.tap_action.title'), type: 'expandable' },
          { name: 'debug', selector: { boolean: {} } },
        ],
        title: localize('editor.card_conf'),
        type: 'expandable',
      },
    ];
  }

  private static _computeCardLabel(schema: HaFormSchemaItem): string {
    return localize(`editor.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _handleCardConfigChanged(ev: HaFormValueChanged): void {
    const cardData = ev.detail.value.card_conf;
    if (!cardData) {
      return;
    }
    this._updateConfig(ev, (config) => {
      setOrDelete(config, 'tap_action', actionFromData(cardData.tap_action, config.tap_action));
      setOrDelete(config, 'debug', cardData.debug, false);
    });
  }

  private _editDetailElement(ev: CompassCardEvent<'edit-detail-element'>): void {
    this._subElementEditorConfig = ev.detail.subElementConfig;
  }

  private _goBack(): void {
    this._subElementEditorConfig = undefined;
  }

  private _handleSubElementChanged(ev: CompassCardEvent<'config-changed'>): void {
    if (!this._subElementEditorConfig) {
      return;
    }
    const { index, type } = this._subElementEditorConfig;
    const value = ev.detail.config as SubElementConfig['elementConfig'];
    // replace the edited sensor in a copy of its list
    const replaced = <T,>(sensors: T[] | undefined): T[] => Object.assign([...(sensors || [])], { [index]: value });
    this._updateConfig(ev, (config) => {
      if (type === 'indicator') {
        config.indicator_sensors = replaced(config.indicator_sensors);
      } else {
        config.value_sensors = replaced(config.value_sensors);
      }
    });
    this._subElementEditorConfig = { ...this._subElementEditorConfig, elementConfig: value };
  }

  // the rows keep every option of a sensor; only the entity and the order change
  private _handleIndicatorEntitiesChanged(ev: CompassCardEvent<'entities-changed'>): void {
    this._setConfigKey(ev, 'indicator_sensors', ev.detail.entities as CCIndicatorSensorConfig[]);
  }

  private _handleValueEntitiesChanged(ev: CompassCardEvent<'entities-changed'>): void {
    this._setConfigKey(ev, 'value_sensors', ev.detail.entities as CCValueSensorConfig[]);
  }

  // Options shown above the indicator list: abbreviation language and the fallback for an unknown direction
  private static _indicatorOptionsSchema() {
    return [
      { name: 'language', selector: { select: { mode: 'dropdown', options: COMPASS_LANGUAGES.filter((lang) => lang !== '').map((lang) => ({ label: lang, value: lang })) } } },
      {
        name: 'unknown_direction',
        selector: { select: { mode: 'dropdown', options: UNKNOWN_DIRECTION_VALUES.map((value) => ({ label: localize(`editor.sensor_config.unknown_direction_types.${value}`), value })) } },
      },
    ];
  }

  private static _newIndicator(sensor: string): CCIndicatorSensorConfig {
    return { indicator: { image: DEFAULT_ICON_VALUE }, sensor };
  }

  private _indicatorOptionsChanged(ev: HaFormValueChanged): void {
    const { language, unknown_direction: unknownDirection } = ev.detail.value;
    this._updateConfig(ev, (config) => {
      setOrDelete(config, 'language', language);
      // The default fallback is left out of the YAML
      setOrDelete(config, 'unknown_direction', unknownDirection, DEFAULT_UNKNOWN_DIRECTION);
    });
  }

  private _handleHeaderConfigChanged(ev: CompassCardEvent<'config-changed'>): void {
    this._setConfigKey(ev, 'header', withoutEmpty(ev.detail.config as CCHeaderConfig));
  }

  private _handleCompassConfigChanged(ev: CompassCardEvent<'config-changed'>): void {
    this._setConfigKey(ev, 'compass', withoutEmpty(ev.detail.config as CCCompassConfig));
  }

  // Applies a change to a copy of the card config and fires config-changed
  // eslint-disable-next-line no-unused-vars
  private _updateConfig(ev: Event, update: (config: CompassCardConfig) => void): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const newConfig: CompassCardConfig = { ...this._config };
    update(newConfig);
    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: this._config });
  }

  // Sets one key of the card config; an empty value or one equal to defaultValue removes it (setOrDelete)
  private _setConfigKey<K extends keyof CompassCardConfig>(ev: Event, key: K, value: CompassCardConfig[K] | undefined, defaultValue?: CompassCardConfig[K]): void {
    this._updateConfig(ev, (config) => setOrDelete(config, key, value, defaultValue));
  }

  // Home Assistant loads its editor elements lazily. When they are not there yet, opening the editor of a built-in
  // card (entities) loads them, the documented way for custom card editors.
  private async _loadHaElements(): Promise<void> {
    if (HA_ELEMENTS.some((element) => !customElements.get(element))) {
      const helpers = (await window.loadCardHelpers?.()) as CardHelpers | undefined;
      const card = await helpers?.createCardElement?.({ entities: [], type: 'entities' });
      await (card?.constructor as { getConfigElement?: () => Promise<unknown> } | undefined)?.getConfigElement?.();
    }
    this._elementsLoaded = true;
  }

  static get styles(): CSSResult {
    return css`
      /* small space between the Header, Compass, Indicators and Values groups */
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
      }
      ha-form {
        width: 100%;
      }
      ha-expansion-panel {
        margin-top: 24px;
      }
    `;
  }
}
