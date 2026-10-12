
import { actionData, actionFromData, actionHelper, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { CCValueSensorConfig } from './editorTypes';
import { CONFIG_DEFAULTS } from '../defaults';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { StyleField } from './compass-card-dynamic-style-editor';

// Parts of a value sensor, each with its own block; fields are the dynamic style options the card uses for it
type ValuePart = 'state_units' | 'state_value';
const VALUE_STYLE_PARTS: { part: ValuePart; fields: StyleField[] }[] = [
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
      <div class="groups">
        <ha-form
          .hass=${this.hass}
          .data=${{ attribute: this.config.attribute || '', decimals: this.config.decimals || CONFIG_DEFAULTS.value_sensor.decimals, sensor: this.config.sensor || '', units: this.config.units || '' }}
          .schema=${[
            { name: 'sensor', selector: { entity: {} } },
            { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
            { name: 'units', selector: { text: {} } },
            { name: 'decimals', selector: { number: { max: 10, min: 0, mode: 'box' } } },
          ]}
          .computeLabel=${CompassCardValueEditor._computeLabel}
          @value-changed=${this._generalChanged}
        ></ha-form>
        ${VALUE_STYLE_PARTS.map(({ part, fields }) => this._renderPart(part, fields))}
        <ha-form
          .hass=${this.hass}
          .data=${{ tap_action: tapAction }}
          .schema=${[{ name: 'tap_action', schema: actionSchema(tapAction, localize('editor.tap_action.entity_helper_sensor')), title: localize('editor.tap_action.title'), type: 'expandable' }]}
          .computeLabel=${CompassCardValueEditor._computeLabel}
          .computeHelper=${actionHelper}
          @value-changed=${this._tapActionChanged}
        ></ha-form>
      </div>
    `;
  }

  // One block per part: show and color on one row and its dynamic style
  private _renderPart(part: ValuePart, fields: StyleField[]): TemplateResult {
    return html`
      <ha-expansion-panel outlined .header=${localize(`editor.dynamic_style.parts.${part}`)}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${{ color: this.config?.[part]?.color || '', show: this._baseShow(part) }}
            .schema=${[showColorRow()]}
            .computeLabel=${CompassCardValueEditor._computeLabel}
            @value-changed=${(ev: CustomEvent) => this._partChanged(part, ev)}
          ></ha-form>
          <compass-card-dynamic-style-editor
            .hass=${this.hass}
            .config=${this.config?.[part]?.dynamic_style}
            .baseShow=${this._baseShow(part)}
            .fields=${fields}
            .label=${localize('editor.dynamic_style.title')}
            @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
          ></compass-card-dynamic-style-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  // Effective visibility of a part, as in getValueSensor() in objectHelpers.ts
  private _baseShow(part: ValuePart): boolean {
    return this.config?.[part]?.show ?? CONFIG_DEFAULTS.value_sensor[part].show;
  }

  private _fire(newConfig: CCValueSensorConfig): void {
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _generalChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const data = ev.detail.value;
    const newConfig: CCValueSensorConfig = { ...this.config, sensor: data.sensor || '' };
    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, CONFIG_DEFAULTS.value_sensor.decimals);
    this._fire(newConfig);
  }

  // Values equal to the card defaults are left out of the YAML
  private _partChanged(part: ValuePart, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const data = ev.detail.value;
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(this.config[part], { color: data.color, show: data.show }, CONFIG_DEFAULTS.value_sensor[part]));
    this._fire(newConfig);
  }

  private _tapActionChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, 'tap_action', actionFromData(ev.detail.value.tap_action, this.config.tap_action));
    this._fire(newConfig);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.fields.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _dynamicStyleChanged(part: ValuePart, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
    this._fire(newConfig);
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
      /* general settings, one block per part and the tap action, spaced like the main editor groups */
      .groups {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
      }
      .content {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
        padding: 8px 0;
      }
    `;
  }
}
