import { LitElement, html, customElement, property, CSSResult, TemplateResult, PropertyValues, svg, SVGTemplateResult, internalProperty } from 'lit-element';
import { getLovelace, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { HassEntities, HassEntity, HassServices } from 'home-assistant-js-websocket';
import { CompassCardConfig } from './editorTypes';
import { CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicatorSensor, CCValueSensor, CCValue } from './cardTypes';
import handleClick from './utils/handleClick';

import './editor';
import style from './style';

import { CARD_VERSION, COMPASS_ABBREVIATIONS, COMPASS_POINTS, UNAVAILABLE } from './const';

import { localize } from './localize/localize';
import { getHeader, getCompass, getIndicatorSensors, getValueSensors, getBoolean, findValues } from './utils/objectHelpers';

/* eslint no-console: 0 */
console.info(
  `%c  COMPASS-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview: boolean }>;
    loadCardHelpers;
  }
}

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
    (await window.loadCardHelpers()).createCardElement({ type: 'entities', entities: [] });
    await customElements.get('hui-entities-card').getConfigElement();
    return document.createElement('compass-card-editor') as LovelaceCardEditor;
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

    // if (this.entityChanged(changedProps, this._config.entity.name)) {
    //   return true;
    // }
    // if (this.entityChanged(changedProps, this._config.secondary_entity?.name)) {
    //   return true;
    // }

    return true;
  }

  private updateConfig(hass: HomeAssistant, config: CompassCardConfig): void {
    if (!hass || !config) {
      return;
    }
    const stringEntities = findValues(this._config, 'sensor');
    stringEntities.forEach((stringEntity) => {
      if (this._hass.states[stringEntity]) {
        const entity = this._hass.states[stringEntity];
        this.entities[entity.entity_id] = this._hass.states[stringEntity];
      }
    });
    this.header = getHeader(this._config, this.colors, this._hass.states[this._config?.indicator_sensors[0].sensor], this.entities);
    this.compass = getCompass(this._config, this.colors, this.entities);
    this.indicatorSensors = getIndicatorSensors(this._config, this.colors, this.entities);
    this.valueSensors = getValueSensors(this._config, this.colors, this.entities);
    if (this._config.debug && getBoolean(this._config.debug, false)) {
      console.info('header', this.header);
      console.info('compass', this.compass);
      console.info('indicator sensors', this.indicatorSensors);
      console.info('value sensors', this.valueSensors);
    }
  }

  private entityChanged(changedProps: PropertyValues, entity: string | undefined): boolean {
    if (entity) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass?.states[entity] !== this._hass.states[entity]) {
        return true;
      }
    }
    return false;
  }

  protected render(): TemplateResult {
    if (!this._config || !this._hass) {
      return html``;
    }

    return html`
      <ha-card tabindex="0" aria-label=${`Compass: ${this.header.label}`} class="flex compass-card" @click=${(e) => this.handlePopup(e)}>
        ${this.header.title.show || this.header.icon.show ? this.renderHeader() : ''}
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
        <div class="name" style="color:${this.header.title.color};">${this.header.title.show ? this.renderTitle() : html`<span>&nbsp;</span>`}</div>
        <div class="icon" style="color:${this.header.icon.color};">${this.header.icon.show ? this.renderIcon() : html`<span>&nbsp;</span>`}</div>
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
      if (indicator.state_abbreviation.show || indicator.state_value.show) {
        divs.push(html`<div class="sensor-${index}">
          <span class="abbr" style="color: ${indicator.state_abbreviation.color};">${indicator.state_abbreviation.show ? this.computeIndicator(indicator).abbreviation : ''}</span>
          <span class="value" style="color: ${indicator.state_value.color};">${indicator.state_value.show ? this.computeIndicator(indicator).degrees : ''}</span>
          <span class="measurement" style="color: ${indicator.state_units.color}; ${indicator.state_units.show ? 'margin-left: -3px;' : ''}"
            >${indicator.state_units.show ? indicator.units : ''}</span
          >
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
      if (value.state_value.show) {
        divs.push(html`<div class="sensor-${index}">
          <span class="value" style="color: ${value.state_value.color};">${value.state_value.show ? this.getValue(value).value : ''}</span>
          <span class="measurement" style="color: ${value.state_units.color}; ${value.state_units.show ? 'margin-left: -3px;' : ''}"
            >${value.state_units.show ? value.units : ''}</span
          >
        </div>`);
        index++;
      }
    });
    return divs;
  }

  /**
   * Draw compass with indicators
   */

  private svgCompass(directionOffset: number): SVGTemplateResult {
    return svg`
    <svg height="152" width="152">
      ${this.compass.circle.show ? this.svgCircle() : ''}
        <g class="indicators" transform="rotate(${directionOffset},76,76)" stroke-width=".5">
          ${this.compass.north.show ? this.svgIndicatorNorth() : ''}
          ${this.svgIndicators()}
        </g>
    </svg>
    `;
  }

  private svgCircle(): SVGTemplateResult {
    return svg`<circle class="circle" cx="76" cy="76" r="62" stroke="${this.compass.circle.color}" stroke-width="2" fill="white" fill-opacity="0.0" stroke-opacity="1.0" />`;
  }

  private svgIndicators(): SVGTemplateResult[] {
    const result: SVGTemplateResult[] = [];
    this.indicatorSensors.forEach((indicatorSensor) => {
      if (indicatorSensor.indicator.show) {
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
        <path d="M76 0v23l-8 7z" fill="${indicatorSensor.indicator.color}" stroke="${indicatorSensor.indicator.color}" stroke-width=".5"/>
        <path d="M76 0v23l8 7z" fill="${indicatorSensor.indicator.color}" stroke="${indicatorSensor.indicator.color}" stroke-width="0"/>
        <path d="M76 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
  }

  private svgIndicatorArrowInward(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    return svg`
      <g class="arrow-inward">
        <path d="M76 30.664v-23l-8-7z" fill="${indicatorSensor.indicator.color}" stroke="${indicatorSensor.indicator.color}" stroke-width=".5" />
        <path d="M76 30.664v-23l8-7z" fill="${indicatorSensor.indicator.color}" stroke="${indicatorSensor.indicator.color}" stroke-width="0" />
        <path d="M76 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
  }

  private svgIndicatorCircle(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    return svg`
      <g class="circle">
        <path d="m76 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="${indicatorSensor.indicator.color}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="${indicatorSensor.indicator.color}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="white" opacity="0.5"/>
      </g>
    `;
  }

  private svgIndicatorNorth(): SVGTemplateResult {
    return svg`
      <g class="north">
        <text x="76" y="10.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.compass.north.color}">
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
      const entityObj = this._hass.states[entityStr];
      if (entityObj && entityObj.attributes) {
        const attribStr = entity.sensor.slice(entity.sensor.lastIndexOf('.') + 1);
        return { value: entityObj.attributes[attribStr] || UNAVAILABLE, units: '', number_format: '' };
      }
      return { value: UNAVAILABLE, units: '', number_format: '' };
    }
    return this._hass.states[entity.sensor]
      ? { value: this._hass.states[entity.sensor].state, units: this._hass.states[entity.sensor].attributes?.unit_of_measurement || '', number_format: '' }
      : { value: UNAVAILABLE, units: '', number_format: '' };
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
    if (index > 15) {
      string = COMPASS_ABBREVIATIONS[0];
    }
    string = COMPASS_ABBREVIATIONS[index];
    return localize(`directions.${string}`, '', '', language);
  }

  static positiveDegrees(degrees: number): number {
    return degrees < 0 ? degrees + (Math.abs(Math.ceil(degrees / 360)) + 1) * 360 : degrees % 360;
  }
}
