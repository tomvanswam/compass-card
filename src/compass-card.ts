import { LitElement, html, customElement, property, CSSResult, TemplateResult, PropertyValues } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CompassCardConfig } from './types';

import './editor';
import style from './style';

import { CARD_VERSION, ICONS, FONT_SIZE_HEADER, COMPASS_ABBREVIATIONS, COMPASS_POINTS, UNAVAILABLE } from './const';

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
      direction_offset: 0,
      name: 'Compass Card',
    };
  }

  @property() public hass!: HomeAssistant;
  @property() private _config!: CompassCardConfig;

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

    if (this._config.entity) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass) {
        if (oldHass.states[this._config.entity] !== this.hass.states[this._config.entity]) {
          return true;
        }
      }
    }

    if (this._config.secondary_entity) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
      if (oldHass) {
        if (oldHass.states[this._config.secondary_entity] !== this.hass.states[this._config.secondary_entity]) {
          return true;
        }
      }
    }
    return false;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    let direction_offset = 0;
    if (!Number.isNaN(Number(this._config.direction_offset))) {
      direction_offset =
        +this._config.direction_offset < 0
          ? +this._config.direction_offset + (Math.abs(Math.ceil(+this._config.direction_offset / 360)) + 1) * 360
          : +this._config.direction_offset;
    }

    const direction: HassEntity = this.hass.states[this._config.entity];
    const secondary_entity: HassEntity | undefined = this._config.secondary_entity
      ? this.hass.states[this._config.secondary_entity]
      : undefined;

    const label = direction ? direction.attributes.friendly_name : this._config.entity;

    return html`
      <ha-card tabindex="0" aria-label=${`Compass: ${label}`} class="flex" style="font-size: 14px;">
        ${this.renderHeader(direction)}${this.renderCompass(direction, secondary_entity, direction_offset)}
      </ha-card>
    `;
  }

  private renderCompass(
    direction: HassEntity,
    speed: HassEntity | undefined,
    direction_offset: number,
  ): TemplateResult {
    // default to North
    let degrees = 0;
    let abbreviation = localize('common.invalid');

    /* The direction entity may either return degrees or a named abbreviations, thus
           determine the degrees and abbreviation with whichever data was returned. */
    const directionStr = direction ? direction.state : UNAVAILABLE;

    if (Number.isNaN(Number(directionStr))) {
      degrees = CompassCard.get_degrees(directionStr);
      abbreviation = directionStr;
    } else {
      degrees = parseFloat(directionStr);
      abbreviation = CompassCard.get_compass_point(degrees);
    }
    return html`
      <div class="compass" style="padding: 16px;">
        <div class="direction">
          <p>
            ${abbreviation}
            ${speed
              ? html`
                  <span>
                    ${speed.state} ${speed.attributes.unit_of_measurement}
                  </span>
                `
              : ''}
          </p>
        </div>
        <div class="indicator" style="transform: rotate(${(degrees + direction_offset) % 360}deg)"></div>
      </div>
    `;
  }

  private renderHeader(mainEntity: HassEntity): TemplateResult | string {
    if (this.computeName()) {
      return html`
        <div class="header flex" style="font-size: ${FONT_SIZE_HEADER}px;">
          ${this.renderName()} ${this.renderIcon(mainEntity)}
        </div>
      `;
    }
    return '';
  }

  private renderIcon(entity: HassEntity): TemplateResult {
    return html`
      <div class="icon" }>
        <ha-icon .icon=${this.computeIcon(entity)}></ha-icon>
      </div>
    `;
  }

  private renderName(): TemplateResult {
    return html`
      <div class="name flex">
        <span class="ellipsis">${this.computeName()}</span>
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

  private computeIcon(entity: HassEntity): string {
    const icon = entity ? (entity.attributes.icon ? entity.attributes.icon : ICONS.compass) : ICONS.compass;
    return icon;
  }

  static get styles(): CSSResult {
    return style;
  }

  static get_degrees(abbrevation: string): number {
    if (COMPASS_POINTS[abbrevation]) {
      return COMPASS_POINTS[abbrevation];
    }
    return 0; // default to North if the abbreviation is missing
  }

  static get_compass_point(degrees: number): string {
    const positiveDegrees = degrees < 0 ? degrees + (Math.abs(Math.ceil(degrees / 360)) + 1) * 360 : degrees;
    const index = Math.round((positiveDegrees % 360) / 22.5);
    if (index > 15) {
      return COMPASS_ABBREVIATIONS[0];
    }
    return COMPASS_ABBREVIATIONS[index];
  }
}
