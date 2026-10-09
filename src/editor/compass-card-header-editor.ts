import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { headerIconShowDefault, headerTitleShowDefault } from '../defaults';
import { setOrDelete, updateObject } from './editorHelpers';
import { CCHeaderConfig } from './editorTypes';
import { localize } from '../localize/localize';

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
      <ha-expansion-panel outlined .header=${localize('editor.header_conf')}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${data}
            .schema=${schema}
            .computeLabel=${CompassCardHeaderEditor._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
          <ha-expansion-panel outlined .header=${localize('editor.dynamic_style.title')}>
            <div class="content">
              <compass-card-dynamic-style-editor
                .hass=${this.hass}
                .config=${this.config?.title?.dynamic_style}
                .label=${localize('editor.header_title_conf')}
                @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged('title', ev)}
              ></compass-card-dynamic-style-editor>
              <compass-card-dynamic-style-editor
                .hass=${this.hass}
                .config=${this.config?.icon?.dynamic_style}
                .label=${localize('editor.header_icon_conf')}
                @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged('icon', ev)}
              ></compass-card-dynamic-style-editor>
            </div>
          </ha-expansion-panel>
        </div>
      </ha-expansion-panel>
    `;
    }

    // eslint-disable-next-line class-methods-use-this
    private _computeSchema() {
        return [
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
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static _computeLabel(schema: any): string {
        return localize(`editor.${schema.name}`) || schema.name;
    }

    private _computeData() {
        return {
            header_icon_color_conf: this.config?.icon?.color || '',
            header_icon_conf: this.config?.icon?.value || '',
            header_icon_show_conf: this.config?.icon?.show ?? headerIconShowDefault(this.config?.icon?.value, this.config?.title?.value),
            header_title_color_conf: this.config?.title?.color || '',
            header_title_conf: this.config?.title?.value || '',
            header_title_show_conf: this.config?.title?.show ?? headerTitleShowDefault(this.config?.title?.value),
        };
    }

    private _dynamicStyleChanged(part: 'icon' | 'title', ev: CustomEvent): void {
        ev.stopPropagation();
        const newConfig: CCHeaderConfig = { ...this.config };
        setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    private _valueChanged(ev: CustomEvent): void {
        ev.stopPropagation();
        const headerData = ev.detail.value;
        if (!headerData) {
            return;
        }

        const newConfig: CCHeaderConfig = { ...this.config };
        const title = updateObject(newConfig.title, { color: headerData.header_title_color_conf, show: headerData.header_title_show_conf, value: headerData.header_title_conf }, { show: headerTitleShowDefault(headerData.header_title_conf || undefined) });
        const icon = updateObject(newConfig.icon, { color: headerData.header_icon_color_conf, show: headerData.header_icon_show_conf, value: headerData.header_icon_conf }, { show: headerIconShowDefault(headerData.header_icon_conf, headerData.header_title_conf) });

        if (title) newConfig.title = title;
        else delete newConfig.title;
        if (icon) newConfig.icon = icon;
        else delete newConfig.icon;

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
