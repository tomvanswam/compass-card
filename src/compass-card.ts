import { LitElement, html, customElement, property, CSSResult, TemplateResult, PropertyValues, svg, SVGTemplateResult, internalProperty } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CompassCardConfig, CCProperties, CCDirectionInfo } from './types';
import handleClick from './utils/handleClick';

import './editor';
import style from './style';

import { CARD_VERSION, ICONS, COMPASS_ABBREVIATIONS, COMPASS_POINTS, UNAVAILABLE, INDICATORS, DEFAULT_INDICATOR } from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  COMPASS-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

declare global {
  interface Window {
    customCards: Array<{ type: string; name: string; description: string; preview: boolean }>;
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
    return document.createElement('compass-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      entity: '',
      secondary_entity: '',
      directionOffset: 0,
      name: 'Compass Card',
    };
  }

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) protected _config!: CompassCardConfig;
  @internalProperty() private colors!: any;
  public setConfig(config: CompassCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    if (this.entityChanged(changedProps, this._config.entity)) {
      return true;
    }
    if (this.entityChanged(changedProps, this._config.secondary_entity)) {
      return true;
    }

    return false;
  }

  private entityChanged(changedProps: PropertyValues, entity: string | undefined): boolean {
    if (entity) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass?.states[entity] !== this.hass.states[entity]) {
        return true;
      }
    }
    return false;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    this.colors = {
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
    };

    const direction: HassEntity = this.hass.states[this._config?.entity];
    const directionOffset = !Number.isNaN(Number(this._config.directionOffset)) ? CompassCard.positiveDegrees(+this._config.directionOffset) : 0;

    const label = direction ? direction.attributes.friendly_name : this._config.entity;

    return html`
      <ha-card tabindex="0" aria-label=${`Compass: ${label}`} class="flex" @click=${(e) => this.handlePopup(e)}>
        ${this.computeName() ? this.renderHeader() : ''}
        <div class="content">
          <div class="compass">${this.svgCompass(directionOffset)}</div>
          <div class="direction">${this.computeIndicator(this._config.entity).abbreviation}</div>
          <div class="info">
            <div>${this._config.secondary_entity ? this.getSecondaryEntity(this.hass.states[this._config.secondary_entity]) : ''}</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private svgCompass(directionOffset: number): SVGTemplateResult {
    return svg`
    <svg height="152" width="152">
      <circle class="ring" cx="76" cy="76" r="62" stroke="${this.colors.primary}" stroke-width="2" fill="white" fill-opacity="0.0" stroke-opacity="1.0" />
        <g class="indicators" transform="rotate(${directionOffset},76,76)" stroke-width=".5">
        ${this._config.entity ? this.svgSingleIndicator() : ''}
        ${this._config.compass?.show_north ? this.svgIndicatorNorth() : ''}
        </g>
    </svg>
    `;
  }

  private svgIndicator(configuredIndicator: string | undefined): SVGTemplateResult {
    const indicator = configuredIndicator && INDICATORS.indexOf(configuredIndicator) >= 0 ? configuredIndicator : INDICATORS[DEFAULT_INDICATOR];

    switch (indicator) {
      case 'arrow_outward':
        return this.svgIndicatorArrowOutward();
      case 'circle':
        return this.svgIndicatorCircle();
      default:
    }
    return this.svgIndicatorArrowInward();
  }

  private svgSingleIndicator(): SVGTemplateResult {
    const indicatorPath = this.svgIndicator(this._config.compass?.indicator);
    const { degrees } = this.computeIndicator(this._config.entity);

    return svg`
      <g class="indicator" transform="rotate(${degrees},76,76)">
        ${indicatorPath}
      </g>
    `;
  }

  private svgIndicatorArrowOutward(): SVGTemplateResult {
    return svg`
      <g class="arrow-outward">
        <path d="M76 0v23l-8 7z" fill="${this.colors.accent}" stroke="${this.colors.accent}" stroke-width=".5"/>
        <path d="M76 0v23l8 7z" fill="${CompassCard.shadeColor(this.colors.accent, -64)}" stroke="${CompassCard.shadeColor(this.colors.accent, -64)}" stroke-width=".5"/>
      </g>
    `;
  }

  private svgIndicatorArrowInward(): SVGTemplateResult {
    return svg`
      <g class="arrow-inward">
        <path d="M76 30.664v-23l-8-7z" fill="${this.colors.accent}" stroke="${this.colors.accent}" stroke-width=".5" />
        <path d="M76 30.664v-23l8-7z" fill="${CompassCard.shadeColor(this.colors.accent, -64)}" stroke="${CompassCard.shadeColor(this.colors.accent, -64)}" stroke-width=".5" />
      </g>
    `;
  }

  private svgIndicatorCircle(): SVGTemplateResult {
    return svg`
      <g class="circle">
        <path d="m76 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="${
          this.colors.accent
        }"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="${CompassCard.shadeColor(this.colors.accent, -64)}"/>
      </g>
    `;
  }

  private svgIndicatorNorth(): SVGTemplateResult {
    return svg`
      <g class="north">
        <text x="76" y="10.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.colors.primary}">
          <tspan x="76" y="11">${localize('directions.N', '', '', this._config.compass?.language)}</tspan>
        </text>
      </g>
    `;
  }

  private getSecondaryEntity(entity: HassEntity): TemplateResult {
    return html` <span class="value">${entity.state}</span> <span class="measurement">${entity.attributes.unit_of_measurement}</span>`;
  }

  private handlePopup(e) {
    e.stopPropagation();
    if (this._config.tap_action) {
      handleClick(this, this.hass, this._config, this._config.tap_action);
    }
  }

  private renderHeader(): TemplateResult {
    return html`
      <div class="header">
        <div class="name">
          <span>${this.computeName()} </span>
        </div>
        <div class="icon">
          <ha-icon .icon=${this.computeIcon()}></ha-icon>
        </div>
      </div>
    `;
  }

  public getCardSize(): number {
    return 4;
  }

  private computeName(): string | undefined {
    if (this._config.name && this._config.name.trim().length > 0) {
      return this._config.name;
    }
    return undefined;
  }

  private computeIcon(): string {
    const entity = this.hass.states[this._config.entity];
    const icon = entity ? (entity.attributes.icon ? entity.attributes.icon : ICONS.compass) : ICONS.compass;
    return icon;
  }

  private computeIndicator(entity: string): CCDirectionInfo {
    const indicatorEntity: HassEntity = this.hass.states[entity];
    // default to North
    let degrees = 0;
    let abbreviation = localize('common.invalid');

    /* The direction entity may either return degrees or a named abbreviations, thus
           determine the degrees and abbreviation with whichever data was returned. */
    const directionStr = indicatorEntity ? indicatorEntity.state : UNAVAILABLE;

    if (Number.isNaN(Number(directionStr))) {
      degrees = CompassCard.getDegrees(directionStr);
      abbreviation = directionStr;
      if (degrees === -1) {
        const matches = directionStr.replace(/\s+/g, '').match(/[+-]?\d+(\.\d)?/);
        if (matches?.length) {
          degrees = CompassCard.positiveDegrees(parseFloat(matches[0]));
        } else {
          degrees = 0;
        }
        abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.compass?.language);
      }
    } else {
      degrees = CompassCard.positiveDegrees(parseFloat(directionStr));
      abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.compass?.language);
    }

    return { abbreviation, degrees };
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

  static shadeColor(color: string, amount: number): string {
    const usePound = color.trim().substr(0, 1) === '#';

    const col = color.trim().substr(0, 1) === '#' ? color.trim().replace('#', '') : color;

    let R = parseInt(col.substring(0, 2), 16);
    let G = parseInt(col.substring(2, 4), 16);
    let B = parseInt(col.substring(4, 6), 16);

    R = R - amount;
    G = G - amount;
    B = B - amount;

    if (R > 255) R = 255;
    else if (R < 0) R = 0;

    if (G > 255) G = 255;
    else if (G < 0) G = 0;

    if (B > 255) B = 255;
    else if (B < 0) B = 0;

    const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    const result = (usePound ? '#' : '') + RR + GG + BB;

    return result;
  }
}
