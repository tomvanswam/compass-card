import { backgroundOpacityDefault, CONFIG_DEFAULTS } from '../defaults';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEGREES_MAX, DEGREES_MIN } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, updateObject } from './editorHelpers';
import { CCCompassConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { StyleField } from './compass-card-dynamic-style-editor';

// Compass elements with a dynamic style, and the style options the card uses for each of them
const DYNAMIC_STYLE_PARTS: { part: 'circle' | 'east' | 'north' | 'south' | 'ticks' | 'west'; label: string; fields: StyleField[] }[] = [
    { fields: ['color', 'show'], label: 'directions.north', part: 'north' },
    { fields: ['color', 'show'], label: 'directions.east', part: 'east' },
    { fields: ['color', 'show'], label: 'directions.south', part: 'south' },
    { fields: ['color', 'show'], label: 'directions.west', part: 'west' },
    { fields: ['color', 'show', 'background_image'], label: 'editor.compass_circle_conf', part: 'circle' },
    { fields: ['color', 'show'], label: 'editor.compass_ticks_conf', part: 'ticks' },
];

@customElement('compass-card-compass-editor')
export class CompassCardCompassEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @property({ attribute: false }) public config?: CCCompassConfig;

    protected render(): TemplateResult {
        if (!this.hass) {
            return html``;
        }

        const schema = this._computeSchema();
        const data = this._computeData();

        return html`
      <ha-expansion-panel outlined .header=${localize('editor.compass_conf')}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${schema}
            .computeLabel=${CompassCardCompassEditor._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-expansion-panel outlined .header=${localize('editor.dynamic_style.title')}>
            <div class="content">
              ${DYNAMIC_STYLE_PARTS.map(
                ({ part, label, fields }) => html`
                  <compass-card-dynamic-style-editor
                    .hass=${this.hass}
                    .config=${this.config?.[part]?.dynamic_style}
                    .fields=${fields}
                    .label=${localize(label)}
                    @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
                  ></compass-card-dynamic-style-editor>
                `,
              )}
            </div>
          </ha-expansion-panel>
        </div>
      </ha-expansion-panel>
    `;
    }

    // eslint-disable-next-line class-methods-use-this
    private _computeSchema() {
        return [
            { name: 'compass_offset_conf', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
            {
                name: '',
                schema: [
                    { name: 'compass_north_show_conf', selector: { boolean: {} } },
                    { name: 'compass_north_color_conf', selector: { text: {} } },
                    { name: 'compass_east_show_conf', selector: { boolean: {} } },
                    { name: 'compass_east_color_conf', selector: { text: {} } },
                    { name: 'compass_south_show_conf', selector: { boolean: {} } },
                    { name: 'compass_south_color_conf', selector: { text: {} } },
                    { name: 'compass_west_show_conf', selector: { boolean: {} } },
                    { name: 'compass_west_color_conf', selector: { text: {} } },
                ],
                type: 'grid',
            },
            { name: 'compass_scale_conf', selector: { number: { min: 0, mode: 'box', step: 0.05 } } },
            {
                name: '',
                schema: [
                    { name: 'compass_circle_show_conf', selector: { boolean: {} } },
                    { name: 'compass_circle_color_conf', selector: { text: {} } },
                ],
                type: 'grid',
            },
            { name: 'compass_circle_stroke_conf', selector: { number: { min: 0.5, mode: 'box', step: 0.5 } } },
            {
                name: '',
                schema: [
                    { name: 'compass_ticks_show_conf', selector: { boolean: {} } },
                    { name: 'compass_ticks_color_conf', selector: { text: {} } },
                ],
                type: 'grid',
            },
            {
                name: '',
                schema: [
                    { name: 'compass_ticks_radius_conf', selector: { number: { min: 1, mode: 'box' } } },
                    { name: 'compass_ticks_step_conf', selector: { number: { max: 180, min: 1, mode: 'box' } } },
                ],
                type: 'grid',
            },
            {
                name: 'compass_circle_background_conf',
                schema: [
                    { name: 'compass_circle_background_image_conf', selector: { text: {} } },
                    {
                        name: '',
                        schema: [
                            { name: 'compass_circle_background_offset_conf', selector: { boolean: {} } },
                            { name: 'compass_circle_background_opacity_conf', selector: { number: { max: 1, min: 0, mode: 'box', step: 0.05 } } },
                        ],
                        type: 'grid',
                    },
                ],
                title: localize('editor.compass_circle_background_conf'),
                type: 'expandable',
            },
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _computeLabel(schema: any): string {
        return localize(`editor.${schema.name}`) || schema.name;
    }

    // Shows the values the card actually uses, including defaults for options missing from the config
    private _computeData() {
        const defaults = CONFIG_DEFAULTS.compass;
        return {
            compass_circle_background_conf: {
                compass_circle_background_image_conf: this.config?.circle?.background_image || '',
                compass_circle_background_offset_conf: this.config?.circle?.offset_background ?? defaults.circle.offset_background,
                compass_circle_background_opacity_conf: this.config?.circle?.background_opacity || backgroundOpacityDefault(this.config?.circle?.background_image),
            },
            compass_circle_color_conf: this.config?.circle?.color || '',
            compass_circle_show_conf: this.config?.circle?.show ?? defaults.circle.show,
            compass_circle_stroke_conf: this.config?.circle?.stroke_width || defaults.circle.stroke_width,
            compass_east_color_conf: this.config?.east?.color || '',
            compass_east_show_conf: this.config?.east?.show ?? defaults.east.show,
            compass_north_color_conf: this.config?.north?.color || '',
            compass_north_show_conf: this.config?.north?.show ?? defaults.north.show,
            compass_offset_conf: this.config?.north?.offset || defaults.north.offset,
            compass_scale_conf: this.config?.scale || defaults.scale,
            compass_south_color_conf: this.config?.south?.color || '',
            compass_south_show_conf: this.config?.south?.show ?? defaults.south.show,
            compass_ticks_color_conf: this.config?.ticks?.color || '',
            compass_ticks_radius_conf: this.config?.ticks?.radius || defaults.ticks.radius,
            compass_ticks_show_conf: this.config?.ticks?.show ?? defaults.ticks.show,
            compass_ticks_step_conf: this.config?.ticks?.step || defaults.ticks.step,
            compass_west_color_conf: this.config?.west?.color || '',
            compass_west_show_conf: this.config?.west?.show ?? defaults.west.show,
        };
    }

    private _dynamicStyleChanged(part: (typeof DYNAMIC_STYLE_PARTS)[number]['part'], ev: CustomEvent): void {
        ev.stopPropagation();
        const newConfig: CCCompassConfig = { ...this.config };
        setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    private _valueChanged(ev: CustomEvent): void {
        ev.stopPropagation();
        const compassData = ev.detail.value;
        if (!compassData) {
            return;
        }

        const backgroundData = compassData.compass_circle_background_conf || {};
        const newConfig: CCCompassConfig = { ...this.config };
        // Values equal to the card defaults are left out of the YAML
        const defaults = CONFIG_DEFAULTS.compass;

        setOrDelete(newConfig, 'north', updateObject(newConfig.north, { color: compassData.compass_north_color_conf, offset: compassData.compass_offset_conf, show: compassData.compass_north_show_conf }, defaults.north));
        setOrDelete(newConfig, 'east', updateObject(newConfig.east, { color: compassData.compass_east_color_conf, show: compassData.compass_east_show_conf }, defaults.east));
        setOrDelete(newConfig, 'south', updateObject(newConfig.south, { color: compassData.compass_south_color_conf, show: compassData.compass_south_show_conf }, defaults.south));
        setOrDelete(newConfig, 'west', updateObject(newConfig.west, { color: compassData.compass_west_color_conf, show: compassData.compass_west_show_conf }, defaults.west));
        setOrDelete(
            newConfig,
            'circle',
            updateObject(
                newConfig.circle,
                {
                    background_image: backgroundData.compass_circle_background_image_conf,
                    background_opacity: backgroundData.compass_circle_background_opacity_conf,
                    color: compassData.compass_circle_color_conf,
                    offset_background: backgroundData.compass_circle_background_offset_conf,
                    show: compassData.compass_circle_show_conf,
                    stroke_width: compassData.compass_circle_stroke_conf,
                },
                { ...defaults.circle, background_opacity: backgroundOpacityDefault(backgroundData.compass_circle_background_image_conf) },
            ),
        );
        setOrDelete(newConfig, 'ticks', updateObject(newConfig.ticks, { color: compassData.compass_ticks_color_conf, radius: compassData.compass_ticks_radius_conf, show: compassData.compass_ticks_show_conf, step: compassData.compass_ticks_step_conf }, defaults.ticks));
        setOrDelete(newConfig, 'scale', compassData.compass_scale_conf, defaults.scale);

        fireEvent(this, 'config-changed', { config: newConfig });
    }

    static get styles(): CSSResult {
        return css`
      ha-form {
        width: 100%;
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
