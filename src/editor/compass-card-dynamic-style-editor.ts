import { CCDynamicStyleConfig, CCStyleBandConfig } from './editorTypes';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { INDEX_ELEMENT_1, OPACITY_VISIBLE } from '../const';
import { mdiClose, mdiPlus } from '@mdi/js';
import { opacityFromPercent, opacitySelector, opacityToPercent, updateObject } from './editorHelpers';
import { localize } from '../localize/localize';

// Style options a band (or the unknown style) can set; each element only offers the ones the card uses for it
export type StyleField = 'background_image' | 'color' | 'image' | 'opacity' | 'radius' | 'show' | 'size';
type StyleConfig = Omit<CCStyleBandConfig, 'from_value'>;

const FIRST_BAND_VALUE = 0;
const BAND_VALUE_STEP = 1;

function fieldSchema(field: StyleField) {
  switch (field) {
    case 'show':
      return { name: field, selector: { boolean: {} } };
    case 'opacity':
      return { name: field, selector: opacitySelector() };
    case 'radius':
      return { name: field, selector: { number: { min: 0, mode: 'box' } } };
    case 'size':
      return { name: field, selector: { number: { min: 1, mode: 'box' } } };
    default:
      return { name: field, selector: { text: {} } };
  }
}

// Visibility switch with the color to its right, like the regular settings; other fields below
function styleSchema(fields: StyleField[]) {
  const row = (['show', 'color'] as StyleField[]).filter((field) => fields.includes(field));
  const rest = fields.filter((field) => !row.includes(field));
  return [...(row.length ? [{ column_min_width: '120px', name: '', schema: row.map(fieldSchema), type: 'grid' }] : []), ...rest.map(fieldSchema)];
}

// What a band (or the unknown style) inherits for options it does not set itself
interface Inherited {
  opacity: number;
  show: boolean;
}

// A missing show or opacity inherits from the previous band (or the element itself); the form shows that value
function toFormStyle(style: StyleConfig | undefined, inherited: Inherited) {
  return { ...style, opacity: opacityToPercent(style?.opacity || inherited.opacity), show: style?.show ?? inherited.show };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromFormStyle(data: Record<string, any>, fields: StyleField[], previous: StyleConfig | undefined, inherited: Inherited): StyleConfig | undefined {
  const updates: Partial<StyleConfig> = {};
  fields.forEach((field) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updates as any)[field] = field === 'opacity' ? opacityFromPercent(data.opacity, previous?.opacity || inherited.opacity) : data[field];
  });
  // a visibility equal to the inherited one is left out, so the band keeps following it
  return updateObject(previous, updates, { opacity: inherited.opacity, show: inherited.show });
}

declare global {
  interface HTMLElementTagNameMap {
    'compass-card-dynamic-style-editor': CompassCardDynamicStyleEditor;
  }
}

/**
 * Edits a dynamic_style object: the entity (and attribute) whose value selects the style, the style for an
 * unknown value and the bands (from_value plus style options; the card sorts them by from_value).
 * Fires 'dynamic-style-changed' with the new dynamic_style, or undefined when nothing is configured.
 */
@customElement('compass-card-dynamic-style-editor')
export class CompassCardDynamicStyleEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: CCDynamicStyleConfig;
  @property({ attribute: false }) public fields: StyleField[] = ['color', 'show'];
  // Effective visibility of the element without dynamic style, the starting point bands inherit from
  @property({ attribute: false }) public baseShow = true;
  // Effective opacity of the element without dynamic style (only used when the fields include opacity)
  @property({ attribute: false }) public baseOpacity = OPACITY_VISIBLE;
  @property() public label?: string;

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    const bands = this.config?.bands || [];
    const schema = styleSchema(this.fields);
    const inherited = this._inherited(bands);

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
          <div class="title">${localize('editor.dynamic_style.unknown')}</div>
          <ha-form
            .hass=${this.hass}
            .data=${toFormStyle(this.config?.unknown, this._base())}
            .schema=${schema}
            .computeLabel=${CompassCardDynamicStyleEditor._computeLabel}
            @value-changed=${this._unknownChanged}
          ></ha-form>
          <div class="title">${localize('editor.dynamic_style.bands')}</div>
          ${bands.map(
            (band, index) => html`
              <div class="band">
                <ha-form
                  .hass=${this.hass}
                  .data=${toFormStyle(band, inherited[index])}
                  .schema=${[{ name: 'from_value', required: true, selector: { number: { mode: 'box' } } }, ...schema]}
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

  // The element's own values, inherited by the first band and by the unknown style
  private _base(): Inherited {
    return { opacity: this.baseOpacity, show: this.baseShow };
  }

  // What each band inherits, per index in the config's band order (bands apply in from_value order, as in getBands())
  private _inherited(bands: CCStyleBandConfig[]): Inherited[] {
    const order = bands.map((band, index) => ({ band, index })).sort((a, b) => a.band.from_value - b.band.from_value);
    const inherited: Inherited[] = [];
    let previous = this._base();
    order.forEach(({ band, index }) => {
      inherited[index] = previous;
      previous = { opacity: band.opacity || previous.opacity, show: band.show ?? previous.show };
    });
    return inherited;
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
    const style = fromFormStyle(ev.detail.value, this.fields, bands[index], this._inherited(bands)[index]);
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
    this._update({ unknown: fromFormStyle(ev.detail.value, this.fields, this.config?.unknown, this._base()) });
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
