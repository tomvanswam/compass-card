import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NO_ELEMENTS } from '../const';
import { CCHeaderConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';

@customElement('compass-card-header-editor')
export class CompassCardHeaderEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @property({ attribute: false }) public config?: CCHeaderConfig;

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
        .computeLabel=${CompassCardHeaderEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
    }

    // eslint-disable-next-line class-methods-use-this
    private _computeSchema() {
        return [
            {
                name: 'header_conf',
                schema: [
                    { name: 'header_title_conf', selector: { text: {} } },
                    {
                        name: '',
                        schema: [
                            { name: 'header_title_show_conf', selector: { boolean: {} } },
                            { name: 'header_title_color_conf', selector: { text: {} } },
                        ],
                        type: 'grid',
                    },
                    { name: 'header_icon_conf', selector: { icon: {} } },
                    {
                        name: '',
                        schema: [
                            { name: 'header_icon_show_conf', selector: { boolean: {} } },
                            { name: 'header_icon_color_conf', selector: { text: {} } },
                        ],
                        type: 'grid',
                    },
                ],
                title: localize('editor.header_conf'),
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
            header_conf: {
                header_icon_color_conf: this.config?.icon?.color || '',
                header_icon_conf: this.config?.icon?.value || '',
                header_icon_show_conf: this.config?.icon?.show !== false,
                header_title_color_conf: this.config?.title?.color || '',
                header_title_conf: this.config?.title?.value || '',
                header_title_show_conf: this.config?.title?.show !== false,
            },
        };
    }

    private _valueChanged(ev: CustomEvent): void {
        const headerData = ev.detail.value.header_conf;

        // Create a new config object based on existing config or empty if undefined
        const newConfig: CCHeaderConfig = this.config ? { ...this.config } : {};

        if (headerData) {
            // Title Logic
            const newTitle = newConfig.title ? { ...newConfig.title } : {};

            if (headerData.header_title_conf === '' || headerData.header_title_conf === undefined) {
                delete newTitle.value;
            } else {
                newTitle.value = headerData.header_title_conf;
            }

            if (headerData.header_title_show_conf !== undefined) {
                newTitle.show = headerData.header_title_show_conf;
            }

            if (headerData.header_title_color_conf !== undefined) {
                newTitle.color = headerData.header_title_color_conf;
            }

            if (newTitle.color === '') {
                delete newTitle.color;
            }

            if (Object.keys(newTitle).length === NO_ELEMENTS) {
                delete newConfig.title;
            } else {
                newConfig.title = newTitle;
            }

            // Icon Logic
            const newIcon = newConfig.icon ? { ...newConfig.icon } : {};

            if (headerData.header_icon_conf === '' || headerData.header_icon_conf === undefined) {
                delete newIcon.value;
            } else {
                newIcon.value = headerData.header_icon_conf;
            }

            if (headerData.header_icon_show_conf !== undefined) {
                newIcon.show = headerData.header_icon_show_conf;
            }

            if (headerData.header_icon_color_conf !== undefined) {
                newIcon.color = headerData.header_icon_color_conf;
            }

            if (newIcon.color === '') {
                delete newIcon.color;
            }

            if (Object.keys(newIcon).length === NO_ELEMENTS) {
                delete newConfig.icon;
            } else {
                newConfig.icon = newIcon;
            }
        }

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
