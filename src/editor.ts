import './compass-card-indicator-editor';
import './compass-card-indicator-row-editor';
import './compass-card-value-editor';
import './compass-card-value-row-editor';
import { CCCompassConfig, CCHeaderConfig, CCHeaderItemConfig, CCNorthConfig, CompassCardConfig } from './editorTypes';
import { COMPASS_LANGUAGES, localize } from './localize/localize.js';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEFAULT_UNKNOWN_DIRECTION, DEGREES_MAX, DEGREES_MIN, NO_ELEMENTS, UNKNOWN_DIRECTION_VALUES } from './const';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from './utils/ha-helpers';


interface CardHelpers {
  // eslint-disable-next-line no-unused-vars
  importMoreInfoControl(type: string): void;
}

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _helpers?: CardHelpers;
  @state() private _config?: CompassCardConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @state() private _subElementEditorConfig?: any;
  private _initialized = false;

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

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers || !this._config) {
      return html``;
    }

    // The climate more-info has ha-switch and paper-dropdown-menu elements that are lazy loaded unless explicitly done here
    this._helpers.importMoreInfoControl('climate');

    const schema = this._computeSchema();
    const data = this._computeData();

    if (this._subElementEditorConfig) {
      if (this._subElementEditorConfig.type === 'indicator') {
        return html`
          <compass-card-indicator-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
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

    // Force load of ha-entity-picker by using it in a hidden ha-form
    const forceLoadSchema = [{ name: 'dummy', selector: { entity: {} } }];

    return html`
      <div style="display: none">
        <ha-form .hass=${this.hass} .data=${{}} .schema=${forceLoadSchema}></ha-form>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <compass-card-indicator-row-editor
        .hass=${this.hass}
        .entities=${this._config.indicator_sensors}
        @entities-changed=${this._valueChanged}
        @edit-detail-element=${this._editDetailElement}
      ></compass-card-indicator-row-editor>
      <compass-card-value-row-editor
        .hass=${this.hass}
        .entities=${this._config.value_sensors}
        @entities-changed=${this._valueChanged}
        @edit-detail-element=${this._editDetailElement}
      ></compass-card-value-row-editor>
    `;
  }

  private _editDetailElement(ev: CustomEvent): void {
    this._subElementEditorConfig = ev.detail.subElementConfig;
  }

  private _goBack(): void {
    this._subElementEditorConfig = undefined;
  }

  private _handleSubElementChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const configValue = this._subElementEditorConfig.type;
    const value = ev.detail.config;

    if (configValue === 'indicator') {
      const newConfigEntities = [...(this._config.indicator_sensors || [])];
      newConfigEntities[this._subElementEditorConfig.index] = value;
      this._config = { ...this._config, indicator_sensors: newConfigEntities };
    } else if (configValue === 'value') {
      const newConfigEntities = [...(this._config.value_sensors || [])];
      newConfigEntities[this._subElementEditorConfig.index] = value;
      this._config = { ...this._config, value_sensors: newConfigEntities };
    }

    this._subElementEditorConfig = {
      ...this._subElementEditorConfig,
      elementConfig: value,
    };

    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  // eslint-disable-next-line class-methods-use-this
  private _computeSchema() {
    return [
      { name: 'name', selector: { text: {} } },
      {
        name: 'language',
        selector: {
          select: {
            mode: 'dropdown',
            options: COMPASS_LANGUAGES.map((lang) => ({ label: lang, value: lang })),
          },
        },
      },
      {
        name: 'unknown_direction',
        selector: {
          select: {
            mode: 'dropdown',
            options: UNKNOWN_DIRECTION_VALUES.map((value) => ({ label: localize(`editor.unknown direction ${value}`), value })),
          },
        },
      },
      { name: 'offset', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
      { name: 'north', selector: { boolean: {} } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
  private _computeLabel = (schema: any) => {
    switch (schema.name) {
      case 'name':
        return `${localize('editor.name')} (${localize('editor.optional')})`;
      case 'language':
        return `${localize('editor.language description')} (${localize('editor.optional')})`;
      case 'unknown_direction':
        return `${localize('editor.unknown direction description')} (${localize('editor.optional')})`;
      case 'offset':
        return `${localize('editor.offset description')} (${localize('editor.optional')})`;
      case 'north':
        return `${localize('directions.north')} (${localize('editor.toggle')})`;
      default:
        return schema.name;
    }
  };

  private _computeData() {
    return {
      indicator: this._config?.indicator_sensors?.[0]?.indicator?.image || DEFAULT_ICON_VALUE,
      language: this._config?.language || '',
      name: this._config?.header?.title?.value || '',
      north: this._config?.compass?.north?.show || false,
      offset: this._config?.compass?.north?.offset || DEGREES_MIN,
      unknown_direction: this._config?.unknown_direction || DEFAULT_UNKNOWN_DIRECTION,
    };
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const config = this._config;

    if (!config) return;

    const newConfig = { ...config };

    // Update Name
    if (data && data.name !== undefined) {
      const titleValue: CCHeaderItemConfig = { ...newConfig.header?.title, value: data.name };
      const headerTitleValue: CCHeaderConfig = { ...newConfig.header, title: titleValue };
      newConfig.header = headerTitleValue;
      if (!data.name?.trim()) {
        delete newConfig.header?.title?.value;
        if (newConfig.header?.title && Object.keys(newConfig.header.title).length === NO_ELEMENTS) {
          delete newConfig.header.title;
        }
        if (newConfig.header && Object.keys(newConfig.header).length === NO_ELEMENTS) {
          delete newConfig.header;
        }
      }
    }

    // Update Indicators (Entities Changed)
    if (ev.detail && ev.detail.entities) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const source = ev.composedPath()[0] as any;
      if (source.tagName === 'COMPASS-CARD-INDICATOR-ROW-EDITOR') {
        newConfig.indicator_sensors = ev.detail.entities;
      } else if (source.tagName === 'COMPASS-CARD-VALUE-ROW-EDITOR') {
        newConfig.value_sensors = ev.detail.entities;
      }
    }

    // Update Language
    if (data && data.language !== undefined) {
      newConfig.language = data.language;
      if (!data.language?.trim()) {
        delete newConfig.language;
      }
    }

    // Update Unknown Direction fallback
    if (data.unknown_direction !== undefined) {
      newConfig.unknown_direction = data.unknown_direction;
      if (!data.unknown_direction || data.unknown_direction === DEFAULT_UNKNOWN_DIRECTION) {
        delete newConfig.unknown_direction;
      }
    }

    // Update Offset
    if (data && data.offset !== undefined) {
      const north: CCNorthConfig = { ...newConfig.compass?.north, offset: Number(data.offset) };
      const compass: CCCompassConfig = { ...newConfig.compass, north };
      newConfig.compass = compass;

      if (Number(data.offset) === DEGREES_MIN) {
        delete newConfig.compass?.north?.offset;
        // Cleanup if empty
        if (newConfig.compass?.north && Object.keys(newConfig.compass.north).length === NO_ELEMENTS) {
          delete newConfig.compass.north;
        }
      }
    }

    // Update North Show
    if (data && data.north !== undefined) {
      const north: CCNorthConfig = { ...newConfig.compass?.north, show: data.north };
      const compass: CCCompassConfig = { ...newConfig.compass, north };
      newConfig.compass = compass;

      if (!data.north) {
        delete newConfig.compass?.north?.show;
        if (newConfig.compass?.north && Object.keys(newConfig.compass.north).length === NO_ELEMENTS) {
          delete newConfig.compass.north;
        }
      }
    }

    // Cleanup compass if empty
    if (newConfig.compass && Object.keys(newConfig.compass).length === NO_ELEMENTS) {
      delete newConfig.compass;
    }

    this._config = newConfig;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._helpers = await (window as any).loadCardHelpers();
  }

  static get styles(): CSSResult {
    return css`
      ha-form {
        width: 100%;
      }
    `;
  }
}
