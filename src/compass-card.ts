import './editor.js';
import * as MDI from '@mdi/js';
import { assert, StructError } from 'superstruct';
import { CARD_VERSION, CENTER_OBJECT_FACTOR, CIRCLE, COMPASS_ABBREVIATIONS, COMPASS_POINTS, DEFAULT_CARD_SIZE, DEFAULT_ICON_VALUE, DEFAULT_SECTIONS_SIZE, DEGREES_MAX, DEGREES_MIN, DEGREES_ONE, DEGREES_PER_ABBREVIATION, ICON_VALUES, INDEX_ELEMENT_0, LENGTH_TO_INDEX, NO_ELEMENTS, RADIUS_TO_DIAMETER_FACTOR, SVG_SCALE_MAX, SVG_SCALE_MIN, UNAVAILABLE } from './const.js';
import { CCCircle, CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicator, CCIndicatorSensor, CCProperties, CCValue, CCValueSensor } from './cardTypes.js';
import { CompassCardConfig, CompassCardConfigStruct } from './editorTypes.js';
import { CSSResult, html, LitElement, PropertyValues, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { findValues, getBoolean, getCompass, getHeader, getIndicatorSensors, getValueSensors, isNumeric, resolveAttrPath } from './utils/objectHelpers.js';
import { getLovelace, HomeAssistant, LovelaceCard, LovelaceCardEditor } from 'custom-card-helpers';
import handleClick from './utils/handleClick.js';
import { HassEntities } from 'home-assistant-js-websocket';
import { localize } from './localize/localize.js';
import style from './style.js';

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview: boolean }>;
    loadCardHelpers: () => unknown;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'compass-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

console.info(`%c COMPASS-CARD %c ${CARD_VERSION} `, 'color: white; background: coral; font-weight: 700;', 'color: coral; background: white; font-weight: 700;'); // eslint-disable-line

window.customCards = window.customCards || [];
window.customCards.push({
  description: localize('common.description'),
  name: 'Compass Card',
  preview: true,
  type: 'compass-card',
});

