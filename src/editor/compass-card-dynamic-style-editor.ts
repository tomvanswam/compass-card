import { CCDynamicStyleConfig, CCStyleBandConfig } from './editorTypes';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { mdiClose, mdiPlus } from '@mdi/js';
import { INDEX_ELEMENT_1 } from '../const';
import { localize } from '../localize/localize';
import { updateObject } from './editorHelpers';

// Style options a band (or the unknown style) can set; each element only offers the ones the card uses for it
export type StyleField = 'background_image' | 'color' | 'image' | 'opacity' | 'radius' | 'show' | 'size';
type StyleConfig = Omit<CCStyleBandConfig, 'from_value'>;

// show is a three-way choice: unset (inherit from the previous band / element), show or hide
const SHOW = 'show';
const HIDE = 'hide';
const FIRST_BAND_VALUE = 0;
const BAND_VALUE_STEP = 1;

function fieldSchema(field: StyleField) {
  switch (field) {
    case 'show':
      return { name: field, selector: { select: { mode: 'dropdown', options: [SHOW, HIDE].map((value) => ({ label: localize(`editor.dynamic_style.visibility.${value}`), value })) } } };
    case 'opacity':
      return { name: field, selector: { number: { max: 1, min: 0, mode: 'box', step: 0.05 } } };
    case 'radius':
      return { name: field, selector: { number: { min: 0, mode: 'box' } } };
    case 'size':
      return { name: field, selector: { number: { min: 1, mode: 'box' } } };
    default:
      return { name: field, selector: { text: {} } };
  }
}

function toFormStyle(style: StyleConfig | undefined) {
  return { ...style, show: style?.show === undefined ? undefined : style.show ? SHOW : HIDE };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromFormStyle(data: Record<string, any>, fields: StyleField[], previous: StyleConfig | undefined): StyleConfig | undefined {
  const updates: Partial<StyleConfig> = {};
  fields.forEach((field) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updates as any)[field] = field === 'show' ? (data.show ? data.show === SHOW : undefined) : data[field];
  });
  return updateObject(previous, updates);
}

declare global {
  interface HTMLElementTagNameMap {
    'compass-card-dynamic-style-editor': CompassCardDynamicStyleEditor;
  }
}

/**
 * Edits a dynamic_style object: the entity (and attribute) whose value selects the style, the bands
 * (from_value plus style options; the card sorts them by from_value) and the style for an unknown value.
 * Fires 'dynamic-style-changed' with the new dynamic_style, or undefined when nothing is configured.
 */
@customElement('compass-card-dynamic-style-editor')
export class CompassCardDynamicStyleEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCDynamicStyleConfig;
  @property({ attribute: false }) public fields: StyleField[] = ['color', 'show'];
  @property() public label?: string;

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    const bands = this.config?.bands || [];
    const styleSchema = this.fields.map(fieldSchema);

    return html`
      <ha-expansion-panel outlined .header=${this.label}>
        <div class="content">
          <ha-form
            .hass=${this.hass}
            .data=${{ attribute: this.config?.attribute || '', sensor: this.config?.sensor || '' }}
            .schema=${[
              { name: 'sensor', selector: { entity: {} } },
              { name: 'attribute', selector: { attribute: { entity_id: this.config?.sensor } } },
            ]}
            .computeLabel=${CompassCardDynamicStyleEditor._computeLabel}
            .computeHelper=${CompassCardDynamicStyleEditor._computeHelper}
            @value-changed=${this._sourceChanged}
          ></ha-form>
          <div class="title">${localize('editor.dynamic_style.bands')}</div>
          ${bands.map(
            (band, index) => html`
              <div class="band">
                <ha-form
                  .hass=${this.hass}
                  .data=${toFormStyle(band)}
                  .schema=${[{ name: 'from_value', required: true, selector: { number: { mode: 'box' } } }, ...styleSchema]}
                  .computeLabel=${CompassCardDynamicStyleEditor._computeLabel}
                  @value-changed=${(ev: CustomEvent) => this._bandChanged(index, ev)}
                ></ha-form>
                <ha-icon-button .label=${localize('editor.dynamic_style.remove_band')} .path=${mdiClose} @click=${() => this._removeBand(index)}></ha-icon-button>
              </div>
            `,
          )}
          <ha-button @click=${this._addBand}>
            <ha-svg-icon slot="start" .path=${mdiPlus}></ha-svg-icon>
            ${localize('editor.dynamic_style.add_band')}
          </ha-button>
          <div class="title">${localize('editor.dynamic_style.unknown')}</div>
          <ha-form
            .hass=${this.hass}
            .data=${toFormStyle(this.config?.unknown)}
            .schema=${styleSchema}
            .computeLabel=${CompassCardDynamicStyleEditor._computeLabel}
            @value-changed=${this._unknownChanged}
          ></ha-form>
        </div>
      </ha-expansion-panel>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel(schema: any): string {
    return localize(`editor.dynamic_style.${schema.name}`) || schema.name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeHelper(schema: any): string {
    return schema.name === 'sensor' ? localize('editor.dynamic_style.sensor_helper') : '';
  }

  private _update(changes: Partial<CCDynamicStyleConfig>): void {
    const next: CCDynamicStyleConfig = { bands: [], sensor: '', ...this.config, ...changes };
    if (!next.attribute) delete next.attribute;
    if (!next.unknown) delete next.unknown;
    const isEmpty = !next.sensor && !next.attribute && !next.bands.length && !next.unknown;
    fireEvent(this, 'dynamic-style-changed', { value: isEmpty ? undefined : next });
  }

  private _sourceChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const { sensor, attribute } = ev.detail.value;
    // an attribute of the previous entity makes no sense for a new one
    const keepAttribute = sensor === this.config?.sensor;
    this._update({ attribute: keepAttribute ? attribute : undefined, sensor: sensor || '' });
  }

  private _bandChanged(index: number, ev: CustomEvent): void {
    ev.stopPropagation();
    const bands = [...(this.config?.bands || [])];
    const style = fromFormStyle(ev.detail.value, this.fields, bands[index]);
    bands[index] = { ...style, from_value: ev.detail.value.from_value ?? bands[index].from_value };
    this._update({ bands });
  }

  private _addBand(): void {
    const bands = this.config?.bands || [];
    const highest = bands.length ? Math.max(...bands.map((band) => band.from_value)) + BAND_VALUE_STEP : FIRST_BAND_VALUE;
    this._update({ bands: [...bands, { from_value: highest }] });
  }

  private _removeBand(index: number): void {
    const bands = [...(this.config?.bands || [])];
    bands.splice(index, INDEX_ELEMENT_1);
    this._update({ bands });
  }

  private _unknownChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._update({ unknown: fromFormStyle(ev.detail.value, this.fields, this.config?.unknown) });
  }

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px 0;
    }
    .title {
      font-weight: 500;
      margin-top: 8px;
    }
    .band {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--divider-color);
    }
    .band ha-form {
      flex-grow: 1;
    }
    ha-button {
      align-self: flex-start;
    }
  `;
}
