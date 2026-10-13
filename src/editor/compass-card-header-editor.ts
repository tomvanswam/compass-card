import { customElement, property } from 'lit/decorators.js';
import { editorStyles, setOrDelete, showColorRow, updateObject } from './editorHelpers';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { headerIconShowDefault, headerTitleShowDefault } from '../defaults';
import { html, LitElement, TemplateResult } from 'lit';
import { CCHeaderConfig } from './editorTypes';
import { localize } from '../localize/localize';

type HeaderPart = 'icon' | 'title';

@customElement('compass-card-header-editor')
export class CompassCardHeaderEditor extends LitElement {
    @property({ attribute: false }) public hass?: HomeAssistant;
    @property({ attribute: false }) public config?: CCHeaderConfig;

    protected render(): TemplateResult {
        if (!this.hass) {
            return html``;
        }

        return html`
      <ha-expansion-panel outlined .header=${localize('editor.header_conf')}>
        <div class="content">
          ${this._renderPart('title', 'editor.header_title_conf', { text: {} })}
          ${this._renderPart('icon', 'editor.header_icon_conf', { icon: {} })}
        </div>
      </ha-expansion-panel>
    `;
    }

    // One block per header item: its value, show and color on one row, and its dynamic style
    private _renderPart(part: HeaderPart, label: string, valueSelector: object): TemplateResult {
        return html`
      <compass-card-part-editor
        .hass=${this.hass}
        .label=${localize(label)}
        .data=${{ color: this.config?.[part]?.color || '', show: this._show(part), value: this.config?.[part]?.value || '' }}
        .schema=${[{ name: 'value', selector: valueSelector }, showColorRow()]}
        .computeLabel=${(schema: { name: string }) => (schema.name === 'value' ? localize(label) : localize(`editor.fields.${schema.name}`) || schema.name)}
        .dynamicStyle=${this.config?.[part]?.dynamic_style}
        .base=${{ color: this.config?.[part]?.color, show: this._show(part) }}
        @part-changed=${(ev: CustomEvent) => this._partChanged(part, ev)}
        @dynamic-style-changed=${(ev: CustomEvent) => this._dynamicStyleChanged(part, ev)}
      ></compass-card-part-editor>
    `;
    }

    // Effective visibility, as in getHeader() in objectHelpers.ts
    private _show(part: HeaderPart): boolean {
        return this.config?.[part]?.show ?? this._showDefault(part, this.config?.icon?.value, this.config?.title?.value);
    }

    // eslint-disable-next-line class-methods-use-this
    private _showDefault(part: HeaderPart, icon: string | undefined, title: string | undefined): boolean {
        return part === 'title' ? headerTitleShowDefault(title) : headerIconShowDefault(icon, title);
    }

    private _partChanged(part: HeaderPart, ev: CustomEvent): void {
        ev.stopPropagation();
        const data = ev.detail.value;
        const newConfig: CCHeaderConfig = { ...this.config };
        const value = data.value || undefined;
        const icon = part === 'icon' ? value : this.config?.icon?.value;
        const title = part === 'title' ? value : this.config?.title?.value;
        // The switch shows the visibility before this change; while it is not toggled the stored show is kept, so a new
        // title or icon follows its default (shown) instead of keeping the old default (hidden)
        const show = data.show === this._show(part) ? this.config?.[part]?.show : data.show;
        setOrDelete(newConfig, part, updateObject(newConfig[part], { color: data.color, show, value }, { show: this._showDefault(part, icon, title) }));
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    private _dynamicStyleChanged(part: HeaderPart, ev: CustomEvent): void {
        ev.stopPropagation();
        const newConfig: CCHeaderConfig = { ...this.config };
        setOrDelete(newConfig, part, updateObject(newConfig[part], { dynamic_style: ev.detail.value }));
        fireEvent(this, 'config-changed', { config: newConfig });
    }

    static styles = editorStyles;
}
