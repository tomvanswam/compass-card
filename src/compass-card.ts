import { LitElement, html, CSSResult, TemplateResult, PropertyValues, svg, SVGTemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { getLovelace, HomeAssistant, LovelaceCardEditor, LovelaceCard } from 'custom-card-helpers';
import { HassEntities } from 'home-assistant-js-websocket';
import { CompassCardConfig, CompassCardConfigStruct } from './editorTypes';
import { CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicatorSensor, CCValueSensor, CCValue, CCProperties, CCCircle } from './cardTypes';
import handleClick from './utils/handleClick';
import { assert, StructError } from 'superstruct';
import './editor';
import style from './style';

import { CARD_VERSION, COMPASS_ABBREVIATIONS, COMPASS_POINTS, DEFAULT_ICON_VALUE, UNAVAILABLE } from './const';

import { localize } from './localize/localize';
import { getHeader, getCompass, getIndicatorSensors, getValueSensors, getBoolean, findValues, isNumeric } from './utils/objectHelpers';

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview: boolean }>;
    loadCardHelpers;
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
  type: 'compass-card',
  name: 'Compass Card',
  preview: true,
  description: localize('common.description'),
});

@customElement('compass-card')
export class CompassCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('compass-card-editor');
  }

  public static getStubConfig(): CompassCardConfig {
    return {
      type: 'custom:compass-card',
      indicator_sensors: [
        {
          sensor: 'sun.sun',
          attribute: 'azimuth',
          indicator: { image: DEFAULT_ICON_VALUE },
        },
      ],
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
          Edit this card in code editor (YAML mode) and replace 'type' with 'image' for indicator sensor indicators to fix this error.`,
        );
      }
      throw new Error(`Compass Card: invalid yaml configuration. ${err.message}`);
    }

    this.colors = {
      accent: 'var(--accent-color)',
      primary: 'var(--primary-color)',
      stateIcon: 'var(--state-icon-color)',
      secondaryText: 'var(--secondary-text-color)',
      primaryText: 'var(--primary-text-color)',
    };

    this._config = {
      ...config,
    };

    this.updateConfig(this._hass, this._config);
  }

  public getCardSize(): number {
    return 4 + +this.showHeader();
  }

  public getLayoutOptions() {
    return {
      grid_rows: 3 + +this.showHeader(),
      grid_columns: 12,
      grid_min_rows: 1,
      grid_min_columns: 1,
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
    this.svgScale = this.compass.scale === 0 ? Math.min(...this.indicatorSensors.map((is) => (is.indicator.scale === 0 ? 100 : is.indicator.scale))) : this.compass.scale;
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
        <div class="sensors">
          <div class="indicator-sensors">${this.renderDirections()}</div>
          <div class="value-sensors">${this.renderValues()}</div>
        </div>
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
        <div class="name" style="color:${this.getColor(this.header.title)};">${this.getVisibility(this.header.title) ? this.renderTitle() : html`<span>&nbsp;</span>`}</div>
        <div class="icon" style="color:${this.getColor(this.header.icon)};">${this.getVisibility(this.header.icon) ? this.renderIcon() : html`<span>&nbsp;</span>`}</div>
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
          html`<div class="sensor-${index}">
            <span class="abbr" style="color: ${this.getColor(indicator.state_abbreviation)};"
              >${this.getVisibility(indicator.state_abbreviation) ? this.computeIndicator(indicator).abbreviation : ''}</span
            >
            <span class="value" style="color: ${this.getColor(indicator.state_value)};"
              >${this.getVisibility(indicator.state_value) ? this.computeIndicator(indicator).degrees.toFixed(indicator.decimals) : ''}</span
            >
            <span class="measurement" style="color: ${this.getColor(indicator.state_units)};">${this.getVisibility(indicator.state_units) ? indicator.units : ''}</span>
          </div>`,
        );
        index++;
      }
    });
    return divs;
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
          html`<div class="sensor-${index}">
            <span class="value" style="color: ${this.getColor(value.state_value)};">${this.getVisibility(value.state_value) ? this.getValue(value).value : ''}</span>
            <span class="measurement" style="color: ${this.getColor(value.state_units)};">${this.getVisibility(value.state_units) ? value.units : ''}</span>
          </div>`,
        );
        index++;
      }
    });
    return divs;
  }

  private getVisibility(properties: CCProperties): boolean {
    if (properties.dynamic_style.bands.length === 0) {
      return properties.show;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return getBoolean(usableBands[usableBands.length - 1]?.show, properties.show);
    }
    return properties.show;
  }

  private getColor(properties: CCProperties): string {
    if (properties.dynamic_style.bands.length === 0) {
      return properties.color;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length - 1]?.color || properties.color;
    }
    return properties.color;
  }

  private getBackgroundImage(properties: CCCircle): string {
    if (properties.dynamic_style.bands.length === 0) {
      return properties.background_image;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter((band) => band.from_value <= Number(value.value));
      return usableBands[usableBands.length - 1]?.background_image || properties.background_image;
    }
    return properties.background_image;
  }
  /**
   * Draw compass with indicators
   */

  private svgCompass(directionOffset: number): SVGTemplateResult {
    return svg`
    <svg viewbox="0 0 152 152" preserveAspectRatio="xMidYMid meet" class="compass-svg" style="--compass-card-svg-scale:${this.svgScale}%">
      <defs>
        <pattern id="image" x="0" y="0" patternContentUnits="objectBoundingBox" height="100%" width="100%">
          <image x="0" y="0" height="1" width="1" href="${this.getBackgroundImage(this.compass.circle)}" preserveAspectRatio="xMidYMid meet"></image>
        </pattern>
      </defs>
      ${this.getVisibility(this.compass.circle) ? this.svgCircle(this.compass.circle.offset_background ? directionOffset : 0) : ''}
        <g class="indicators" transform="rotate(${directionOffset},76,76)" stroke-width=".5">
          ${this.compass.north.show ? this.svgIndicatorNorth() : ''}
          ${this.compass.east.show ? this.svgIndicatorEast() : ''}
          ${this.compass.south.show ? this.svgIndicatorSouth() : ''}
          ${this.compass.west.show ? this.svgIndicatorWest() : ''}
          ${this.svgIndicators()}
        </g>
    </svg>
    `;
  }

  private svgCircle(directionOffset: number): SVGTemplateResult {
    return svg`<circle class="circle" cx="76" cy="76" r="62" stroke="${this.getColor(this.compass.circle)}" stroke-width="${this.compass.circle.stroke_width}" fill="${this.circleFill()}" fill-opacity="
      ${this.compass.circle.background_opacity}" stroke-opacity="1.0" transform="rotate(${directionOffset},76,76)" />`;
  }

  private circleFill(): string {
    return this.getBackgroundImage(this.compass.circle) === '' ? 'white' : 'url(#image)';
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

  private svgIndicator(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    switch (indicatorSensor.indicator.image) {
      case 'arrow_outward':
        return this.svgIndicatorArrowOutward(indicatorSensor);
      case 'arrow_inward':
        return this.svgIndicatorArrowInward(indicatorSensor);
      case 'circle':
        return this.svgIndicatorCircle(indicatorSensor);
      default:
        if (indicatorSensor.indicator.image.startsWith('mdi:')) {
          return this.svgIndicatorMdi(indicatorSensor);
        }
        // else its an external image
        return this.svgIndicatorImg(indicatorSensor);
    }
  }

  private svgSingleIndicator(indicatorSensor: CCIndicatorSensor, index = 0): SVGTemplateResult {
    const indicatorPath = this.svgIndicator(indicatorSensor);
    const { degrees } = this.computeIndicator(indicatorSensor);

    return svg`
      <g class="indicator-${index}" transform="rotate(${degrees},76,76)">
        ${indicatorPath}
      </g>
    `;
  }

  private svgIndicatorArrowOutward(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    return svg`
      <g class="arrow-outward">
        <path d="M76 0v23l-8 7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width=".5"/>
        <path d="M76 0v23l8 7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width="0"/>
        <path d="M76 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
  }

  private svgIndicatorArrowInward(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    return svg`
      <g class="arrow-inward">
        <path d="M76 30.664v-23l-8-7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width=".5" />
        <path d="M76 30.664v-23l8-7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width="0" />
        <path d="M76 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
  }

  private svgIndicatorCircle(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    return svg`
      <g class="circle">
        <path d="m76 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="
        ${this.getColor(indicatorSensor.indicator)}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="${this.getColor(indicatorSensor.indicator)}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="white" opacity="0.5"/>
      </g>
    `;
  }

  private svgIndicatorMdi(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const icon_v = indicatorSensor.indicator.image as string;
    const size = indicatorSensor?.indicator.size ?? 16;
    const r = indicatorSensor.indicator.radius ?? 0;

    // Compass center and place at top
    const cx = 76;
    const cy = 76;

    // Ensure the container is ≥ 24px to avoid clipping at small sizes
    const box = Math.max(size, 24);
    const x = cx - box / 2;
    const y = cy - r - box / 2;

    return svg`
      <foreignObject x=${x} y=${y} width=${box} height=${box}>
        <ha-icon
          .icon=${icon_v}
          style="
            --mdc-icon-size:${size}px;  /* visual size you want */
            --icon-primary-color: ${this.getColor(indicatorSensor.indicator)} !important;
            width:${box}px; height:${box}px; /* container ≥ 24px prevents clip */
            display:block; 
            margin:auto; 
            padding:0; 
            pointer-events:none;
            text-align: center;
          "
        ></ha-icon>
      </foreignObject>
    `;
  }

  private svgIndicatorImg(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const icon_v = indicatorSensor.indicator.image as string;
    const size = indicatorSensor?.indicator.size ?? 16;
    const r = indicatorSensor.indicator.radius ?? 0;

    const cx = 76;
    const cy = 76;

    const box = size;
    const x = cx - box / 2;
    const y = cy - r - box / 2;

    return svg`
      <image 
        href=${icon_v} 
        x=${x} 
        y=${y} 
        width=${box} 
        height=${box} 
        preserveAspectRatio="xMidYMid meet"
      />
    `;
  }

  private svgIndicatorNorth(): SVGTemplateResult {
    return svg`
      <g class="north">
        <text x="76" y="10.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.getColor(this.compass.north)}">
          <tspan x="76" y="11">${localize('directions.N', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorEast(): SVGTemplateResult {
    return svg`
      <g class="east">
        <text x="140" y="80.089" font-family="sans-serif" font-size="13.333" text-anchor="right" fill="${this.getColor(this.compass.east)}">
          <tspan x="140" y="81">${localize('directions.E', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorSouth(): SVGTemplateResult {
    return svg`
      <g class="south">
        <text x="76" y="150.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.getColor(this.compass.south)}">
          <tspan x="76" y="151">${localize('directions.S', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorWest(): SVGTemplateResult {
    return svg`
      <g class="west">
        <text x="-2" y="80.089" font-family="sans-serif" font-size="13.333" text-anchor="left" fill="${this.getColor(this.compass.west)}">
          <tspan x="-2" y="81">${localize('directions.W', '', '', this._config.language)}</tspan>
        </text>
      </g>
    `;
  }

  private getValue(entity: CCEntity): CCValue {
    if (entity.is_attribute) {
      const entityStr = entity.sensor.slice(0, entity.sensor.lastIndexOf('.'));
      const entityObj = this.entities[entityStr];
      if (entityObj && entityObj.attributes) {
        const attribStr = entity.sensor.slice(entity.sensor.lastIndexOf('.') + 1);
        const value = entityObj.attributes[attribStr] || UNAVAILABLE;
        return { value: isNumeric(value) ? Number(value).toFixed(entity.decimals) : value, units: entity.units };
      }
      return { value: UNAVAILABLE, units: entity.units };
    }
    const value = this.entities[entity.sensor]?.state || UNAVAILABLE;
    return { value: isNumeric(value) ? Number(value).toFixed(entity.decimals) : value, units: entity.units };
  }

  private handlePopup(e) {
    e.stopPropagation();
    if (this._config.tap_action) {
      handleClick(this, this._hass, this._config, this._config.tap_action);
    }
  }

  private computeIndicator(entity: CCEntity): CCDirectionInfo {
    // default to North
    let degrees = 0;
    let abbreviation = localize('common.invalid');

    /* The direction entity may either return degrees or a named abbreviations, thus
           determine the degrees and abbreviation with whichever data was returned. */
    const directionStr = this.getValue(entity);

    if (Number.isNaN(Number(directionStr.value))) {
      degrees = CompassCard.getDegrees(directionStr.value);
      abbreviation = directionStr.value;
      if (degrees === -1) {
        const matches = directionStr.value.replace(/\s+/g, '').match(/[+-]?\d+(\.\d)?/);
        if (matches?.length) {
          degrees = CompassCard.positiveDegrees(parseFloat(matches[0]));
        } else {
          degrees = 0;
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
    if (COMPASS_POINTS[abbrevation.toUpperCase()]) {
      return COMPASS_POINTS[abbrevation.toUpperCase()];
    }
    return -1;
  }

  static getCompassAbbreviation(degrees: number, language: string | undefined): string {
    const index = Math.round(CompassCard.positiveDegrees(degrees) / 22.5);
    let string = 'N';
    string = COMPASS_ABBREVIATIONS[index];
    if (index > 15) {
      string = COMPASS_ABBREVIATIONS[0];
    }
    return localize(`directions.${string}`, '', '', language);
  }

  static positiveDegrees(degrees: number): number {
    return degrees < 0 ? degrees + (Math.abs(Math.ceil(degrees / 360)) + 1) * 360 : degrees % 360;
  }
}
