import { actionData, actionFromData, actionHelper, actionSchema } from './actionForm';
import { detailEditorStyles, setOrDelete, unitsDecimalsRow } from './editorHelpers';
import { HaFormSchemaItem, HaFormValueChanged } from './haTypes';
import { html, LitElement, TemplateResult } from 'lit';
import { CCValueSensorConfig } from './editorTypes';
import { fireEvent } from '../utils/events';
import { HomeAssistant } from '../utils/ha-helpers';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { property } from 'lit/decorators.js';

/**
 * Detail editor of one sensor (indicator or value sensor): a title row with back button, the general settings
 * (entity, attribute, units, decimals), the sensor's own parts (renderParts) and its tap action.
 * Fires 'config-changed' with the new sensor configuration and 'go-back' to return to the card editor.
 */
export abstract class SensorDetailEditor<T extends CCValueSensorConfig> extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: T;

  // localize key of the title
  protected abstract readonly titleKey: string;
  protected abstract readonly defaultDecimals: number;

  // The blocks for the parts of the sensor (indicator, value, units, ...)
  protected abstract renderParts(): TemplateResult[];

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }
    const tapAction = actionData(this.config.tap_action);
    return html`
      <div class="header">
        <div class="back-title">
          <ha-icon-button .label=${this.hass.localize('ui.common.back')} .path=${mdiArrowLeft} @click=${this._goBack}></ha-icon-button>
          <span slot="title">${localize(this.titleKey)}</span>
        </div>
      </div>
      <div class="groups">
        <ha-form
          .hass=${this.hass}
          .data=${{ attribute: this.config.attribute || '', decimals: this.config.decimals ?? this.defaultDecimals, sensor: this.config.sensor || '', units: this.config.units || '' }}
          .schema=${[{ name: 'sensor', selector: { entity: {} } }, { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } }, unitsDecimalsRow()]}
          .computeLabel=${SensorDetailEditor.computeLabel}
          @value-changed=${this._generalChanged}
        ></ha-form>
        ${this.renderParts()}
        <ha-form
          .hass=${this.hass}
          .data=${{ tap_action: tapAction }}
          .schema=${[{ name: 'tap_action', schema: actionSchema(tapAction, localize('editor.tap_action.entity_helper_sensor')), title: localize('editor.tap_action.title'), type: 'expandable' }]}
          .computeLabel=${SensorDetailEditor.computeLabel}
          .computeHelper=${actionHelper}
          @value-changed=${this._tapActionChanged}
        ></ha-form>
      </div>
    `;
  }

  protected static computeLabel(schema: HaFormSchemaItem): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.fields.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  protected fire(newConfig: T): void {
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _generalChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    const data = ev.detail.value;
    const newConfig = { ...this.config, sensor: data.sensor || '' } as T;
    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, this.defaultDecimals);
    this.fire(newConfig);
  }

  private _tapActionChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: T = { ...this.config };
    setOrDelete(newConfig, 'tap_action', actionFromData(ev.detail.value.tap_action, this.config.tap_action));
    this.fire(newConfig);
  }

  private _goBack(): void {
    fireEvent(this, 'go-back', {});
  }

  static styles = detailEditorStyles;
}
