/* eslint-disable sort-keys */

import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, ICON_VALUES } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { CCIndicatorSensorConfig } from './editorTypes';
import { localize } from '../localize/localize';

@customElement('compass-card-indicator-editor')
export class CompassCardIndicatorEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCIndicatorSensorConfig;

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const schema = [
      { name: 'sensor', selector: { entity: {} } },
      { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
      { name: 'indicator', selector: { select: { mode: 'dropdown', options: ICON_VALUES.map((icon) => ({ label: icon, value: icon })) } } },
      { name: 'units', selector: { text: {} } },
      { name: 'decimals', selector: { number: { min: 0, max: 10, mode: 'box' } } },
      { name: 'indicator_show', selector: { boolean: {} } },
      { name: 'indicator_color', selector: { text: {} } },
      { name: 'indicator_opacity', selector: { number: { min: 0, max: 1, step: 0.1, mode: 'box' } } },
      { name: 'indicator_size', selector: { number: { min: 0, mode: 'box' } } },
      { name: 'indicator_radius', selector: { number: { min: 0, mode: 'box' } } },
      { name: 'state_value_show', selector: { boolean: {} } },
      { name: 'state_value_color', selector: { text: {} } },
      { name: 'state_units_show', selector: { boolean: {} } },
      { name: 'state_units_color', selector: { text: {} } },
      { name: 'state_abbreviation_show', selector: { boolean: {} } },
      { name: 'state_abbreviation_color', selector: { text: {} } },
    ];

    const data = {
      sensor: this.config.sensor || '',
      attribute: this.config.attribute || '',
      indicator: this.config.indicator?.image || DEFAULT_ICON_VALUE,
      units: this.config.units || '',
      decimals: this.config.decimals,
      indicator_show: this.config.indicator?.show !== false,
      indicator_color: this.config.indicator?.color || '',
      indicator_opacity: this.config.indicator?.opacity,
      indicator_size: this.config.indicator?.size,
      indicator_radius: this.config.indicator?.radius,
      state_value_show: this.config.state_value?.show !== false,
      state_value_color: this.config.state_value?.color || '',
      state_units_show: this.config.state_units?.show !== false,
      state_units_color: this.config.state_units?.color || '',
      state_abbreviation_show: this.config.state_abbreviation?.show !== false,
      state_abbreviation_color: this.config.state_abbreviation?.color || '',
    };

    return html`
      <div class="header">
        <ha-icon-button
          .label=${this.hass.localize('ui.common.back')}
          @click=${this._goBack}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <span slot="title">${localize('editor.primary.title')}</span>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${CompassCardIndicatorEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`);
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }

    const data = ev.detail.value;
    const newConfig = {
      ...this.config,
      sensor: data.sensor,
      attribute: data.attribute,
      units: data.units,
      decimals: data.decimals,
      indicator: {
        ...this.config.indicator,
        image: data.indicator,
        show: data.indicator_show,
        color: data.indicator_color,
        opacity: data.indicator_opacity,
        size: data.indicator_size,
        radius: data.indicator_radius,
      },
      state_value: {
        ...this.config.state_value,
        show: data.state_value_show,
        color: data.state_value_color,
      },
      state_units: {
        ...this.config.state_units,
        show: data.state_units_show,
        color: data.state_units_color,
      },
      state_abbreviation: {
        ...this.config.state_abbreviation,
        show: data.state_abbreviation_show,
        color: data.state_abbreviation_color,
      },
    };

    if (!data.attribute) delete newConfig.attribute;
    if (!data.units) delete newConfig.units;
    if (data.decimals === undefined) delete newConfig.decimals;

    // Cleanup empty objects or properties
    if (!newConfig.indicator.color) delete newConfig.indicator.color;
    if (newConfig.indicator.opacity === undefined) delete newConfig.indicator.opacity;
    if (newConfig.indicator.size === undefined) delete newConfig.indicator.size;
    if (newConfig.indicator.radius === undefined) delete newConfig.indicator.radius;

    if (!newConfig.state_value.color) delete newConfig.state_value.color;
    if (!newConfig.state_units.color) delete newConfig.state_units.color;
    if (!newConfig.state_abbreviation.color) delete newConfig.state_abbreviation.color;

    fireEvent(this, 'config-changed', { config: newConfig });
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
