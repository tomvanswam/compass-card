import { CCDynamicStyleConfig, CCStyleBandConfig } from './editorTypes';
import { contentStyles, opacityFromPercent, opacitySelector, opacityToPercent, updateObject } from './editorHelpers';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, INDEX_ELEMENT_1, OPACITY_VISIBLE } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { imageData, imageFromData, imageSchema, imageType } from './imageForm';
import { mdiClose, mdiPlus } from '@mdi/js';
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

// Visibility switch with the color to its right, like the regular settings; then the other fields, size and radius on one row.
// The indicator image uses the same type selection as the indicator settings (imageForm.ts).
function styleSchema(fields: StyleField[], type: string) {
  // fields shown side by side: show + color, and size + radius
  const rows = [['show', 'color'], ['size', 'radius']].map((row) => (row as StyleField[]).filter((field) => fields.includes(field)));
  const grid = (row: StyleField[]): object[] => (row.length ? [{ column_min_width: '120px', name: '', schema: row.map(fieldSchema), type: 'grid' }] : []);
  const rest = fields.filter((field) => !rows.flat().includes(field));
  return [...grid(rows[0]), ...rest.flatMap((field): object[] => (field === 'image' ? imageSchema(type) : [fieldSchema(field)])), ...grid(rows[1])];
}

// What a band (or the unknown style) inherits for options it does not set itself
interface Inherited {
  image: string;
  opacity: number;
  show: boolean;
}

// Image type shown for a style: its own image, else a type picked while its icon/URL is still empty, else the inherited image
function styleImageType(style: StyleConfig | undefined, inherited: Inherited, chosenType: string | undefined): string {
  return imageType(style?.image || (chosenType ? undefined : inherited.image), chosenType);
}

// A missing show or opacity inherits from the previous band (or the element itself); the form shows that value
function toFormStyle(style: StyleConfig | undefined, inherited: Inherited, type: string) {
  const image = style?.image || (imageType(inherited.image) === type ? inherited.image : undefined);
  return { ...style, ...imageData(image, type), opacity: opacityToPercent(style?.opacity || inherited.opacity), show: style?.show ?? inherited.show };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromFormStyle(data: Record<string, any>, fields: StyleField[], previous: StyleConfig | undefined, inherited: Inherited): StyleConfig | undefined {
  const updates: Partial<StyleConfig> = {};
  fields.forEach((field) => {
    let value = data[field];
    if (field === 'opacity') value = opacityFromPercent(data.opacity, previous?.opacity || inherited.opacity);
    if (field === 'image') value = imageFromData(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updates as any)[field] = value;
  });
  // values equal to the inherited ones are left out, so the band keeps following them
  return updateObject(previous, updates, { image: inherited.image, opacity: inherited.opacity, show: inherited.show });
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
  // Effective image of the indicator without dynamic style (only used when the fields include image)
  @property({ attribute: false }) public baseImage = DEFAULT_ICON_VALUE;
  // Image type picked per style ('unknown' or the band index) while its icon/URL is still empty
  @state() private _imageTypes: Record<string, string> = {};
  @property() public label?: string;
  // Helper under the entity field: which entity is used when it is left empty
  @property() public sensorHelper = '';

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    const bands = this.config?.bands || [];
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
            .computeHelper=${(schema: { name: string }) => (schema.name === 'sensor' ? this.sensorHelper : '')}
            @value-changed=${this._sourceChanged}
          ></ha-form>
          <div class="title">${localize('editor.dynamic_style.unknown')}</div>
          <ha-form
            .hass=${this.hass}
            .data=${toFormStyle(this.config?.unknown, this._base(), this._type('unknown', this.config?.unknown, this._base()))}
            .schema=${styleSchema(this.fields, this._type('unknown', this.config?.unknown, this._base()))}
            .computeLabel=${CompassCardDynamicStyleEditor._computeLabel}
            @value-changed=${this._unknownChanged}
          ></ha-form>
          <div class="title">${localize('editor.dynamic_style.bands')}</div>
          ${bands.map(
            (band, index) => html`
              <div class="band">
                <ha-form
                  .hass=${this.hass}
                  .data=${toFormStyle(band, inherited[index], this._type(String(index), band, inherited[index]))}
                  .schema=${[{ name: 'from_value', required: true, selector: { number: { mode: 'box' } } }, ...styleSchema(this.fields, this._type(String(index), band, inherited[index]))]}
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
    return localize(`editor.dynamic_style.${schema.name}`) || localize(`editor.sensor_config.${schema.name}`) || schema.name;
  }

  private _type(key: string, style: StyleConfig | undefined, inherited: Inherited): string {
    return styleImageType(style, inherited, this._imageTypes[key]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _rememberType(key: string, data: Record<string, any>): void {
    if (this.fields.includes('image') && data.indicator) {
      this._imageTypes = { ...this._imageTypes, [key]: data.indicator };
    }
  }

  // The element's own values, inherited by the first band and by the unknown style
  private _base(): Inherited {
    return { image: this.baseImage, opacity: this.baseOpacity, show: this.baseShow };
  }

  // What each band inherits, per index in the config's band order (bands apply in from_value order, as in getBands())
  private _inherited(bands: CCStyleBandConfig[]): Inherited[] {
    const order = bands.map((band, index) => ({ band, index })).sort((a, b) => a.band.from_value - b.band.from_value);
    const inherited: Inherited[] = [];
    let previous = this._base();
    order.forEach(({ band, index }) => {
      inherited[index] = previous;
      previous = { image: band.image || previous.image, opacity: band.opacity || previous.opacity, show: band.show ?? previous.show };
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
    this._rememberType(String(index), ev.detail.value);
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
    this._imageTypes = {};
    this._update({ bands });
  }

  private _unknownChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._rememberType('unknown', ev.detail.value);
    this._update({ unknown: fromFormStyle(ev.detail.value, this.fields, this.config?.unknown, this._base()) });
  }

  static styles = css`
    ${contentStyles}
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
