/* eslint-disable sort-keys */

import { abbreviationShowDefault, CONFIG_DEFAULTS } from '../defaults';
import { actionData, actionFromData, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, ICON_VALUES, INDEX_ELEMENT_0 } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { CCIndicatorSensorConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { StyleField } from './compass-card-dynamic-style-editor';

// Indicator types besides the built-in shapes in ICON_VALUES
const IMAGE_TYPE_MDI = 'mdi';
const IMAGE_TYPE_URL = 'url';
const IMAGE_TYPES = [...ICON_VALUES, IMAGE_TYPE_MDI, IMAGE_TYPE_URL];

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
    const image = this.config?.indicator?.image;
    if (!image) return this._imageType || DEFAULT_ICON_VALUE;
    if (image.startsWith('mdi:')) return IMAGE_TYPE_MDI;
    if ((ICON_VALUES as readonly string[]).includes(image)) return image;
    return IMAGE_TYPE_URL;
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
          .schema=${[{ name: 'tap_action', schema: actionSchema(tapAction), title: localize('editor.tap_action.title'), type: 'expandable' }]}
          .computeLabel=${CompassCardIndicatorEditor._computeLabel}
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
    const imageType = this._getImageType();
    return [
      { name: 'indicator', required: true, selector: { select: { mode: 'dropdown', options: IMAGE_TYPES.map((type) => ({ label: localize(`editor.sensor_config.indicator_types.${type}`), value: type })) } } },
      ...(imageType === IMAGE_TYPE_MDI ? [{ name: 'indicator_icon', selector: { icon: {} } }] : []),
      ...(imageType === IMAGE_TYPE_URL ? [{ name: 'indicator_url', selector: { text: { type: 'url' } } }] : []),
      showColorRow(),
      { name: 'opacity', selector: { number: { min: 0, max: 1, step: 0.05, mode: 'box' } } },
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
    const imageType = this._getImageType();
    const image = this.config?.indicator?.image || '';
    return {
      ...data,
      indicator: imageType,
      indicator_icon: imageType === IMAGE_TYPE_MDI ? image : '',
      indicator_url: imageType === IMAGE_TYPE_URL ? image : '',
      opacity: this.config?.indicator?.opacity ?? defaults.opacity,
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
      const imageByType: Record<string, string | undefined> = { [IMAGE_TYPE_MDI]: data.indicator_icon, [IMAGE_TYPE_URL]: data.indicator_url };
      const image = data.indicator in imageByType ? imageByType[data.indicator] : data.indicator;
      const { opacity, radius, show, size } = CONFIG_DEFAULTS.indicator_sensor.indicator;
      newConfig.indicator = updateObject(this.config.indicator, { image, show: data.show, color: data.color, opacity: data.opacity, size: data.size, radius: data.radius }, { opacity, radius, show, size }) || {};
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
