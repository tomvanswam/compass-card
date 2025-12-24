
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from './utils/ha-helpers';
import { CCValueSensorConfig } from './editorTypes';
import { localize } from './localize/localize';
import { mdiArrowLeft } from '@mdi/js';

@customElement('compass-card-value-editor')
export class CompassCardValueEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCValueSensorConfig;

  @state() private _config?: CCValueSensorConfig;

  public setConfig(config: CCValueSensorConfig): void {
    this._config = config;
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const schema = [
      { name: 'sensor', selector: { entity: {} } },
      { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
      { name: 'units', selector: { text: {} } },
      { name: 'decimals', selector: { number: { max: 10, min: 0, mode: 'box' } } },
      { name: 'state_value_show', selector: { boolean: {} } },
      { name: 'state_value_color', selector: { text: {} } },
      { name: 'state_units_show', selector: { boolean: {} } },
      { name: 'state_units_color', selector: { text: {} } },
    ];

    return html`
      <div class="header">
        <div class="back-title">
          <ha-icon-button
            .label=${this.hass!.localize('ui.common.back')}
            .path=${mdiArrowLeft}
            @click=${this._goBack}
          ></ha-icon-button>
          <span slot="title">${localize('editor.secondary.title')}</span>
        </div>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${{
        ...this.config,
        state_units_color: this.config.state_units?.color || '',
        state_units_show: this.config.state_units?.show !== false,
        state_value_color: this.config.state_value?.color || '',
        state_value_show: this.config.state_value?.show !== false,
      }}
        .schema=${schema}
        .computeLabel=${CompassCardValueEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const newConfig = {
      ...this.config,
      attribute: data.attribute,
      decimals: data.decimals,
      sensor: data.sensor,
      state_units: {
        ...this.config?.state_units,
        color: data.state_units_color,
        show: data.state_units_show,
      },
      state_value: {
        ...this.config?.state_value,
        color: data.state_value_color,
        show: data.state_value_show,
      },
      units: data.units,
    };

    if (!data.attribute) delete newConfig.attribute;
    if (!data.units) delete newConfig.units;
    if (data.decimals === undefined) delete newConfig.decimals;

    if (!newConfig.state_value.color) delete newConfig.state_value.color;
    if (!newConfig.state_units.color) delete newConfig.state_units.color;

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`);
  }

  private _goBack(): void {
    fireEvent(this, 'go-back');
  }

  static get styles(): CSSResult {
    return css`
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .back-title {
        display: flex;
        align-items: center;
        font-size: 18px;
      }
    `;
  }
}
