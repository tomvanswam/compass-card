import { CCCompassConfig, CCHeaderConfig, CCHeaderItemConfig, CCIndicatorConfig, CCNorthConfig, CompassCardConfig } from './editorTypes';
import { COMPASS_LANGUAGES, localize } from './localize/localize.js';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEGREES_MAX, DEGREES_MIN, ICON_VALUES, NO_ELEMENTS } from './const';
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

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private _computeSchema() {
    const entityDomains = ['sensor', 'sun', 'input_number', 'input_text'];
    return [
      { name: 'name', selector: { text: {} } },
      { name: 'primary_entity', required: true, selector: { entity: { domain: entityDomains } } },
      { name: 'secondary_entity', selector: { entity: { domain: entityDomains } } },
      {
        name: 'indicator',
        selector: {
          select: {
            mode: 'dropdown',
            options: ICON_VALUES.map((icon) => ({ label: icon, value: icon })),
          },
        },
      },
      {
        name: 'language',
        selector: {
          select: {
            mode: 'dropdown',
            options: COMPASS_LANGUAGES.map((lang) => ({ label: lang, value: lang })),
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
      case 'primary_entity':
        return `${localize('editor.primary entity description')} (${localize('editor.required')})`;
      case 'secondary_entity':
        return `${localize('editor.secondary entity description')} (${localize('editor.optional')})`;
      case 'indicator':
        return `${localize('editor.indicator')} (${localize('editor.optional')})`;
      case 'language':
        return `${localize('editor.language description')} (${localize('editor.optional')})`;
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
      primary_entity: this._config?.indicator_sensors?.[0]?.sensor || '',
      secondary_entity: this._config?.value_sensors?.[0]?.sensor || '',
    };
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const config = this._config;

    if (!config) return;

    const newConfig = { ...config };

    // Update Name
    if (data.name !== undefined) {
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

    // Update Primary Entity (indicator_sensors[0].sensor)
    if (data.primary_entity !== undefined) {
      if (!newConfig.indicator_sensors) {
        newConfig.indicator_sensors = [{ indicator: {}, sensor: data.primary_entity }];
      } else {
        const sensors = [...newConfig.indicator_sensors];
        sensors[0] = { ...sensors[0], sensor: data.primary_entity };
        if (sensors[0].attribute) {
          delete sensors[0].attribute;
        }
        newConfig.indicator_sensors = sensors;
      }
    }

    // Update Secondary Entity (value_sensors[0].sensor)
    if (data.secondary_entity !== undefined) {
      if (!newConfig.value_sensors || !newConfig.value_sensors.length) {
        newConfig.value_sensors = [{ sensor: data.secondary_entity }];
      } else {
        const sensors = [...newConfig.value_sensors];
        sensors[0] = { ...sensors[0], sensor: data.secondary_entity };
        if (sensors[0].attribute) {
          delete sensors[0].attribute;
        }
        newConfig.value_sensors = sensors;
      }
    }

    // Update Indicator Image
    if (data.indicator !== undefined) {
      if (!newConfig.indicator_sensors) {
        newConfig.indicator_sensors = [{ indicator: { image: data.indicator }, sensor: '' }];
      } else {
        const sensors = [...newConfig.indicator_sensors];
        const indicator: CCIndicatorConfig = { ...sensors[0].indicator, image: data.indicator };
        sensors[0] = { ...sensors[0], indicator };
        newConfig.indicator_sensors = sensors;
      }
    }

    // Update Language
    if (data.language !== undefined) {
      newConfig.language = data.language;
      if (!data.language?.trim()) {
        delete newConfig.language;
      }
    }

    // Update Offset
    if (data.offset !== undefined) {
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
    if (data.north !== undefined) {
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