@customElement('compass-card')
export class CompassCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('compass-card-editor');
  }

  public static getStubConfig(): CompassCardConfig {
    return {
      indicator_sensors: [
        {
          attribute: 'azimuth',
          indicator: { image: DEFAULT_ICON_VALUE },
          sensor: 'sun.sun',
        },
      ],
      type: 'custom:compass-card',
    };
  }

  @property({ attribute: false }) public _hass!: HomeAssistant;
  @property({ attribute: false }) protected _config!: CompassCardConfig;
  @state() protected colors!: CCColors;
  @state() protected header!: CCHeader;
  @state() protected compass!: CCCompass;
  @state() protected indicatorSensors!: CCIndicatorSensor[];
  @state() protected entities: HassEntities = {};
  @state() protected valueSensors!: CCValueSensor[];
  @property({ attribute: false }) protected svgScale!: number;

  public setConfig(config: CompassCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.indicator_sensors || !config.indicator_sensors[0].sensor) {
      throw new Error(localize('common.missing_direction_entity'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }
    try {
      assert(config, CompassCardConfigStruct);
    } catch (e) {
      const err = e as StructError;
      const [last, secondLast] = [...err.path].reverse();
      if (last === 'type' && secondLast === 'indicator') {
        throw new Error(
          `Compass Card: incompatible v2.0.0+ configuration. 
          Edit this card in code editor (YAML mode) and replace 'type' with 'image' for indicator sensor indicators to fix this error. More info: https://github.com/tomvanswam/compass-card/wiki/Upgrade-from-version-v2.x.x-to-v3.0.0#indicator-type-becomes-indicator-image`,
        );
      }
      if (last === 'image' && secondLast === 'indicator') {
        throw new Error(
          `Compass Card: ${err.path.join('.')} should be either ${ICON_VALUES.join(', ')}, an mdi: icon (e.g. mdi:compass) or an image URL (e.g. https://example.com/image.png or /local/image.png). More info: https://github.com/tomvanswam/compass-card/wiki/YAML-configuration#indicator-object`,
        );
      }
      throw new Error(`Compass Card: invalid yaml configuration. ${err.message} More info: https://github.com/tomvanswam/compass-card/wiki/YAML-configuration`);
    }

    this.colors = {
      accent: 'var(--accent-color)',
      primary: 'var(--primary-color)',
      primaryText: 'var(--primary-text-color)',
      secondaryText: 'var(--secondary-text-color)',
      stateIcon: 'var(--state-icon-color)',
    };

    this._config = {
      ...config,
    };

    this.updateConfig(this._hass, this._config);
  }

  public getCardSize(): number {
    return DEFAULT_CARD_SIZE + +this.showHeader();
  }

  public getLayoutOptions() {
    return {
      grid_columns: DEFAULT_SECTIONS_SIZE.COLUMNS_DEFAULT,
      grid_min_columns: DEFAULT_SECTIONS_SIZE.COLUMNS_MIN,
      grid_min_rows: DEFAULT_SECTIONS_SIZE.ROWS_MIN,
      grid_rows: DEFAULT_SECTIONS_SIZE.ROWS_DEFAULT + +this.showHeader(),
    };
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.updateConfig(this._hass, this._config);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }
    if (changedProps.has('_hass')) {
      const newHass = changedProps.get('_hass') as HomeAssistant;
      for (const entity in this.entities) {
        if (newHass.states[entity].last_updated !== this._hass.states[entity].last_updated) {
          return true;
        }
      }
    }
    return false;
  }

  private updateConfig(hass: HomeAssistant, config: CompassCardConfig): void {
    if (!hass || !config) {
      return;
    }
    const stringEntities = findValues(this._config, hass.states, getBoolean(this._config.debug, false));
    stringEntities.forEach((stringEntity) => {
      if (this._hass.states[stringEntity]) {
        const entity = this._hass.states[stringEntity];
        this.entities[entity.entity_id] = this._hass.states[stringEntity];
      }
    });
    this.header = getHeader(this._config, this.colors, this.entities[this._config?.indicator_sensors[0].sensor], this.entities);
    this.compass = getCompass(this._config, this.colors, this.entities);
    this.indicatorSensors = getIndicatorSensors(this._config, this.colors, this.entities);
    this.valueSensors = getValueSensors(this._config, this.colors, this.entities);
    this.svgScale = this.compass.scale === SVG_SCALE_MIN ? Math.min(...this.indicatorSensors.map((is) => (is.indicator.scale === SVG_SCALE_MIN ? SVG_SCALE_MAX : is.indicator.scale))) : this.compass.scale;
    if (getBoolean(this._config.debug, false)) {
      console.info('Compass-Card inflated configuration: header', this.header); // eslint-disable-line
      console.info('Compass-Card inflated configuration: compass', this.compass); // eslint-disable-line
      console.info('Compass-Card inflated configuration: indicator sensors', this.indicatorSensors); //eslint-disable-line
      console.info('Compass-Card inflated configuration: value sensors', this.valueSensors); //eslint-disable-line
      console.info('Compass-Card configuration: listening to entities', this.entities); // eslint-disable-line
      console.info('Compass-Card configuration: svgScale', this.svgScale); // eslint-disable-line
    }
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <ha-card tabindex="0" .label=${`Compass: ${this.header.label}`} class="flex compass-card" @click=${(e) => this.handlePopup(e)}>
        ${this.showHeader() ? this.renderHeader() : ''}
        <div class="compass">${this.svgCompass(this.compass.north.offset)}</div>
        <div class="sensors">${this.renderDirections()} ${this.renderValues()}</div>
      </ha-card>
    `;
  }

  private showHeader(): boolean {
    return this.getVisibility(this.header.title) || this.getVisibility(this.header.icon);
  }

  /**
   * Render Header (title and icon on top of card)
   */

  private renderHeader(): TemplateResult {
    return html`
      <div class="header">
        <div class="name" style="--compass-card-header-title-color: ${this.getColor(this.header.title)};">
          ${this.getVisibility(this.header.title) ? this.renderTitle() : html`<span>&nbsp;</span>`}
        </div>
        <div class="icon" style="--compass-card-header-icon-color: ${this.getColor(this.header.icon)};">
          ${this.getVisibility(this.header.icon) ? this.renderIcon() : html`<span>&nbsp;</span>`}
        </div>
      </div>
    `;
  }

  private renderTitle(): TemplateResult {
    return html`<span>${this.header.title.value} </span>`;
  }

  private renderIcon(): TemplateResult {
    return html`<ha-icon .icon=${this.header.icon.value}></ha-icon>`;
  }

  /**
   * Render Directions (abbreviation/degrees inside compass)
   */

  private renderDirections(): TemplateResult[] {
    const divs: TemplateResult[] = [];
    let index = 0;

    this.indicatorSensors.forEach((indicator) => {
      if (this.getVisibility(indicator.state_abbreviation) || this.getVisibility(indicator.state_value)) {
        divs.push(
          html`<div class="sensor-${index} indicator-sensor">
            ${this.getVisibility(indicator.state_abbreviation) ? this.getIndicatorAbbreviation(indicator) : ''}
            ${this.getVisibility(indicator.state_value) ? this.getIndicatorValue(indicator) : ''}
            ${this.getVisibility(indicator.state_units) ? this.getIndicatorUnits(indicator) : ''}
          </div>`,
        );
        index++;
      }
    });
    return divs;
  }

  private getIndicatorAbbreviation(indicator: CCIndicatorSensor): TemplateResult {
    return html`
      <span class="abbr" style="--compass-card-indicator-abbr-color: ${this.getColor(indicator.state_abbreviation)};">${this.computeIndicator(indicator).abbreviation}</span>
    `;
  }

  private getIndicatorValue(indicator: CCIndicatorSensor): TemplateResult {
    return html`
      <span class="value" style="--compass-card-indicator-value-color: ${this.getColor(indicator.state_value)};"
        >${this.computeIndicator(indicator).degrees.toFixed(indicator.decimals)}</span
      >
    `;
  }

  private getIndicatorUnits(indicator: CCIndicatorSensor): TemplateResult {
    return html` <span class="measurement" style="--compass-card-indicator-units-color: ${this.getColor(indicator.state_units)};">${indicator.units}</span> `;
  }

  /**
   * Render Values
   */

  private renderValues(): TemplateResult[] {
    const divs: TemplateResult[] = [];
    let index = 0;
    this.valueSensors.forEach((value) => {
      if (this.getVisibility(value.state_value)) {
        divs.push(
          html`<div class="sensor-${index} value-sensor">
            <span class="value" style="--compass-card-value-value-color: ${this.getColor(value.state_value)};"
              >${this.getVisibility(value.state_value) ? this.getValue(value).value : ''}</span
            >
            <span class="measurement" style="--compass-card-value-units-color: ${this.getColor(value.state_units)};"
              >${this.getVisibility(value.state_units) ? value.units : ''}</span
            >
          </div>`,
        );
        index++;
      }
    });
    return divs;
  }

  private getVisibility(properties: CCProperties): boolean {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.show;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return getBoolean(usableBands[usableBands.length + LENGTH_TO_INDEX]?.show, properties.show);
    }
    return properties.show;
  }

  private getColor(properties: CCProperties): string {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.color;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.color || properties.color;
    }
    return properties.color;
  }
  private getSize(properties: CCIndicator): number {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.size;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.size || properties.size;
    }
    return properties.size;
  }

  private getRadius(properties: CCIndicator): number {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.radius;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.radius || properties.radius;
    }
    return properties.radius;
  }

  private getOpacity(properties: CCIndicator): number {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.opacity;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.opacity || properties.opacity;
    }
    return properties.opacity;
  }

  private getBackgroundImage(properties: CCCircle): string {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.background_image;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.background_image || properties.background_image;
    }
    return properties.background_image;
  }
  /**
   * Draw compass with indicators
   */

  private svgCompass(directionOffset: number): SVGTemplateResult {
    const bg = this.getBackgroundImage(this.compass.circle);
    const imageRotate = this.compass.circle.offset_background ? directionOffset : DEGREES_MIN;
    const imgSize = CIRCLE.RADIUS * RADIUS_TO_DIAMETER_FACTOR;
    const imgX = CIRCLE.CENTER - CIRCLE.RADIUS;
    const imgY = CIRCLE.CENTER - CIRCLE.RADIUS;

    return svg`
    <svg viewbox="0 0 152 152" preserveAspectRatio="xMidYMid meet" class="compass-svg"
         style="--compass-card-svg-scale:${this.svgScale}%; --compass-card-svg-image-opacity: ${this.compass.circle.background_opacity}; --compass-circle-stroke: ${this.getColor(this.compass.circle)}; --compass-circle-stroke-width: ${this.compass.circle.stroke_width}px;">
      <defs>
        <!-- clip the image to the circle so the GIF can animate -->
        <clipPath id="imageClip">
          <circle cx="${CIRCLE.CENTER}" cy="${CIRCLE.CENTER}" r="${CIRCLE.RADIUS}" />
        </clipPath>
      </defs>

      ${bg
        ? svg`<image href="${bg}" x="${imgX}" y="${imgY}" width="${imgSize}" height="${imgSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#imageClip)" transform="rotate(${imageRotate}, ${CIRCLE.CENTER}, ${CIRCLE.CENTER})" class="compass-background" />`
        : ''
      }
      ${this.getVisibility(this.compass.circle) ? CompassCard.svgCircle(this.compass.circle.offset_background ? directionOffset : DEGREES_MIN) : ''}
        <g class="indicators" transform="rotate(${directionOffset},${CIRCLE.CENTER},${CIRCLE.CENTER})" stroke-width=".5">
          ${this.compass.north.show ? this.svgIndicatorNorth() : ''}
          ${this.compass.east.show ? this.svgIndicatorEast() : ''}
          ${this.compass.south.show ? this.svgIndicatorSouth() : ''}
          ${this.compass.west.show ? this.svgIndicatorWest() : ''}
          ${this.svgIndicators()}
        </g>
    </svg>
    `;
  }

  private static svgCircle(directionOffset: number): SVGTemplateResult {
    return svg`<circle class="circle" cx="${CIRCLE.CENTER}" cy="${CIRCLE.CENTER}" r="${CIRCLE.RADIUS}" transform="rotate(${directionOffset},${CIRCLE.CENTER},${CIRCLE.CENTER})" />`;
  }

  private svgIndicators(): SVGTemplateResult[] {
    const result: SVGTemplateResult[] = [];
    this.indicatorSensors.forEach((indicatorSensor, index) => {
      if (this.getVisibility(indicatorSensor.indicator)) {
        result.push(this.svgSingleIndicator(indicatorSensor, index));
      }
    });
    return result;
  }

  private getIndicatorImage(properties: CCIndicator): string {
    if (properties.dynamic_style.bands.length === NO_ELEMENTS) {
      return properties.image;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length + LENGTH_TO_INDEX]?.image || properties.image;
    }
    return properties.image;
  }

  private svgIndicator(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const img = this.getIndicatorImage(indicatorSensor.indicator);
    switch (img) {
      case 'arrow_outward':
        return CompassCard.svgIndicatorArrowOutward();
      case 'arrow_inward':
        return CompassCard.svgIndicatorArrowInward();
      case 'circle':
        return CompassCard.svgIndicatorCircle();
      default:
        if (img.startsWith('mdi:')) {
          return this.svgIndicatorMdi(indicatorSensor);
        }
        // else its an external image
        return this.svgIndicatorImg(indicatorSensor);
    }
  }

  private svgSingleIndicator(indicatorSensor: CCIndicatorSensor, index = INDEX_ELEMENT_0): SVGTemplateResult {
    const indicatorPath = this.svgIndicator(indicatorSensor);
    const { degrees } = this.computeIndicator(indicatorSensor);

    // set per-indicator color via CSS variable so presentational attributes move to CSS
    return svg`
      <g class="indicator-${index}" transform="rotate(${degrees},${CIRCLE.CENTER},${CIRCLE.CENTER})" style="--compass-card-indicator-color: ${this.getColor(indicatorSensor.indicator)}; --compass-card-indicator-opacity: ${this.getOpacity(indicatorSensor.indicator)}">
        ${indicatorPath}
      </g>
    `;
  }

  private static svgIndicatorArrowOutward(): SVGTemplateResult {
    return svg`
      <g class="arrow-outward">
        <path d="M${CIRCLE.CENTER} 0v23l-8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
  }

  private static svgIndicatorArrowInward(): SVGTemplateResult {
    return svg`
      <g class="arrow-inward">
        <path d="M${CIRCLE.CENTER} 30.664v-23l-8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
  }

  private static svgIndicatorCircle(): SVGTemplateResult {
    return svg`
      <g class="circle-indicator">
        <path d="m${CIRCLE.CENTER} 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="white" opacity="0.5"/>
      </g>
    `;
  }

  // svg indicator is using pure SVG to avoid issues in iOS  (no foreignObject ha-icon)
  private svgIndicatorMdi(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const MDI_MAP: Record<string, string> = MDI as unknown as Record<string, string>;
    const MDI_BOX_MIN_SIZE = 24;
    const ICON_PREFIX = 'mdi:';
    const PREFIX_LENGTH = ICON_PREFIX.length;
    const FIRST_CHAR_INDEX = 0;
    const CHARS_AFTER_FIRST = 1;

    const toPascal = (s: string) =>
      s
        .split('-')
        .map((p) => p[FIRST_CHAR_INDEX]?.toUpperCase() + p.slice(CHARS_AFTER_FIRST))
        .join('');

    const mdiPath = (icon: string): string | null => {
      if (!icon?.startsWith(ICON_PREFIX)) return null;
      const key = `mdi${toPascal(icon.slice(PREFIX_LENGTH))}`;
      return MDI_MAP[key] ?? null;
    };
    const icon_v = this.getIndicatorImage(indicatorSensor.indicator) as string;
    const d = mdiPath(icon_v) ?? MDI.mdiCompass;
    const size = this.getSize(indicatorSensor.indicator);
    const r = this.getRadius(indicatorSensor.indicator);
    const opacity = this.getOpacity(indicatorSensor.indicator);
    const box = Math.max(size, MDI_BOX_MIN_SIZE);

    // anchor point on circle
    const ax = CIRCLE.CENTER;
    const ay = CIRCLE.CENTER - r;

    // scale MDI's 24x24 viewBox to requested size
    const s = size / MDI_BOX_MIN_SIZE;

    return svg`
      <svg x=${ax - box * CENTER_OBJECT_FACTOR} y=${ay - box * CENTER_OBJECT_FACTOR} width=${box} height=${box} viewBox="0 0 ${box} ${box}" overflow="visible">
        <g transform="translate(${box * CENTER_OBJECT_FACTOR}, ${box * CENTER_OBJECT_FACTOR}) scale(${s}) translate(-12, -12)">
          <path d=${d} fill="var(--compass-card-indicator-color)" opacity=${opacity}/>
        </g>
      </svg>
    `;
  }

  private svgIndicatorImg(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const icon_v = this.getIndicatorImage(indicatorSensor.indicator) as string;
    const size = this.getSize(indicatorSensor.indicator);
    const r = this.getRadius(indicatorSensor.indicator);
    const opacity = this.getOpacity(indicatorSensor.indicator);
    const box = size;
    const x = CIRCLE.CENTER - box * CENTER_OBJECT_FACTOR;
    const y = CIRCLE.CENTER - r - box * CENTER_OBJECT_FACTOR;

    return svg`
      <image 
        href=${icon_v} 
        x=${x} 
        y=${y} 
        width=${box} 
        height=${box} 
        preserveAspectRatio="xMidYMid meet"
        opacity=${opacity}
      />
    `;
  }

  private svgIndicatorNorth(): SVGTemplateResult {
    return svg`
      <g class="dir-text north">
        <text class="dir-text north-text" x="${CIRCLE.CENTER}" y="10.089" style="--compass-card-dir-text-color: ${this.getColor(this.compass.north)}">
          <tspan x="${CIRCLE.CENTER}" y="11">${localize('directions.N', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorEast(): SVGTemplateResult {
    return svg`
      <g class="dir-text east">
        <text class="dir-text east-text" x="140" y="80.089" style="--compass-card-dir-text-color: ${this.getColor(this.compass.east)}">
          <tspan x="140" y="81">${localize('directions.E', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorSouth(): SVGTemplateResult {
    return svg`
      <g class="dir-text south">
        <text class="dir-text south-text" x="${CIRCLE.CENTER}" y="150.089" style="--compass-card-dir-text-color: ${this.getColor(this.compass.south)}">
          <tspan x="${CIRCLE.CENTER}" y="151">${localize('directions.S', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorWest(): SVGTemplateResult {
    return svg`
      <g class="dir-text west">
        <text class="dir-text west-text" x="-2" y="80.089" style="--compass-card-dir-text-color: ${this.getColor(this.compass.west)}">
          <tspan x="-2" y="81">${localize('directions.W', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private getValue(entity: CCEntity): CCValue {
    const ENTITY_PATH_PARTS = 2;
    const ATTRIBUTE_PATH_START_INDEX = 2;

    if (entity.is_attribute) {
      const entityStr = entity.sensor
        .split('.')
        .slice(INDEX_ELEMENT_0, ENTITY_PATH_PARTS)
        .join('.');
      const entityObj = this.entities[entityStr];
      if (entityObj && entityObj.attributes) {
        const attribStr = entity.sensor
          .split('.')
          .slice(ATTRIBUTE_PATH_START_INDEX)
          .join('.');
        const value = resolveAttrPath(entityObj.attributes, attribStr) || UNAVAILABLE;
        return {
          units: entity.units,
          value: isNumeric(value) ? Number(value).toFixed(entity.decimals) : value,
        };
      }
      return { units: entity.units, value: UNAVAILABLE };
    }
    const value = this.entities[entity.sensor]?.state || UNAVAILABLE;
    return {
      units: entity.units,
      value: isNumeric(value) ? Number(value).toFixed(entity.decimals) : value,
    };
  }

  private handlePopup(e: { stopPropagation: () => void; }) {
    e.stopPropagation();
    if (this._config.tap_action) {
      handleClick(this, this._hass, this._config, this._config.tap_action);
    }
  }

  private computeIndicator(entity: CCEntity): CCDirectionInfo {
    let degrees: number;
    let abbreviation: string | number;

    /* The direction entity may either return degrees or a named abbreviations, thus
           determine the degrees and abbreviation with whichever data was returned. */
    const directionStr = this.getValue(entity);

    if (Number.isNaN(Number(directionStr.value))) {
      degrees = CompassCard.getDegrees(directionStr.value);
      if (degrees === (DEGREES_MIN - DEGREES_ONE)) {
        const matches = directionStr.value.replace(/\s+/g, '').match(/[+-]?\d+(?:\.\d)?/);
        if (matches?.length) {
          degrees = CompassCard.positiveDegrees(parseFloat(matches[0]));
        } else {
          degrees = DEGREES_MIN;
        }
        abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
      } else {
        abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
      }
    } else {
      degrees = CompassCard.positiveDegrees(parseFloat(directionStr.value));
      abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
    }
    return { abbreviation, degrees: Math.round(degrees) };
  }

  static get styles(): CSSResult {
    return style;
  }

  static getDegrees(abbrevation: string): number {
    const key = abbrevation.toUpperCase() as keyof typeof COMPASS_POINTS;
    if (COMPASS_POINTS[key] !== undefined) {
      return COMPASS_POINTS[key];
    }
    return (DEGREES_MIN - DEGREES_ONE);
  }

  static getCompassAbbreviation(degrees: number, language: string | undefined): string {
    const index = Math.round(CompassCard.positiveDegrees(degrees) / DEGREES_PER_ABBREVIATION);
    let string: string;
    string = COMPASS_ABBREVIATIONS[index];
    if (index >= COMPASS_ABBREVIATIONS.length) {
      const [first] = COMPASS_ABBREVIATIONS;
      string = first;
    }
    return localize(`directions.${string}`, '', '', language);
  }

  static positiveDegrees(degrees: number): number {
    return degrees < DEGREES_MIN ? degrees + (Math.abs(Math.ceil(degrees / DEGREES_MAX)) + DEGREES_ONE) * DEGREES_MAX : degrees % DEGREES_MAX;
  }
}
