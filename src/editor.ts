import { LitElement, html, customElement, property, TemplateResult, CSSResult, css, internalProperty } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { CompassCardConfigV0, isV0Config, configV0ToV1 } from './updateV0ToV1';
import { CCCompassConfig, CCHeaderConfig, CCIndicatorConfig, CCNorthConfig, CCHeaderItemConfig, CompassCardConfig } from './editorTypes';

import { INDICATORS, DEFAULT_INDICATOR } from './const';

import { localize, COMPASS_LANGUAGES } from './localize/localize';
import { isNumeric } from './utils/objectHelpers';

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @internalProperty() private _config?: CompassCardConfig;

  public setConfig(config: CompassCardConfig | CompassCardConfigV0): void {
    if (isV0Config(config)) {
      this._config = configV0ToV1(config);
      fireEvent(this, 'config-changed', { config: this._config });
    } else {
      this._config = config;
    }
  }

  get _name(): string {
    return this._config?.header?.title?.value || '';
  }

  get _entity(): string {
    if (this._config?.indicator_sensors && this._config?.indicator_sensors.length > 0) {
      return this._config?.indicator_sensors[0].sensor;
    }
    return '';
  }

  get _secondary_entity(): string {
    if (this._config?.value_sensors && this._config?.value_sensors.length > 0) {
      return this._config?.value_sensors[0].sensor;
    }
    return '';
  }

  get _direction_offset(): number {
    return this._config?.compass?.north?.offset || 0;
  }

  get _compass_indicator(): string {
    if (this._config?.indicator_sensors && this._config?.indicator_sensors.length > 0) {
      return this._config?.indicator_sensors[0].indicator?.type || INDICATORS[DEFAULT_INDICATOR];
    }
    return INDICATORS[DEFAULT_INDICATOR];
  }

  get _compass_show_north(): boolean {
    return this._config?.compass?.north?.show || false;
  }

  get _compass_language(): string {
    return this._config?.language || '';
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    const entityDomains = ['sensor', 'sun', 'input_number', 'input_text'];
    const entities = Object.keys(this.hass.states)
      .filter((eid) => entityDomains.includes(eid.substr(0, eid.indexOf('.'))))
      .sort();
    const optionalEntities = ['', ...entities];

    return html`
      <div class="card-config">
        ${this.getEditorInput('editor.name', 'editor.optional', 'header.title.value', this._name)}
        ${this.getEditorDropDown('editor.primary entity description', 'editor.required', 'indicator_sensors[0].sensor', this._entity, entities)}
        ${this.getEditorDropDown('editor.secondary entity description', 'editor.optional', 'value_sensors[0].sensor', this._secondary_entity, optionalEntities)}
        ${this.getEditorDropDown('editor.indicator', 'editor.optional', 'indicator_sensors[0].indicator.type', this._compass_indicator, INDICATORS)}
        ${this.getEditorDropDown('editor.language description', 'editor.optional', 'language', this._compass_language, COMPASS_LANGUAGES)}
        ${this.getEditorInput('editor.offset description', 'editor.optional', 'compass.north.offset', this._direction_offset)}
        ${this.getEditorSwitch('editor.show north description', 'compass.north.show', this._compass_show_north)}
      </div>
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.checked !== undefined) {
      if (this[`_${target.configValue}`] === target.checked) {
        return;
      }
    } else if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      switch (target.configValue) {
        case 'language':
          this._config = { ...this._config, language: target.value };
          if (target.value.trim() === '') {
            delete this._config.language;
          }
          break;
        case 'compass.north.show':
          const northShow: CCNorthConfig = { ...this._config.compass?.north, show: target.checked };
          const compassNorthShow: CCCompassConfig = { ...this._config.compass, north: northShow };
          this._config = { ...this._config, compass: compassNorthShow };
          if (!target.checked) {
            delete this._config.compass?.north?.show;
            if (this._config.compass?.north && Object.keys(this._config.compass?.north).length === 0) {
              delete this._config.compass?.north;
            }
            if (this._config.compass && Object.keys(this._config.compass).length === 0) {
              delete this._config.compass;
            }
          }
          break;
        case 'header.title.value':
          const titleValue: CCHeaderItemConfig = { ...this._config.header?.title, value: target.value };
          const headerTitleValue: CCHeaderConfig = { ...this._config.header, title: titleValue };
          this._config = { ...this._config, header: headerTitleValue };
          if (target.value.trim() === '') {
            delete this._config.header?.title?.value;
            if (this._config.header?.title && Object.keys(this._config.header?.title).length === 0) {
              delete this._config.header?.title;
            }
            if (this._config.header && Object.keys(this._config.header).length === 0) {
              delete this._config.header;
            }
          }
          break;
        case 'compass.north.offset':
          const northOffset: CCNorthConfig = { ...this._config.compass?.north, offset: Number(target.value) };
          const compassNorthOffset: CCCompassConfig = { ...this._config.compass, north: northOffset };
          this._config = { ...this._config, compass: compassNorthOffset };
          if (isNumeric(target.value) && Number(target.value) === 0) {
            delete this._config.compass?.north?.offset;
            if (this._config.compass?.north && Object.keys(this._config.compass?.north).length === 0) {
              delete this._config.compass?.north;
            }
            if (this._config.compass && Object.keys(this._config.compass).length === 0) {
              delete this._config.compass;
            }
          }
          break;
        case 'indicator_sensors[0].sensor':
          const sensorsIndicatorSensor = [...this._config.indicator_sensors];
          sensorsIndicatorSensor[0] = { ...this._config.indicator_sensors[0], sensor: target.value };
          this._config = { ...this._config, indicator_sensors: sensorsIndicatorSensor };
          break;
        case 'value_sensors[0].sensor':
          const valuesSensorsSensor = this._config.value_sensors ? [...this._config.value_sensors] : [];
          valuesSensorsSensor[0] = { ...valuesSensorsSensor[0], sensor: target.value };
          this._config = { ...this._config, value_sensors: valuesSensorsSensor };
          break;
        case 'indicator_sensors[0].indicator.type':
          const indicatorType: CCIndicatorConfig = { ...this._config.indicator_sensors[0]?.indicator, type: target.value };
          const sensorsIndicatorType = [...this._config.indicator_sensors];
          sensorsIndicatorType[0] = { ...this._config.indicator_sensors[0], indicator: indicatorType };
          this._config = { ...this._config, indicator_sensors: sensorsIndicatorType };
          if (
            this._config.indicator_sensors[0]?.indicator?.type &&
            INDICATORS.indexOf(this._config.indicator_sensors[0]?.indicator?.type) === DEFAULT_INDICATOR &&
            Object.keys(this._config.indicator_sensors[0]?.indicator).length === 1
          ) {
            delete this._config.indicator_sensors[0].indicator;
          }
          break;
        default:
          console.warn('Value changed of unknown config node: ' + target.configValue);
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private getEditorDropDown(label: string, required: string, key: string, value: string, list): TemplateResult {
    return html` <paper-dropdown-menu class="editor-entity-select" label="${localize(label)} (${localize(required)})" @value-changed=${this._valueChanged} .configValue=${key}>
      <paper-listbox slot="dropdown-content" .selected=${list.indexOf(value)}>
        ${list.map((listItem) => {
          return html` <paper-item>${listItem}</paper-item> `;
        })}
      </paper-listbox>
    </paper-dropdown-menu>`;
  }

  private getEditorInput(label: string, required: string, key: string, value: string | number): TemplateResult {
    return html`<paper-input label="${localize(label)} (${localize(required)})" .value=${value} .configValue=${key} @value-changed=${this._valueChanged}></paper-input>`;
  }

  private getEditorSwitch(label: string, key: string, value: boolean): TemplateResult {
    return html`
      <div class="floated-label-placeholder">
          ${localize(label)}
        </div>
        <ha-switch
          aria-label=${`${localize('editor.toggle')} ${localize('directions.north')} ${value ? localize('common.off') : localize('common.on')}`}
          .checked=${value !== false}
          .configValue=${key}
          @change=${this._valueChanged}
          >${localize(label)}</ha-switch>
      </div>`;
  }

  static get styles(): CSSResult {
    return css`
      .editor-entity-select {
        width: 100%;
      }

      ha-switch {
        padding-bottom: 8px;
      }
      .floated-label-placeholder {
        font-family: var(--paper-font-caption_-_font-family);
        -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
        white-space: var(--paper-font-caption_-_white-space);
        overflow: var(--paper-font-caption_-_overflow);
        text-overflow: var(--paper-font-caption_-_text-overflow);
        font-size: var(--paper-font-caption_-_font-size);
        font-weight: var(--paper-font-caption_-_font-weight);
        letter-spacing: var(--paper-font-caption_-_letter-spacing);
        line-height: var(--paper-font-caption_-_line-height);
        color: var(--secondary-text-color);
      }
    `;
  }
}
