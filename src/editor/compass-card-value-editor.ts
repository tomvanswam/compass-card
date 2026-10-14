import { html, TemplateResult } from 'lit';
import { setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { CCValueSensorConfig } from './editorTypes';
import { CompassCardEvent } from '../utils/events';
import { CONFIG_DEFAULTS } from '../defaults';
import { customElement } from 'lit/decorators.js';
import { localize } from '../localize/localize';
import { SensorDetailEditor } from './compass-card-sensor-detail-editor';
import { StyleField } from './compass-card-dynamic-style-editor';

// Parts of a value sensor, each with its own block; fields are the dynamic style options the card uses for it
type ValuePart = 'state_units' | 'state_value';
const VALUE_STYLE_PARTS: { part: ValuePart; fields: StyleField[] }[] = [
  { fields: ['color', 'show'], part: 'state_value' },
  { fields: ['color', 'show'], part: 'state_units' },
];

@customElement('compass-card-value-editor')
export class CompassCardValueEditor extends SensorDetailEditor<CCValueSensorConfig> {
  protected readonly titleKey = 'editor.value_sensor';
  protected readonly defaultDecimals = CONFIG_DEFAULTS.value_sensor.decimals;

  protected renderParts(): TemplateResult[] {
    return VALUE_STYLE_PARTS.map(({ part, fields }) => this._renderPart(part, fields));
  }

  // One block per part: show and color on one row and its dynamic style
  private _renderPart(part: ValuePart, fields: StyleField[]): TemplateResult {
    return html`
      <compass-card-part-editor
        .hass=${this.hass}
        .label=${localize(`editor.dynamic_style.parts.${part}`)}
        .data=${{ color: this.config?.[part]?.color || '', show: this._baseShow(part) }}
        .schema=${[showColorRow()]}
        .computeLabel=${SensorDetailEditor.computeLabel}
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

  // Values equal to the card defaults are left out of the YAML
  private _partChanged(part: ValuePart, ev: CompassCardEvent<'part-changed'>): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const data = ev.detail.value;
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(this.config[part], { color: data.color, show: data.show }, CONFIG_DEFAULTS.value_sensor[part]));
    this.fire(newConfig);
  }

  private _dynamicStyleChanged(part: ValuePart, ev: CompassCardEvent<'dynamic-style-changed'>): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCValueSensorConfig = { ...this.config };
    setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
    this.fire(newConfig);
  }
}
