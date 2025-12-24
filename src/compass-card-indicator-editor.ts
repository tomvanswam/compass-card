/* eslint-disable sort-keys */

import { css, CSSResultGroup, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, ICON_VALUES } from './const';
import { fireEvent, HomeAssistant } from './utils/ha-helpers';
import { CCIndicatorSensorConfig } from './editorTypes';
import { localize } from './localize/localize';

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
    ];

    const data = {
      sensor: this.config.sensor || '',
      attribute: this.config.attribute || '',
      indicator: this.config.indicator?.image || DEFAULT_ICON_VALUE,
      units: this.config.units || '',
      decimals: this.config.decimals,
    };

    return html`
      <div class="header">
        <ha-icon-button
          .label=${this.hass.localize('ui.common.back')}
          @click=${this._goBack}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </ha-icon-button>
        <h2>${localize('editor.indicator')}</h2>
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
      },
    };

    if (!data.attribute) delete newConfig.attribute;
    if (!data.units) delete newConfig.units;
    if (data.decimals === undefined) delete newConfig.decimals;

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _goBack(): void {
    fireEvent(this, 'go-back');
  }

  static get styles(): CSSResultGroup {
    return css`
      .header {
        display: flex;
        align-items: center;
      }
      .header h2 {
        margin: 0 0 0 8px;
        font-weight: 500;
        font-size: 20px;
      }
      ha-icon-button {
        --mdc-icon-button-size: 36px;
      }
    `;
  }
}
