import { LitElement, html, customElement, property, CSSResult, TemplateResult, PropertyValues } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace, hasConfigOrEntityChanged } from 'custom-card-helpers';
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
    customCards: Array<{ type: string; name: string; description: string }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'compass-card',
  name: 'Compass Card',
  description: localize('common.description'),
});

@customElement('compass-card')
export class CompassCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('compass-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property() public hass!: HomeAssistant;
  @property() private config!: CompassCardConfig;

  public setConfig(config: CompassCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }

    if (!this.config.entity) {
      return html`
        <ha-card style="background-color: var(--error-color);">
          <div class="warning">
            ${localize('common.no_entity')}
          </div>
        </ha-card>
      `;
    }
    let direction_offset = 0;
    if (!Number.isNaN(Number(this.config.direction_offset))) {
      direction_offset =
        +this.config.direction_offset < 0
          ? +this.config.direction_offset + (Math.abs(Math.ceil(+this.config.direction_offset / 360)) + 1) * 360
          : +this.config.direction_offset;
    }

    const direction: HassEntity = this.hass.states[this.config.entity];
    const secondary_entity: HassEntity | undefined = this.config.secondary_entity
      ? this.hass.states[this.config.secondary_entity]
      : undefined;

    return html`
      <ha-card
        tabindex="0"
        aria-label=${`Compass: ${direction.attributes.friendly_name || this.config.entity}`}
        class="flex"
        style="font-size: 14px;"
      >
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
    let abbreviation = 'N.A.';

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
    if (this.config.name && this.config.name.trim().length > 0) {
      return this.config.name;
    }
    return undefined;
  }

  private computeIcon(entity: HassEntity): string {
    return entity.attributes.icon || ICONS.compass;
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
    let index = Math.round(((degrees + 11.25) % 360) / 22.5);
    index = index - 1;
    if (index < 0) {
      index = 0;
    }
    console.log(index);
    return COMPASS_ABBREVIATIONS[index];
  }
}
