/* eslint-disable sort-keys */

import { abbreviationShowDefault, CONFIG_DEFAULTS } from '../defaults';
import { customElement, property, state } from 'lit/decorators.js';
import { html, TemplateResult } from 'lit';
import { imageData, imageFromData, imageSchema, imageType } from './imageForm';
import { opacityFromPercent, opacitySelector, opacityToPercent, setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { StyleBase, StyleField } from './compass-card-dynamic-style-editor';
import { CCIndicatorSensorConfig } from './editorTypes';
import { CompassCardEvent } from '../utils/events';
import { INDEX_ELEMENT_0 } from '../const';
import { localize } from '../localize/localize';
import { SensorDetailEditor } from './compass-card-sensor-detail-editor';

// Parts of an indicator sensor, each with its own block; fields are the dynamic style options the card uses for it
type IndicatorPart = 'indicator' | 'state_abbreviation' | 'state_units' | 'state_value';
const INDICATOR_STYLE_PARTS: { part: IndicatorPart; fields: StyleField[] }[] = [
  { fields: ['color', 'show', 'image', 'opacity', 'size', 'radius'], part: 'indicator' },
  { fields: ['color', 'show'], part: 'state_value' },
  { fields: ['color', 'show'], part: 'state_units' },
  { fields: ['color', 'show'], part: 'state_abbreviation' },
];

@customElement('compass-card-indicator-editor')
export class CompassCardIndicatorEditor extends SensorDetailEditor<CCIndicatorSensorConfig> {
  protected readonly titleKey = 'editor.indicator_sensor';
  protected readonly defaultDecimals = CONFIG_DEFAULTS.indicator_sensor.decimals;
  @property({ attribute: false }) public index = INDEX_ELEMENT_0;
  // Remembers the chosen type while its icon/URL field is still empty (config then has no image)
  @state() private _imageType?: string;

  private _getImageType(): string {
    return imageType(this.config?.indicator?.image, this._imageType);
  }

  protected renderParts(): TemplateResult[] {
    return INDICATOR_STYLE_PARTS.map(({ part, fields }) => this._renderPart(part, fields));
  }

  // One block per part: show and color on one row (plus the indicator's own options) and its dynamic style
  private _renderPart(part: IndicatorPart, fields: StyleField[]): TemplateResult {
    return html`
      <compass-card-part-editor
        .hass=${this.hass}
        .label=${localize(`editor.dynamic_style.parts.${part}`)}
        .data=${this._computePartData(part)}
        .schema=${this._computePartSchema(part)}
        .computeLabel=${SensorDetailEditor.computeLabel}
        .dynamicStyle=${this.config?.[part]?.dynamic_style}
        .fields=${fields}
        .base=${this._styleBase(part)}
        .ownSensor=${true}
        @part-changed=${(ev: CompassCardEvent<'part-changed'>) => this._partChanged(part, ev)}
        @dynamic-style-changed=${(ev: CompassCardEvent<'dynamic-style-changed'>) => this._dynamicStyleChanged(part, ev)}
      ></compass-card-part-editor>
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
      {
        column_min_width: '120px',
        name: '',
        schema: [
          { name: 'size', selector: { number: { min: 0, mode: 'box' } } },
          { name: 'radius', selector: { number: { min: 0, mode: 'box' } } },
        ],
        type: 'grid',
      },
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
      size: this.config?.indicator?.size ?? defaults.size,
    };
  }

  // Values equal to the card defaults are left out of the YAML; the image is always kept explicit
  private _partChanged(part: IndicatorPart, ev: CompassCardEvent<'part-changed'>): void {
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
    this.fire(newConfig);
  }

  // Effective options of a part without dynamic style; the indicator's image, opacity, size and radius apply to all parts
  private _styleBase(part: IndicatorPart): StyleBase {
    const indicator = this.config?.indicator;
    const defaults = CONFIG_DEFAULTS.indicator_sensor.indicator;
    return {
      color: this.config?.[part]?.color,
      image: indicator?.image || defaults.image,
      opacity: indicator?.opacity ?? defaults.opacity,
      radius: indicator?.radius ?? defaults.radius,
      show: this._baseShow(part),
      size: indicator?.size ?? defaults.size,
    };
  }

  // Default visibility of a part, as in getIndicatorSensor() in objectHelpers.ts
  private _showDefault(part: IndicatorPart): boolean {
    return part === 'state_abbreviation' ? abbreviationShowDefault(this.index) : CONFIG_DEFAULTS.indicator_sensor[part].show;
  }

  // Effective visibility of a part without dynamic style
  private _baseShow(part: IndicatorPart): boolean {
    return this.config?.[part]?.show ?? this._showDefault(part);
  }

  private _dynamicStyleChanged(part: IndicatorPart, ev: CompassCardEvent<'dynamic-style-changed'>): void {
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
    this.fire(newConfig);
  }
}
