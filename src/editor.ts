import { CCCompassConfig, CCHeaderConfig, CCHeaderItemConfig, CCIndicatorConfig, CCNorthConfig, CompassCardConfig } from './editorTypes';
import { COMPASS_LANGUAGES, localize } from './localize/localize.js';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEGREES_MIN, ICON_VALUES, INDEX_ELEMENT_0, NO_ELEMENTS } from './const';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { formfieldDefinition } from '../elements/formfield';
import { isNumeric } from './utils/objectHelpers';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
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

  get name(): string {
    return this._config?.header?.title?.value || '';
  }

  get entity(): string {
    if (this._config?.indicator_sensors && this._config?.indicator_sensors.length > NO_ELEMENTS) {
      return this._config?.indicator_sensors[0].sensor;
    }
    return '';
  }

  get secondaryEntity(): string {
    if (this._config?.value_sensors && this._config?.value_sensors.length > NO_ELEMENTS) {
      return this._config?.value_sensors[0].sensor;
    }
    return '';
  }

  get directionOffset(): number {
    return this._config?.compass?.north?.offset || DEGREES_MIN;
  }

  get compassIndicator(): string {
    if (this._config?.indicator_sensors && this._config?.indicator_sensors.length > NO_ELEMENTS) {
      return this._config?.indicator_sensors[0].indicator?.image || DEFAULT_ICON_VALUE;
    }
    return DEFAULT_ICON_VALUE;
  }

  get compassShowNorth(): boolean {
    return this._config?.compass?.north?.show || false;
  }

  get compassLanguage(): string {
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
      .filter((eid) => entityDomains.includes(eid.split('.')[INDEX_ELEMENT_0]))
      .sort();
    const optionalEntities = ['', ...entities];

    return html`
      ${this.getEditorInput('editor.name', 'editor.optional', 'header.title.value', this.name)}
      ${this.getEditorDropDown('editor.primary entity description', 'editor.required', 'indicator_sensors[0].sensor', this.entity, entities)}
      ${this.getEditorDropDown('editor.secondary entity description', 'editor.optional', 'value_sensors[0].sensor', this.secondaryEntity, optionalEntities)}
      ${this.getEditorDropDown('editor.indicator', 'editor.optional', 'indicator_sensors[0].indicator.image', this.compassIndicator, ICON_VALUES)}
      ${this.getEditorDropDown('editor.language description', 'editor.optional', 'language', this.compassLanguage, COMPASS_LANGUAGES)}
      ${this.getEditorInput('editor.offset description', 'editor.optional', 'compass.north.offset', this.directionOffset)}
      ${this.getEditorSwitch('directions.north', 'compass.north.show', this.compassShowNorth)}
    `;
  }

  private _valueChanged(ev: { target }): void {
    if (!this._config || !this.hass) {
      return;
    }
    const { target } = ev;
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
          if (target.value?.trim() === '') {
            delete this._config.language;
          }
          break;
        case 'compass.north.show': {
          const northShow: CCNorthConfig = { ...this._config.compass?.north, show: target.checked };
          const compassNorthShow: CCCompassConfig = { ...this._config.compass, north: northShow };
          this._config = { ...this._config, compass: compassNorthShow };
          if (!target.checked) {
            delete this._config.compass?.north?.show;
            if (this._config.compass?.north && Object.keys(this._config.compass?.north).length === NO_ELEMENTS) {
              delete this._config.compass?.north;
            }
            if (this._config.compass && Object.keys(this._config.compass).length === NO_ELEMENTS) {
              delete this._config.compass;
            }
          }
          break;
        }
        case 'header.title.value': {
          const titleValue: CCHeaderItemConfig = { ...this._config.header?.title, value: target.value };
          const headerTitleValue: CCHeaderConfig = { ...this._config.header, title: titleValue };
          this._config = { ...this._config, header: headerTitleValue };
          if (target.value?.trim() === '') {
            delete this._config.header?.title?.value;
            if (this._config.header?.title && Object.keys(this._config.header?.title).length === NO_ELEMENTS) {
              delete this._config.header?.title;
            }
            if (this._config.header && Object.keys(this._config.header).length === NO_ELEMENTS) {
              delete this._config.header;
            }
          }
          break;
        }
        case 'compass.north.offset': {
          const northOffset: CCNorthConfig = { ...this._config.compass?.north, offset: Number(target.value) };
          const compassNorthOffset: CCCompassConfig = { ...this._config.compass, north: northOffset };
          this._config = { ...this._config, compass: compassNorthOffset };
          if (target.value && isNumeric(target.value) && Number(target.value) === NO_ELEMENTS) {
            delete this._config.compass?.north?.offset;
            if (this._config.compass?.north && Object.keys(this._config.compass?.north).length === NO_ELEMENTS) {
              delete this._config.compass?.north;
            }
            if (this._config.compass && Object.keys(this._config.compass).length === NO_ELEMENTS) {
              delete this._config.compass;
            }
          }
          break;
        }
        case 'indicator_sensors[0].sensor':
          if (this._config.indicator_sensors[0].sensor !== target.value) {
            const sensorsIndicatorSensor = [...this._config.indicator_sensors];
            sensorsIndicatorSensor[0] = { ...this._config.indicator_sensors[0], sensor: target.value || '' };
            if (sensorsIndicatorSensor[0].attribute) {
              delete sensorsIndicatorSensor[0].attribute;
            }
            this._config = { ...this._config, indicator_sensors: sensorsIndicatorSensor };
          }
          break;
        case 'value_sensors[0].sensor': {
          const valuesSensorsSensor = this._config.value_sensors ? [...this._config.value_sensors] : [];
          if (valuesSensorsSensor[0] === undefined) {
            valuesSensorsSensor[0] = { sensor: target.value || '' };
            this._config = { ...this._config, value_sensors: valuesSensorsSensor };
          } else if (valuesSensorsSensor[0].sensor !== target.value) {
            valuesSensorsSensor[0] = { ...valuesSensorsSensor[0], sensor: target.value || '' };
            if (valuesSensorsSensor[0].attribute) {
              delete valuesSensorsSensor[0].attribute;
            }
            this._config = { ...this._config, value_sensors: valuesSensorsSensor };
          }
          break;
        }
        case 'indicator_sensors[0].indicator.image': {
          const indicatorImage: CCIndicatorConfig = { ...this._config.indicator_sensors[0]?.indicator, image: target.value };
          const sensorsindicatorImage = [...this._config.indicator_sensors];
          sensorsindicatorImage[0] = { ...this._config.indicator_sensors[0], indicator: indicatorImage };
          this._config = { ...this._config, indicator_sensors: sensorsindicatorImage };
          break;
        }
        default:
          // eslint-disable-next-line no-console
          console.warn(`Value changed of unknown config node: ${target.configValue}`);
      }
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
