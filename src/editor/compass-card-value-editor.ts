
import { actionData, actionFromData, actionHelper, actionSchema } from './actionForm';
import { CompassCardEvent, fireEvent } from '../utils/events';
import { customElement, property } from 'lit/decorators.js';
import { detailEditorStyles, setOrDelete, showColorRow, unitsDecimalsRow, updateObject } from './editorHelpers';
import { HaFormSchemaItem, HaFormValueChanged } from './haTypes';
import { html, LitElement, TemplateResult } from 'lit';
import { CCValueSensorConfig } from './editorTypes';
import { CONFIG_DEFAULTS } from '../defaults';
import { HomeAssistant } from '../utils/ha-helpers';
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
          .data=${{ attribute: this.config.attribute || '', decimals: this.config.decimals ?? CONFIG_DEFAULTS.value_sensor.decimals, sensor: this.config.sensor || '', units: this.config.units || '' }}
          .schema=${[
            { name: 'sensor', selector: { entity: {} } },
            { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
            unitsDecimalsRow(),
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
      <compass-card-part-editor
        .hass=${this.hass}
        .label=${localize(`editor.dynamic_style.parts.${part}`)}
        .data=${{ color: this.config?.[part]?.color || '', show: this._baseShow(part) }}
        .schema=${[showColorRow()]}
        .computeLabel=${CompassCardValueEditor._computeLabel}
        .dynamicStyle=${this.config?.[part]?.dynamic_style}
        .fields=${fields}
        .base=${{ color: this.config?.[part]?.color, show: this._baseShow(part) }}
        .ownSensor=${true}
        @part-changed=${(ev: CompassCardEvent<'part-changed'>) => this._partChanged(part, ev)}
        @dynamic-style-changed=${(ev: CompassCardEvent<'dynamic-style-changed'>) => this._dynamicStyleChanged(part, ev)}
      ></compass-card-part-editor>
    `;
  }

  // Effective visibility of a part, as in getValueSensor() in objectHelpers.ts
  private _baseShow(part: ValuePart): boolean {
    return this.config?.[part]?.show ?? CONFIG_DEFAULTS.value_sensor[part].show;
  }

  private _fire(newConfig: CCValueSensorConfig): void {
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _generalChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    const data = ev.detail.value;
    const newConfig: CCValueSensorConfig = { ...this.config, sensor: data.sensor || '' };
    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, CONFIG_DEFAULTS.value_sensor.decimals);
    this._fire(newConfig);
  }

  // Values equal to the card defaults are left out of the YAML
  private _partChanged(part: ValuePart, ev: CompassCardEvent<'part-changed'>): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const data = ev.detail.value;
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(this.config[part], { color: data.color, show: data.show }, CONFIG_DEFAULTS.value_sensor[part]));
    this._fire(newConfig);
  }

  private _tapActionChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, 'tap_action', actionFromData(ev.detail.value.tap_action, this.config.tap_action));
    this._fire(newConfig);
  }

  private static _computeLabel(schema: HaFormSchemaItem): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.fields.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _dynamicStyleChanged(part: ValuePart, ev: CompassCardEvent<'dynamic-style-changed'>): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
    this._fire(newConfig);
  }

  private _goBack(): void {
    fireEvent(this, 'go-back', {});
  }

  static styles = detailEditorStyles;
}
