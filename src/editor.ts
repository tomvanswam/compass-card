import { LitElement, html, TemplateResult, CSSResult, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { CompassCardConfig } from './editorTypes';

import { ICON_VALUES, DEFAULT_ICON_VALUE } from './const';

import { localize, COMPASS_LANGUAGES } from './localize/localize';
import { EditorTarget } from './utils/ha-types';

import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { formfieldDefinition } from '../elements/formfield';
import { selectDefinition } from '../elements/select';
import { switchDefinition } from '../elements/switch';
import { textfieldDefinition } from '../elements/textfield';

@customElement('compass-card-editor')
export class CompassCardEditor extends ScopedRegistryHost(LitElement) implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _helpers?;
  @state() private _config?: CompassCardConfig;
  private _initialized = false;

  static elementDefinitions = {
    ...textfieldDefinition,
    ...selectDefinition,
    ...switchDefinition,
    ...formfieldDefinition,
  };

  public setConfig(config: CompassCardConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
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
      return this._config?.indicator_sensors[0].indicator?.image || DEFAULT_ICON_VALUE;
    }
    return DEFAULT_ICON_VALUE;
  }

  get _compass_show_north(): boolean {
    return this._config?.compass?.north?.show || false;
  }

  get _compass_language(): string {
    return this._config?.language || '';
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    // The climate more-info has ha-switch and paper-dropdown-menu elements that are lazy loaded unless explicitly done here
    this._helpers.importMoreInfoControl('climate');

    const entityDomains = ['sensor', 'sun', 'input_number', 'input_text'];
    const entities = Object.keys(this.hass.states)
      .filter((eid) => entityDomains.includes(eid.substr(0, eid.indexOf('.'))))
      .sort();
    const optionalEntities = ['', ...entities];

    return html`
      ${this.getEditorInput('editor.name', 'editor.optional', 'header.title.value', this._name)}
      ${this.getEditorDropDown('editor.primary entity description', 'editor.required', 'indicator_sensors[0].sensor', this._entity, entities)}
      ${this.getEditorDropDown('editor.secondary entity description', 'editor.optional', 'value_sensors[0].sensor', this._secondary_entity, optionalEntities)}
      ${this.getEditorDropDown('editor.indicator', 'editor.optional', 'indicator_sensors[0].indicator.icon_value', this._compass_indicator, ICON_VALUES)}
      ${this.getEditorDropDown('editor.language description', 'editor.optional', 'language', this._compass_language, COMPASS_LANGUAGES)}
      ${this.getEditorInput('editor.offset description', 'editor.optional', 'compass.north.offset', this._direction_offset)}
      ${this.getEditorSwitch('directions.north', 'compass.north.show', this._compass_show_north)}
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target: EditorTarget = ev.target;
    if (target.checked !== undefined) {
      if (this[`_${target.configValue}`] === target.checked) {
        return;
      }
    } else if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private getEditorDropDown(label: string, required: string, key: string, value: string, list): TemplateResult {
    return html`<mwc-select
      naturalMenuWidth
      fixedMenuPosition
      label="${localize(label)} (${localize(required)})"
      .configValue=${key}
      .value=${value}
      @selected=${this._valueChanged}
      @closed=${(ev) => ev.stopPropagation()}
    >
      ${list.map((entity) => {
        return html`<mwc-list-item .value=${entity}>${entity}</mwc-list-item>`;
      })}
    </mwc-select>`;
  }

  private getEditorInput(label: string, required: string, key: string, value: string | number): TemplateResult {
    return html`<mwc-textfield label="${localize(label)} (${localize(required)})" .value=${value} .configValue=${key} @input=${this._valueChanged}></mwc-textfield>`;
  }

  private getEditorSwitch(label: string, key: string, value: boolean): TemplateResult {
    return html`
        <mwc-formfield
          .label=${`${localize('editor.toggle')} ${localize(label)}  ${localize('editor.indicator')} ${value ? localize('common.off') : localize('common.on')}`}>
          <mwc-switch
            .checked=${value !== false}
            .configValue=${key}
            @change=${this._valueChanged}
            ></mwc-switch>
        </mwc-formfield>
      </div>`;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await window.loadCardHelpers();
  }

  static get styles(): CSSResult {
    return css`
      .editor-entity-select {
        width: 100%;
      }
      mwc-select,
      mwc-textfield {
        margin-bottom: 16px;
        display: block;
      }
      mwc-formfield {
        padding-bottom: 8px;
      }
      mwc-switch {
        --mdc-theme-secondary: var(--switch-checked-color);
      }
    `;
  }
}
