import { LitElement, html, customElement, property, CSSResult, TemplateResult, PropertyValues, svg, SVGTemplateResult, internalProperty } from 'lit-element';
import { getLovelace, HomeAssistant, LovelaceCardEditor, LovelaceCard } from 'custom-card-helpers';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { CompassCardConfig } from './editorTypes';
import { CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicatorSensor, CCValueSensor, CCValue, CCProperties } from './cardTypes';
import handleClick from './utils/handleClick';

import './editor';
import style from './style';

import { CARD_VERSION, COMPASS_ABBREVIATIONS, COMPASS_POINTS, UNAVAILABLE } from './const';

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
      indicator_sensors: [{ sensor: 'sun.sun', attribute: 'azimuth' }],
    };
  }

  @property({ attribute: false }) public _hass!: HomeAssistant;
  @property({ attribute: false }) protected _config!: CompassCardConfig;
  @internalProperty() protected colors!: CCColors;
  @internalProperty() protected header!: CCHeader;
  @internalProperty() protected compass!: CCCompass;
  @internalProperty() protected indicatorSensors!: CCIndicatorSensor[];
  @internalProperty() protected entities: HassEntities = {};
  @internalProperty() protected valueSensors!: CCValueSensor[];

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

    this.colors = {
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
      stateIcon: getComputedStyle(document.documentElement).getPropertyValue('--state-icon-color').trim(),
      secondaryText: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim(),
      primaryText: getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim(),
    };

    this._config = {
      ...config,
    };

    this.updateConfig(this._hass, this._config);
  }

  public getCardSize(): number {
    return 5;
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
    if (getBoolean(this._config.debug, false)) {
      console.info('Compass-Card inflated configuration: header', this.header); // eslint-disable-line
      console.info('Compass-Card inflated configuration: compass', this.compass); // eslint-disable-line
      console.info('Compass-Card inflated configuration: indicator sensors', this.indicatorSensors); //eslint-disable-line
      console.info('Compass-Card inflated configuration: value sensors', this.valueSensors); //eslint-disable-line
      console.info('Compass-Card configuration: listening to entities', this.entities); // eslint-disable-line
    }
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <ha-card tabindex="0" .label=${`Compass: ${this.header.label}`} class="flex compass-card" @click=${(e) => this.handlePopup(e)}>
        ${this.getVisibility(this.header.title) || this.getVisibility(this.header.icon) ? this.renderHeader() : ''}
        <div class="content">
          <div class="compass">${this.svgCompass(this.compass.north.offset)}</div>
          <div class="indicator-sensors">${this.renderDirections()}</div>
          <div class="value-sensors">${this.renderValues()}</div>
        </div>
      </ha-card>
    `;
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
      console.log(this.getVisibility(indicator.state_abbreviation), this.computeIndicator(indicator));
      if (this.getVisibility(indicator.state_abbreviation) || this.getVisibility(indicator.state_value)) {
        divs.push(html`<div class="sensor-${index}">
          <span class="abbr" style="color: ${this.getColor(indicator.state_abbreviation)};"
            >${this.getVisibility(indicator.state_abbreviation) ? this.computeIndicator(indicator).abbreviation : ''}</span
          >
          <span class="value" style="color: ${this.getColor(indicator.state_value)};"
            >${this.getVisibility(indicator.state_value) ? this.computeIndicator(indicator).degrees.toFixed(indicator.decimals) : ''}</span
          >
          <span class="measurement" style="color: ${this.getColor(indicator.state_units)};">${this.getVisibility(indicator.state_units) ? indicator.units : ''}</span>
        </div>`);
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
        divs.push(html`<div class="sensor-${index}">
          <span class="value" style="color: ${this.getColor(value.state_value)};">${this.getVisibility(value.state_value) ? this.getValue(value).value : ''}</span>
          <span class="measurement" style="color: ${this.getColor(value.state_units)};">${this.getVisibility(value.state_units) ? value.units : ''}</span>
        </div>`);
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

  /**
   * Draw compass with indicators
   */

  private svgCompass(directionOffset: number): SVGTemplateResult {
    return svg`
    <svg height="152" width="152">
      ${this.getVisibility(this.compass.circle) ? this.svgCircle() : ''}
        <g class="indicators" transform="rotate(${directionOffset},76,76)" stroke-width=".5">
          ${this.compass.north.show ? this.svgIndicatorNorth() : ''}
          ${this.svgIndicators()}
        </g>
    </svg>
    `;
  }

  private svgCircle(): SVGTemplateResult {
    return svg`<circle class="circle" cx="76" cy="76" r="62" stroke="${this.getColor(
      this.compass.circle,
    )}" stroke-width="2" fill="white" fill-opacity="0.0" stroke-opacity="1.0" />`;
  }

  private svgIndicators(): SVGTemplateResult[] {
    const result: SVGTemplateResult[] = [];
    this.indicatorSensors.forEach((indicatorSensor) => {
      if (this.getVisibility(indicatorSensor.indicator)) {
        result.push(this.svgSingleIndicator(indicatorSensor));
      }
    });
    return result;
  }

  private svgIndicator(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    switch (indicatorSensor.indicator.type) {
      case 'arrow_outward':
        return this.svgIndicatorArrowOutward(indicatorSensor);
      case 'circle':
        return this.svgIndicatorCircle(indicatorSensor);
      default:
    }
    return this.svgIndicatorArrowInward(indicatorSensor);
  }

  private svgSingleIndicator(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const indicatorPath = this.svgIndicator(indicatorSensor);
    const { degrees } = this.computeIndicator(indicatorSensor);

    return svg`
      <g class="indicator" transform="rotate(${degrees},76,76)">
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
        <path d="m76 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="${this.getColor(
          indicatorSensor.indicator,
        )}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="${this.getColor(indicatorSensor.indicator)}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="white" opacity="0.5"/>
      </g>
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

  private getSecondaryEntity(entity: HassEntity): TemplateResult {
    return html` <span class="value">${entity.state}</span> <span class="measurement">${entity.attributes.unit_of_measurement}</span>`;
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
    if (COMPASS_POINTS[abbrevation]) {
      return COMPASS_POINTS[abbrevation];
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
