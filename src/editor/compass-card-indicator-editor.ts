/* eslint-disable sort-keys */

import { abbreviationShowDefault, CONFIG_DEFAULTS } from '../defaults';
import { actionData, actionFromData, actionHelper, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { imageData, imageFromData, imageSchema, imageType } from './imageForm';
import { opacityFromPercent, opacitySelector, opacityToPercent, setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { CCIndicatorSensorConfig } from './editorTypes';
import { INDEX_ELEMENT_0 } from '../const';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { StyleField } from './compass-card-dynamic-style-editor';

// Parts of an indicator sensor, each with its own block; fields are the dynamic style options the card uses for it
type IndicatorPart = 'indicator' | 'state_abbreviation' | 'state_units' | 'state_value';
const INDICATOR_STYLE_PARTS: { part: IndicatorPart; fields: StyleField[] }[] = [
  { fields: ['color', 'show', 'image', 'opacity', 'size', 'radius'], part: 'indicator' },
  { fields: ['color', 'show'], part: 'state_value' },
  { fields: ['color', 'show'], part: 'state_units' },
  { fields: ['color', 'show'], part: 'state_abbreviation' },
];

@customElement('compass-card-indicator-editor')
export class CompassCardIndicatorEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCIndicatorSensorConfig;
  @property({ attribute: false }) public index = INDEX_ELEMENT_0;
  // Remembers the chosen type while its icon/URL field is still empty (config then has no image)
  @state() private _imageType?: string;

  private _getImageType(): string {
    return imageType(this.config?.indicator?.image, this._imageType);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this.config) {
      return html``;
    }

    // Shows the values the card actually uses, including defaults for options missing from the config
    const defaults = CONFIG_DEFAULTS.indicator_sensor;
    const tapAction = actionData(this.config.tap_action);
    return html`
      <div class="header">
        <div class="back-title">
          <ha-icon-button
            .label=${this.hass.localize('ui.common.back')}
            .path=${mdiArrowLeft}
            @click=${this._goBack}
          ></ha-icon-button>
          <span slot="title">${localize('editor.indicator_sensor')}</span>
        </div>
      </div>
      <div class="groups">
        <ha-form
          .hass=${this.hass}
          .data=${{ attribute: this.config.attribute || '', decimals: this.config.decimals || defaults.decimals, sensor: this.config.sensor || '', units: this.config.units || '' }}
          .schema=${[
            { name: 'sensor', selector: { entity: {} } },
            { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
            { name: 'units', selector: { text: {} } },
            { name: 'decimals', selector: { number: { min: 0, max: 10, mode: 'box' } } },
          ]}
          .computeLabel=${CompassCardIndicatorEditor._computeLabel}
          @value-changed=${this._generalChanged}
        ></ha-form>
        ${INDICATOR_STYLE_PARTS.map(({ part, fields }) => this._renderPart(part, fields))}
        <ha-form
          .hass=${this.hass}
          .data=${{ tap_action: tapAction }}
          .schema=${[{ name: 'tap_action', schema: actionSchema(tapAction, localize('editor.tap_action.entity_helper_sensor')), title: localize('editor.tap_action.title'), type: 'expandable' }]}
          .computeLabel=${CompassCardIndicatorEditor._computeLabel}
          .computeHelper=${actionHelper}
          @value-changed=${this._tapActionChanged}
        ></ha-form>
      </div>
    `;
  }

  // One block per part: show and color on one row (plus the indicator's own options) and its dynamic style
  private _renderPart(part: IndicatorPart, fields: StyleField[]): TemplateResult {
    return html`
      <ha-expansion-panel outlined .header=${localize(`editor.dynamic_style.parts.${part}`)}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${this._computePartData(part)}
            .schema=${this._computePartSchema(part)}
            .computeLabel=${CompassCardIndicatorEditor._computeLabel}
            @value-changed=${(ev: CustomEvent) => this._partChanged(part, ev)}
          ></ha-form>
          <compass-card-dynamic-style-editor
            .hass=${this.hass}
            .config=${this.config?.[part]?.dynamic_style}
            .baseShow=${this._baseShow(part)}
            .baseOpacity=${this.config?.indicator?.opacity ?? CONFIG_DEFAULTS.indicator_sensor.indicator.opacity}
            .baseImage=${this.config?.indicator?.image || CONFIG_DEFAULTS.indicator_sensor.indicator.image}
            .fields=${fields}
            .label=${localize('editor.dynamic_style.title')}
            @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
          ></compass-card-dynamic-style-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _computePartSchema(part: IndicatorPart) {
    if (part !== 'indicator') {
      return [showColorRow()];
    }
    return [
      ...imageSchema(this._getImageType()),
      showColorRow(),
      { name: 'opacity', selector: opacitySelector() },
      { name: 'size', selector: { number: { min: 1, mode: 'box' } } },
      { name: 'radius', selector: { number: { min: 0, mode: 'box' } } },
    ];
  }

  private _computePartData(part: IndicatorPart) {
    const data = { color: this.config?.[part]?.color || '', show: this._baseShow(part) };
    if (part !== 'indicator') {
      return data;
    }
    const defaults = CONFIG_DEFAULTS.indicator_sensor.indicator;
    return {
      ...data,
      ...imageData(this.config?.indicator?.image, this._getImageType()),
      opacity: opacityToPercent(this.config?.indicator?.opacity ?? defaults.opacity),
      radius: this.config?.indicator?.radius ?? defaults.radius,
      size: this.config?.indicator?.size || defaults.size,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.fields.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _fire(newConfig: CCIndicatorSensorConfig): void {
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _generalChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const data = ev.detail.value;
    const newConfig: CCIndicatorSensorConfig = { ...this.config, sensor: data.sensor || '' };
    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, CONFIG_DEFAULTS.indicator_sensor.decimals);
    this._fire(newConfig);
  }

  // Values equal to the card defaults are left out of the YAML; the image is always kept explicit
  private _partChanged(part: IndicatorPart, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const data = ev.detail.value;
    const newConfig: CCIndicatorSensorConfig = { ...this.config };
    if (part === 'indicator') {
      this._imageType = data.indicator;
      const image = imageFromData(data);
      const { opacity, radius, show, size } = CONFIG_DEFAULTS.indicator_sensor.indicator;
      newConfig.indicator = updateObject(this.config.indicator, { image, show: data.show, color: data.color, opacity: opacityFromPercent(data.opacity, this.config.indicator?.opacity ?? opacity), size: data.size, radius: data.radius }, { opacity, radius, show, size }) || {};
    } else {
      setOrDelete(newConfig, part, updateObject(this.config[part], { show: data.show, color: data.color }, { show: this._showDefault(part) }));
    }
    this._fire(newConfig);
  }

  private _tapActionChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCIndicatorSensorConfig = { ...this.config };
    setOrDelete(newConfig, 'tap_action', actionFromData(ev.detail.value.tap_action, this.config.tap_action));
    this._fire(newConfig);
  }

  // Default visibility of a part, as in getIndicatorSensor() in objectHelpers.ts
  private _showDefault(part: IndicatorPart): boolean {
    return part === 'state_abbreviation' ? abbreviationShowDefault(this.index) : CONFIG_DEFAULTS.indicator_sensor[part].show;
  }

  // Effective visibility of a part without dynamic style
  private _baseShow(part: IndicatorPart): boolean {
    return this.config?.[part]?.show ?? this._showDefault(part);
  }

  private _dynamicStyleChanged(part: IndicatorPart, ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }
    const newConfig: CCIndicatorSensorConfig = { ...this.config };
    const updated = updateObject(newConfig[part], { dynamic_style: ev.detail.value });
    if (part === 'indicator') {
      newConfig.indicator = updated || {};
    } else {
      setOrDelete(newConfig, part, updated);
    }
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
