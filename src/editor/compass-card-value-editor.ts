
import { actionData, actionFromData, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, updateObject } from './editorHelpers';
import { CCValueSensorConfig } from './editorTypes';
import { CONFIG_DEFAULTS } from '../defaults';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { StyleField } from './compass-card-dynamic-style-editor';

// Parts of a value sensor with a dynamic style, and the style options the card uses for each of them
const VALUE_STYLE_PARTS: { part: 'state_units' | 'state_value'; fields: StyleField[] }[] = [
  { fields: ['color', 'show'], part: 'state_value' },
  { fields: ['color', 'show'], part: 'state_units' },
];

@customElement('compass-card-value-editor')
export class CompassCardValueEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCValueSensorConfig;

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    const tapAction = actionData(this.config.tap_action);
    const schema = [
      { name: 'sensor', selector: { entity: {} } },
      { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
      { name: 'units', selector: { text: {} } },
      { name: 'decimals', selector: { number: { max: 10, min: 0, mode: 'box' } } },
      { name: 'state_value_show', selector: { boolean: {} } },
      { name: 'state_value_color', selector: { text: {} } },
      { name: 'state_units_show', selector: { boolean: {} } },
      { name: 'state_units_color', selector: { text: {} } },
      { name: 'tap_action', schema: actionSchema(tapAction), title: localize('editor.tap_action.title'), type: 'expandable' },
    ];

    return html`
      <div class="header">
        <div class="back-title">
          <ha-icon-button
            .label=${this.hass!.localize('ui.common.back')}
            .path=${mdiArrowLeft}
            @click=${this._goBack}
          ></ha-icon-button>
          <span slot="title">${localize('editor.value_sensor')}</span>
        </div>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${{
        ...this.config,
        decimals: this.config.decimals || CONFIG_DEFAULTS.value_sensor.decimals,
        state_units_color: this.config.state_units?.color || '',
        state_units_show: this.config.state_units?.show ?? CONFIG_DEFAULTS.value_sensor.state_units.show,
        state_value_color: this.config.state_value?.color || '',
        state_value_show: this.config.state_value?.show ?? CONFIG_DEFAULTS.value_sensor.state_value.show,
        tap_action: tapAction,
      }}
        .schema=${schema}
        .computeLabel=${CompassCardValueEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <ha-expansion-panel outlined .header=${localize('editor.dynamic_style.title')}>
        <div class="content">
          ${VALUE_STYLE_PARTS.map(
            ({ part, fields }) => html`
              <compass-card-dynamic-style-editor
                .hass=${this.hass}
                .config=${this.config?.[part]?.dynamic_style}
                .fields=${fields}
                .label=${localize(`editor.dynamic_style.parts.${part}`)}
                @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
              ></compass-card-dynamic-style-editor>
            `,
          )}
        </div>
      </ha-expansion-panel>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    // Values equal to the card defaults are left out of the YAML
    const defaults = CONFIG_DEFAULTS.value_sensor;
    const newConfig: CCValueSensorConfig = { ...this.config, sensor: data.sensor || '' };

    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, defaults.decimals);
    setOrDelete(newConfig, 'state_value', updateObject(this.config?.state_value, { color: data.state_value_color, show: data.state_value_show }, defaults.state_value));
    setOrDelete(newConfig, 'state_units', updateObject(this.config?.state_units, { color: data.state_units_color, show: data.state_units_show }, defaults.state_units));
    setOrDelete(newConfig, 'tap_action', actionFromData(data.tap_action, this.config?.tap_action));

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _dynamicStyleChanged(part: (typeof VALUE_STYLE_PARTS)[number]['part'], ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
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
      .content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px 0;
      }
    `;
  }
}
