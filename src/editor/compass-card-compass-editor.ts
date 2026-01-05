import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEGREES_MAX, DEGREES_MIN, NO_ELEMENTS } from '../const';
import { CCCompassConfig, CCNorthConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';

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
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${CompassCardCompassEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
    }

    // eslint-disable-next-line class-methods-use-this
    private _computeSchema() {
        return [
            {
                name: 'compass_conf',
                schema: [
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
                    { name: 'compass_circle_stroke_conf', selector: { number: { min: 0, mode: 'box' } } },
                    {
                        name: '',
                        schema: [
                            { name: 'compass_ticks_radius_conf', selector: { number: { min: 0, mode: 'box' } } },
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
                ],
                title: localize('editor.compass_conf'),
                type: 'expandable',
            },
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _computeLabel(schema: any): string {
        return localize(`editor.${schema.name}`) || schema.name;
    }

    private _computeData() {
        return {
            compass_conf: {
                compass_circle_background_conf: {
                    compass_circle_background_image_conf: this.config?.circle?.background_image || '',
                    compass_circle_background_offset_conf: this.config?.circle?.offset_background || false,
                    compass_circle_background_opacity_conf: this.config?.circle?.background_opacity,
                },
                compass_circle_stroke_conf: this.config?.circle?.stroke_width,
                compass_east_color_conf: this.config?.east?.color || '',
                compass_east_show_conf: this.config?.east?.show !== false,
                compass_north_color_conf: this.config?.north?.color || '',
                compass_north_show_conf: this.config?.north?.show !== false,
                compass_offset_conf: this.config?.north?.offset || DEGREES_MIN,
                compass_south_color_conf: this.config?.south?.color || '',
                compass_south_show_conf: this.config?.south?.show !== false,
                compass_ticks_radius_conf: this.config?.ticks?.radius,
                compass_ticks_step_conf: this.config?.ticks?.step,
                compass_west_color_conf: this.config?.west?.color || '',
                compass_west_show_conf: this.config?.west?.show !== false,
            },
        };
    }

    private _valueChanged(ev: CustomEvent): void {
        const compassData = ev.detail.value.compass_conf;

        // Create a new config object based on existing config or empty if undefined
        // Note: If config is undefined, we start with {}
        const newConfig: CCCompassConfig = this.config ? { ...this.config } : {};

        if (compassData) {
            // Offset optimization: check for DEGREES_MIN before creating objects? No, standard flow.
            const compass: CCCompassConfig = { ...newConfig };

            // Update Offset
            if (compassData.compass_offset_conf !== undefined) {
                const north: CCNorthConfig = { ...compass.north, offset: Number(compassData.compass_offset_conf) };
                compass.north = north;

                if (Number(compassData.compass_offset_conf) === DEGREES_MIN) {
                    delete north.offset;
                    if (Object.keys(north).length === NO_ELEMENTS) {
                        // North is empty
                        delete compass.north;
                    } else {
                        compass.north = north;
                    }
                }
            }

            // North
            if (compassData.compass_north_show_conf !== undefined) {
                compass.north = { ...compass.north, show: compassData.compass_north_show_conf };
            }
            if (compassData.compass_north_color_conf !== undefined) {
                compass.north = { ...compass.north, color: compassData.compass_north_color_conf };
            }
            if (compass.north?.color === '') {
                compass.north = { ...compass.north };
                delete compass.north.color;
            }

            // East
            if (compassData.compass_east_show_conf !== undefined) {
                compass.east = { ...compass.east, show: compassData.compass_east_show_conf };
            }
            if (compassData.compass_east_color_conf !== undefined) {
                compass.east = { ...compass.east, color: compassData.compass_east_color_conf };
            }
            if (compass.east?.color === '') {
                compass.east = { ...compass.east };
                delete compass.east.color;
            }

            // South
            if (compassData.compass_south_show_conf !== undefined) {
                compass.south = { ...compass.south, show: compassData.compass_south_show_conf };
            }
            if (compassData.compass_south_color_conf !== undefined) {
                compass.south = { ...compass.south, color: compassData.compass_south_color_conf };
            }
            if (compass.south?.color === '') {
                compass.south = { ...compass.south };
                delete compass.south.color;
            }

            // West
            if (compassData.compass_west_show_conf !== undefined) {
                compass.west = { ...compass.west, show: compassData.compass_west_show_conf };
            }
            if (compassData.compass_west_color_conf !== undefined) {
                compass.west = { ...compass.west, color: compassData.compass_west_color_conf };
            }
            if (compass.west?.color === '') {
                compass.west = { ...compass.west };
                delete compass.west.color;
            }

            // Circle
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const circle: any = { ...compass.circle };
            const backgroundData = compassData.compass_circle_background_conf || {};

            if (backgroundData.compass_circle_background_image_conf !== undefined) circle.background_image = backgroundData.compass_circle_background_image_conf;
            if (backgroundData.compass_circle_background_opacity_conf !== undefined) circle.background_opacity = backgroundData.compass_circle_background_opacity_conf;
            if (backgroundData.compass_circle_background_offset_conf !== undefined) circle.offset_background = backgroundData.compass_circle_background_offset_conf;
            if (compassData.compass_circle_stroke_conf !== undefined) circle.stroke_width = compassData.compass_circle_stroke_conf;
            compass.circle = circle;

            // Ticks
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const ticks: any = { ...compass.ticks };
            if (compassData.compass_ticks_radius_conf !== undefined) ticks.radius = compassData.compass_ticks_radius_conf;
            if (compassData.compass_ticks_step_conf !== undefined) ticks.step = compassData.compass_ticks_step_conf;
            compass.ticks = ticks;

            // Assign back to newConfig (since we made compass = {...newConfig} initially but typescript might not see it as direct ref)
            // Actually compass IS newConfig effectively if we cast it, but better be safe:
            Object.assign(newConfig, compass);
        }

        // Cleanup items if they become empty? Not strictly required by logic but good practice.
        // The original logic cleaned up `newConfig.compass` if it was empty. 
        // Here we are INSIDE the compass editor, so we just return the config for the compass itself.
        // The parent will decide if it needs to remove 'compass' property from the main config if it's empty, 
        // or we can return undefined/empty object?
        // The original logic: `if (newConfig.compass && Object.keys(newConfig.compass).length === NO_ELEMENTS) delete newConfig.compass;`
        // We should probably just return the Compass Config object.

        fireEvent(this, 'config-changed', { config: newConfig });
    }

    static get styles(): CSSResult {
        return css`
      ha-form {
        width: 100%;
      }
    `;
    }
}
