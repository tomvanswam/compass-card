/* eslint-disable sort-keys */

import { abbreviationShowDefault, CONFIG_DEFAULTS } from '../defaults';
import { actionData, actionFromData, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, ICON_VALUES, INDEX_ELEMENT_0 } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, updateObject } from './editorHelpers';
import { CCIndicatorSensorConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { mdiArrowLeft } from '@mdi/js';
import { StyleField } from './compass-card-dynamic-style-editor';

// Indicator types besides the built-in shapes in ICON_VALUES
const IMAGE_TYPE_MDI = 'mdi';
const IMAGE_TYPE_URL = 'url';
const IMAGE_TYPES = [...ICON_VALUES, IMAGE_TYPE_MDI, IMAGE_TYPE_URL];

// Parts of an indicator sensor with a dynamic style, and the style options the card uses for each of them
const INDICATOR_STYLE_PARTS: { part: 'indicator' | 'state_abbreviation' | 'state_units' | 'state_value'; fields: StyleField[] }[] = [
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

    const imageType = this._getImageType();
    const image = this.config.indicator?.image || '';
    const tapAction = actionData(this.config.tap_action);
    const schema = [
      { name: 'sensor', selector: { entity: {} } },
      { name: 'attribute', selector: { attribute: { entity_id: this.config.sensor } } },
      { name: 'indicator', required: true, selector: { select: { mode: 'dropdown', options: IMAGE_TYPES.map((type) => ({ label: localize(`editor.sensor_config.indicator_types.${type}`), value: type })) } } },
      ...(imageType === IMAGE_TYPE_MDI ? [{ name: 'indicator_icon', selector: { icon: {} } }] : []),
      ...(imageType === IMAGE_TYPE_URL ? [{ name: 'indicator_url', selector: { text: { type: 'url' } } }] : []),
      { name: 'units', selector: { text: {} } },
      { name: 'decimals', selector: { number: { min: 0, max: 10, mode: 'box' } } },
      { name: 'indicator_show', selector: { boolean: {} } },
      { name: 'indicator_color', selector: { text: {} } },
      { name: 'indicator_opacity', selector: { number: { min: 0, max: 1, step: 0.05, mode: 'box' } } },
      { name: 'indicator_size', selector: { number: { min: 1, mode: 'box' } } },
      { name: 'indicator_radius', selector: { number: { min: 0, mode: 'box' } } },
      { name: 'state_value_show', selector: { boolean: {} } },
      { name: 'state_value_color', selector: { text: {} } },
      { name: 'state_units_show', selector: { boolean: {} } },
      { name: 'state_units_color', selector: { text: {} } },
      { name: 'state_abbreviation_show', selector: { boolean: {} } },
      { name: 'state_abbreviation_color', selector: { text: {} } },
      { name: 'tap_action', schema: actionSchema(tapAction), title: localize('editor.tap_action.title'), type: 'expandable' },
    ];

    // Shows the values the card actually uses, including defaults for options missing from the config
    const defaults = CONFIG_DEFAULTS.indicator_sensor;
    const data = {
      sensor: this.config.sensor || '',
      attribute: this.config.attribute || '',
      indicator: imageType,
      indicator_icon: imageType === IMAGE_TYPE_MDI ? image : '',
      indicator_url: imageType === IMAGE_TYPE_URL ? image : '',
      units: this.config.units || '',
      decimals: this.config.decimals || defaults.decimals,
      indicator_show: this.config.indicator?.show ?? defaults.indicator.show,
      indicator_color: this.config.indicator?.color || '',
      indicator_opacity: this.config.indicator?.opacity ?? defaults.indicator.opacity,
      indicator_size: this.config.indicator?.size || defaults.indicator.size,
      indicator_radius: this.config.indicator?.radius ?? defaults.indicator.radius,
      state_value_show: this.config.state_value?.show ?? defaults.state_value.show,
      state_value_color: this.config.state_value?.color || '',
      state_units_show: this.config.state_units?.show ?? defaults.state_units.show,
      state_units_color: this.config.state_units?.color || '',
      state_abbreviation_show: this.config.state_abbreviation?.show ?? abbreviationShowDefault(this.index),
      state_abbreviation_color: this.config.state_abbreviation?.color || '',
      tap_action: tapAction,
    };

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
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${CompassCardIndicatorEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <ha-expansion-panel outlined .header=${localize('editor.dynamic_style.title')}>
        <div class="content">
          ${INDICATOR_STYLE_PARTS.map(
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this.config) {
      return;
    }

    const data = ev.detail.value;
    this._imageType = data.indicator;
    const imageByType: Record<string, string | undefined> = { [IMAGE_TYPE_MDI]: data.indicator_icon, [IMAGE_TYPE_URL]: data.indicator_url };
    const image = data.indicator in imageByType ? imageByType[data.indicator] : data.indicator;
    // Values equal to the card defaults are left out of the YAML; the image is always kept explicit
    const defaults = CONFIG_DEFAULTS.indicator_sensor;
    const indicatorDefaults = { opacity: defaults.indicator.opacity, radius: defaults.indicator.radius, show: defaults.indicator.show, size: defaults.indicator.size };
    const newConfig: CCIndicatorSensorConfig = {
      ...this.config,
      sensor: data.sensor || '',
      indicator: updateObject(
        this.config.indicator,
        {
          image,
          show: data.indicator_show,
          color: data.indicator_color,
          opacity: data.indicator_opacity,
          size: data.indicator_size,
          radius: data.indicator_radius,
        },
        indicatorDefaults,
      ) || {},
    };

    setOrDelete(newConfig, 'attribute', data.attribute);
    setOrDelete(newConfig, 'units', data.units);
    setOrDelete(newConfig, 'decimals', data.decimals, defaults.decimals);
    setOrDelete(newConfig, 'state_value', updateObject(this.config.state_value, { show: data.state_value_show, color: data.state_value_color }, defaults.state_value));
    setOrDelete(newConfig, 'state_units', updateObject(this.config.state_units, { show: data.state_units_show, color: data.state_units_color }, defaults.state_units));
    setOrDelete(newConfig, 'state_abbreviation', updateObject(this.config.state_abbreviation, { show: data.state_abbreviation_show, color: data.state_abbreviation_color }, { show: abbreviationShowDefault(this.index) }));
    setOrDelete(newConfig, 'tap_action', actionFromData(data.tap_action, this.config.tap_action));

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _dynamicStyleChanged(part: (typeof INDICATOR_STYLE_PARTS)[number]['part'], ev: CustomEvent): void {
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
