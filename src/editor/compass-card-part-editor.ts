import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, OPACITY_VISIBLE } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { CCDynamicStyleConfig } from './editorTypes';
import { localize } from '../localize/localize';
import { StyleField } from './compass-card-dynamic-style-editor';

declare global {
  interface HTMLElementTagNameMap {
    'compass-card-part-editor': CompassCardPartEditor;
  }
}

/**
 * Block for one element of the card (a compass direction, the header title, an indicator's value, ...):
 * an expansion panel with the element's settings form and its dynamic style editor.
 * Fires 'part-changed' with the form values and passes on 'dynamic-style-changed' from the dynamic style editor.
 */
@customElement('compass-card-part-editor')
export class CompassCardPartEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public label?: string;
  // Settings form of the element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ attribute: false }) public data: Record<string, any> = {};
  @property({ attribute: false }) public schema: object[] = [];
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  @property({ attribute: false }) public computeLabel?: (schema: any) => string;
  // Dynamic style of the element and the values its bands inherit (see compass-card-dynamic-style-editor.ts)
  @property({ attribute: false }) public dynamicStyle?: CCDynamicStyleConfig;
  @property({ attribute: false }) public fields: StyleField[] = ['color', 'show'];
  @property({ attribute: false }) public baseShow = true;
  @property({ attribute: false }) public baseOpacity = OPACITY_VISIBLE;
  @property({ attribute: false }) public baseImage = DEFAULT_ICON_VALUE;

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    return html`
      <ha-expansion-panel outlined .header=${this.label}>
        <div class="content">
          <ha-form .hass=${this.hass} .data=${this.data} .schema=${this.schema} .computeLabel=${this.computeLabel} @value-changed=${this._formChanged}></ha-form>
          <compass-card-dynamic-style-editor
            .hass=${this.hass}
            .config=${this.dynamicStyle}
            .fields=${this.fields}
            .baseShow=${this.baseShow}
            .baseOpacity=${this.baseOpacity}
            .baseImage=${this.baseImage}
            .label=${localize('editor.dynamic_style.title')}
          ></compass-card-dynamic-style-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _formChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    fireEvent(this, 'part-changed', { value: ev.detail.value });
  }

  static styles = css`
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
