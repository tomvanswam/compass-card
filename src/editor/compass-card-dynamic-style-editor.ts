import { CCDynamicStyleConfig, CCStyleBandConfig } from './editorTypes';
import { contentStyles, opacityFromPercent, opacitySelector, opacityToPercent, setOrDelete, updateObject } from './editorHelpers';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, INDEX_ELEMENT_1, OPACITY_VISIBLE } from '../const';
import { HaFormData, HaFormSchemaItem, HaFormValueChanged } from './haTypes';
import { imageData, imageFromData, imageSchema, imageType } from './imageForm';
import { mdiClose, mdiPlus } from '@mdi/js';
import { fireEvent } from '../utils/events';
import { HomeAssistant } from '../utils/ha-helpers';
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
      return { name: field, selector: { number: { min: 0, mode: 'box' } } };
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

// Effective style options: of the element itself (StyleBase) or what a band inherits from the band before it
export interface StyleBase {
  background_image?: string;
  color?: string;
  image?: string;
  opacity?: number;
  radius?: number;
  show: boolean;
  size?: number;
}
type Inherited = StyleBase;

// Options inherited the way getBands() in objectHelpers.ts does: a band's own value, else the previous effective value
function nextInherited(previous: Inherited, style: StyleConfig): Inherited {
  return {
    background_image: style.background_image || previous.background_image,
    color: style.color || previous.color,
    image: style.image || previous.image,
    opacity: style.opacity ?? previous.opacity,
    radius: style.radius ?? previous.radius,
    show: style.show ?? previous.show,
    size: style.size ?? previous.size,
  };
}

// Image type shown for a style: its own image, else a type picked while its icon/URL is still empty, else the inherited image
function styleImageType(style: StyleConfig | undefined, inherited: Inherited, chosenType: string | undefined): string {
  return imageType(style?.image || (chosenType ? undefined : inherited.image), chosenType);
}

// Options a style does not set are inherited from the previous band (or the element itself); the form shows those values
function toFormStyle(style: StyleConfig | undefined, inherited: Inherited, type: string) {
  const effective = nextInherited(inherited, style || {});
  const image = style?.image || (imageType(inherited.image) === type ? inherited.image : undefined);
  return { ...effective, ...style, ...imageData(image, type), opacity: opacityToPercent(effective.opacity) };
}

// followInherited: leave values equal to the inherited ones out (unknown style); bands store their values explicitly
function fromFormStyle(data: HaFormData, fields: StyleField[], previous: StyleConfig | undefined, inherited: Inherited, followInherited: boolean): StyleConfig | undefined {
  const updates: Partial<StyleConfig> = {};
  fields.forEach((field) => {
    let value = data[field];
    if (field === 'opacity') value = opacityFromPercent(data.opacity, previous?.opacity ?? inherited.opacity);
    if (field === 'image') value = imageFromData(data);
    (updates as Record<string, unknown>)[field] = value;
  });
  return updateObject(previous, updates, followInherited ? inherited : {});
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
  // Effective options of the element without dynamic style: the start values for the first band and the unknown style
  @property({ attribute: false }) public base: StyleBase = { show: true };
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
                  @value-changed=${(ev: HaFormValueChanged) => this._bandChanged(index, ev)}
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

  private static _computeLabel(schema: HaFormSchemaItem): string {
    return localize(`editor.dynamic_style.${schema.name}`) || localize(`editor.sensor_config.${schema.name}`) || schema.name;
  }

  private _type(key: string, style: StyleConfig | undefined, inherited: Inherited): string {
    return styleImageType(style, inherited, this._imageTypes[key]);
  }

  private _rememberType(key: string, data: HaFormData): void {
    if (this.fields.includes('image') && data.indicator) {
      this._imageTypes = { ...this._imageTypes, [key]: data.indicator };
    }
  }

  // The element's own values, inherited by the first band and by the unknown style
  private _base(): Inherited {
    return { image: DEFAULT_ICON_VALUE, opacity: OPACITY_VISIBLE, ...this.base };
  }

  // What each band inherits, per index in the config's band order (bands apply in from_value order, as in getBands())
  private _inherited(bands: CCStyleBandConfig[]): Inherited[] {
    const order = bands.map((band, index) => ({ band, index })).sort((a, b) => a.band.from_value - b.band.from_value);
    const inherited: Inherited[] = [];
    let previous = this._base();
    order.forEach(({ band, index }) => {
      inherited[index] = previous;
      previous = nextInherited(previous, band);
    });
    return inherited;
  }

  // Effective options after all bands: what a band added with the highest from_value starts with
  private _lastEffective(bands: CCStyleBandConfig[]): Inherited {
    return [...bands].sort((a, b) => a.from_value - b.from_value).reduce(nextInherited, this._base());
  }

  private _update(changes: Partial<CCDynamicStyleConfig>): void {
    const next: CCDynamicStyleConfig = { ...this.config, ...changes };
    if (!next.bands?.length) delete next.bands;
    if (!next.sensor) delete next.sensor;
    if (!next.attribute) delete next.attribute;
    if (!next.unknown) delete next.unknown;
    const isEmpty = !next.sensor && !next.attribute && !next.bands && !next.unknown;
    fireEvent(this, 'dynamic-style-changed', { value: isEmpty ? undefined : next });
  }

  private _sourceChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    const { sensor, attribute } = ev.detail.value;
    // an attribute of the previous entity makes no sense for a new one
    const keepAttribute = sensor === this.config?.sensor;
    this._update({ attribute: keepAttribute ? attribute : undefined, sensor: sensor || undefined });
  }

  private _bandChanged(index: number, ev: HaFormValueChanged): void {
    ev.stopPropagation();
    const bands = [...(this.config?.bands || [])];
    this._rememberType(String(index), ev.detail.value);
    const style = fromFormStyle(ev.detail.value, this.fields, bands[index], this._inherited(bands)[index], false);
    bands[index] = { ...style, from_value: ev.detail.value.from_value ?? bands[index].from_value };
    this._update({ bands });
  }

  // A new band gets the highest from_value and starts with the effective values of the band before it (or of the element)
  private _addBand(): void {
    const bands = this.config?.bands || [];
    const highest = bands.length ? Math.max(...bands.map((band) => band.from_value)) + BAND_VALUE_STEP : FIRST_BAND_VALUE;
    const effective = this._lastEffective(bands);
    const band: CCStyleBandConfig = { from_value: highest };
    this.fields.forEach((field) => setOrDelete(band as Record<string, unknown>, field, effective[field]));
    this._update({ bands: [...bands, band] });
  }

  private _removeBand(index: number): void {
    const bands = [...(this.config?.bands || [])];
    bands.splice(index, INDEX_ELEMENT_1);
    this._imageTypes = {};
    this._update({ bands });
  }

  private _unknownChanged(ev: HaFormValueChanged): void {
    ev.stopPropagation();
    this._rememberType('unknown', ev.detail.value);
    this._update({ unknown: fromFormStyle(ev.detail.value, this.fields, this.config?.unknown, this._base(), true) });
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
