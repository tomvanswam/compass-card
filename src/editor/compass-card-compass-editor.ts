import { backgroundOpacityDefault, CONFIG_DEFAULTS } from '../defaults';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEGREES_MAX, DEGREES_MIN } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { setOrDelete, updateObject } from './editorHelpers';
import { CCCompassConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { StyleField } from './compass-card-dynamic-style-editor';

type CompassPart = 'circle' | 'east' | 'north' | 'south' | 'ticks' | 'west';

// Compass items, each with its own block; label is a localize key, fields the dynamic style options the card uses for it
const PARTS: { part: CompassPart; label: string; fields: StyleField[] }[] = [
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

        return html`
      <ha-expansion-panel outlined .header=${localize('editor.compass_conf')}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${this._computeGeneralData()}
            .schema=${CompassCardCompassEditor._computeGeneralSchema()}
            .computeLabel=${CompassCardCompassEditor._computeLabel}
            @value-changed=${this._generalChanged}
          ></ha-form>
          ${PARTS.map(({ part, label, fields }) => this._renderPart(part, label, fields))}
        </div>
      </ha-expansion-panel>
    `;
    }

    // One block per compass item: its settings and its dynamic style (always visible: bands can show a hidden item)
    private _renderPart(part: CompassPart, label: string, fields: StyleField[]): TemplateResult {
        return html`
      <ha-expansion-panel outlined .header=${localize(label)}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${this._computePartData(part)}
            .schema=${CompassCardCompassEditor._computePartSchema(part)}
            .computeLabel=${CompassCardCompassEditor._computeLabel}
            @value-changed=${(ev: CustomEvent) => this._partChanged(part, ev)}
          ></ha-form>
          <compass-card-dynamic-style-editor
            .hass=${this.hass}
            .config=${this.config?.[part]?.dynamic_style}
            .fields=${fields}
            .baseShow=${this._isShown(part)}
            .label=${localize('editor.dynamic_style.title')}
            @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
          ></compass-card-dynamic-style-editor>
        </div>
      </ha-expansion-panel>
    `;
    }

    // Effective visibility, including the card default for a missing show
    private _isShown(part: CompassPart): boolean {
        return this.config?.[part]?.show ?? CONFIG_DEFAULTS.compass[part].show;
    }

    private static _computeGeneralSchema() {
        return [
            { name: 'compass_offset_conf', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
            { name: 'compass_scale_conf', selector: { number: { min: 0, mode: 'box', step: 0.05 } } },
        ];
    }

    private static _computePartSchema(part: CompassPart) {
        const showField = { name: 'show', selector: { boolean: {} } };
        const colorField = { name: 'color', selector: { text: {} } };
        if (part === 'circle') {
            return [
                { name: '', schema: [showField, colorField], type: 'grid' },
                { name: 'stroke_width', selector: { number: { min: 0.5, mode: 'box', step: 0.5 } } },
                {
                    name: 'background',
                    schema: [
                        { name: 'background_image', selector: { text: {} } },
                        {
                            name: '',
                            schema: [
                                { name: 'offset_background', selector: { boolean: {} } },
                                { name: 'background_opacity', selector: { number: { max: 1, min: 0, mode: 'box', step: 0.05 } } },
                            ],
                            type: 'grid',
                        },
                    ],
                    title: localize('editor.compass_circle_background_conf'),
                    type: 'expandable',
                },
            ];
        }
        if (part === 'ticks') {
            return [
                { name: '', schema: [showField, colorField], type: 'grid' },
                {
                    name: '',
                    schema: [
                        { name: 'radius', selector: { number: { min: 1, mode: 'box' } } },
                        { name: 'step', selector: { number: { max: 180, min: 1, mode: 'box' } } },
                    ],
                    type: 'grid',
                },
            ];
        }
        return [{ name: '', schema: [showField, colorField], type: 'grid' }];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _computeLabel(schema: any): string {
        return localize(`editor.compass_fields.${schema.name}`) || localize(`editor.${schema.name}`) || schema.name;
    }

    // Shows the values the card actually uses, including defaults for options missing from the config
    private _computeGeneralData() {
        const defaults = CONFIG_DEFAULTS.compass;
        return {
            compass_offset_conf: this.config?.north?.offset || defaults.north.offset,
            compass_scale_conf: this.config?.scale || defaults.scale,
        };
    }

    private _computePartData(part: CompassPart) {
        const defaults = CONFIG_DEFAULTS.compass;
        const data = { color: this.config?.[part]?.color || '', show: this._isShown(part) };
        if (part === 'circle') {
            const circle = this.config?.circle;
            return {
                ...data,
                background: {
                    background_image: circle?.background_image || '',
                    background_opacity: circle?.background_opacity || backgroundOpacityDefault(circle?.background_image),
                    offset_background: circle?.offset_background ?? defaults.circle.offset_background,
                },
                stroke_width: circle?.stroke_width || defaults.circle.stroke_width,
            };
        }
        if (part === 'ticks') {
            return { ...data, radius: this.config?.ticks?.radius || defaults.ticks.radius, step: this.config?.ticks?.step || defaults.ticks.step };
        }
        return data;
    }

    private _generalChanged(ev: CustomEvent): void {
        ev.stopPropagation();
        const data = ev.detail.value;
        const defaults = CONFIG_DEFAULTS.compass;
        const newConfig: CCCompassConfig = { ...this.config };
        setOrDelete(newConfig, 'north', updateObject(newConfig.north, { offset: data.compass_offset_conf }, defaults.north));
        setOrDelete(newConfig, 'scale', data.compass_scale_conf, defaults.scale);
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    // Values equal to the card defaults are left out of the YAML
    private _partChanged(part: CompassPart, ev: CustomEvent): void {
        ev.stopPropagation();
        const data = ev.detail.value;
        const defaults = CONFIG_DEFAULTS.compass;
        const newConfig: CCCompassConfig = { ...this.config };
        if (part === 'circle') {
            const background = data.background || {};
            setOrDelete(
                newConfig,
                'circle',
                updateObject(
                    newConfig.circle,
                    {
                        background_image: background.background_image,
                        background_opacity: background.background_opacity,
                        color: data.color,
                        offset_background: background.offset_background,
                        show: data.show,
                        stroke_width: data.stroke_width,
                    },
                    { ...defaults.circle, background_opacity: backgroundOpacityDefault(background.background_image) },
                ),
            );
        } else if (part === 'ticks') {
            setOrDelete(newConfig, 'ticks', updateObject(newConfig.ticks, { color: data.color, radius: data.radius, show: data.show, step: data.step }, defaults.ticks));
        } else {
            setOrDelete(newConfig, part, updateObject(newConfig[part], { color: data.color, show: data.show }, defaults[part]));
        }
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    private _dynamicStyleChanged(part: CompassPart, ev: CustomEvent): void {
        ev.stopPropagation();
        const newConfig: CCCompassConfig = { ...this.config };
        setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
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
        gap: var(--ha-space-2, 8px);
        padding: 8px 0;
      }
    `;
    }
}
