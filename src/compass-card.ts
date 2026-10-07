import './editor';
import { assert, StructError } from 'superstruct';
import { CARD_VERSION, CENTER_OBJECT_FACTOR, CIRCLE, COMPASS_ABBREVIATIONS, COMPASS_POINTS, DEFAULT_CARD_SIZE, DEFAULT_ICON_VALUE, DEFAULT_SECTIONS_SIZE, DEFAULT_UNKNOWN_DIRECTION, DEGREES_MAX, DEGREES_MID, DEGREES_MIN, DEGREES_ONE, DEGREES_PER_ABBREVIATION, DEGREES_QRT, ICON_VALUES, INDEX_ELEMENT_0, LENGTH_TO_INDEX, MAJOR_TICK_ANGLE, MAJOR_TICK_INNER_RADIUS_LENGTH, MEDIUM_TICK_INNER_RADIUS_LENGTH, MINOR_TICK_INNER_RADIUS_LENGTH, NO_ELEMENTS, RADIUS_TO_DIAMETER_FACTOR, SVG_SCALE_MAX, SVG_SCALE_MIN, TICKS_OUTER_RADIUS_OFFSET, TICKS_TOLERANCE_DEGREE, UNAVAILABLE, UNKNOWN_STATES } from './const.js';
import { CCCircle, CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicator, CCIndicatorSensor, CCProperties, CCStyleBand, CCValue, CCValueSensor } from './cardTypes.js';
import { CompassCardConfig, CompassCardConfigStruct } from './editorTypes.js';
import { CSSResult, html, LitElement, nothing, PropertyValues, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { findValues, getBoolean, getCompass, getHeader, getIndicatorSensors, getValueSensors, isNumeric, resolveAttrPath } from './utils/objectHelpers.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor } from './utils/ha-helpers.js';
import handleClick from './utils/handleClick.js';
import { HassEntities } from 'home-assistant-js-websocket';
import { localize } from './localize/localize.js';
import { mdiCompass } from '@mdi/js';
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
  private lastKnownDirections = new Map<string, CCDirectionInfo>();
  @state() protected indicatorSensors!: CCIndicatorSensor[];
  @state() protected entities: HassEntities = {};
  @state() protected valueSensors!: CCValueSensor[];
  @state() protected iconsLoaded = NO_ELEMENTS;
  @property({ attribute: false }) protected svgScale!: number;

  public setConfig(config: CompassCardConfig): void {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (!config.indicator_sensors || !config.indicator_sensors[0].sensor) {
      throw new Error(localize('common.missing_direction_entity'));
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
          { cause: e },
        );
      }
      if (last === 'image' && secondLast === 'indicator') {
        throw new Error(
          `Compass Card: ${err.path.join('.')} should be either ${ICON_VALUES.join(', ')}, an mdi: icon (e.g. mdi:compass) or an image URL (e.g. https://example.com/image.png or /local/image.png). More info: https://github.com/tomvanswam/compass-card/wiki/YAML-configuration#indicator-object`,
          { cause: e },
        );
      }
      throw new Error(`Compass Card: invalid yaml configuration. ${err.message} More info: https://github.com/tomvanswam/compass-card/wiki/YAML-configuration`, { cause: e });
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

  public getGridOptions() {
    return {
      columns: DEFAULT_SECTIONS_SIZE.COLUMNS_DEFAULT,
      min_columns: DEFAULT_SECTIONS_SIZE.COLUMNS_MIN,
      min_rows: DEFAULT_SECTIONS_SIZE.ROWS_MIN,
      rows: DEFAULT_SECTIONS_SIZE.ROWS_DEFAULT + +this.showHeader(),
    };
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.updateConfig(this._hass, this._config);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config') || changedProps.has('iconsLoaded')) {
      return true;
    }
    if (changedProps.has('_hass')) {
      const oldHass = changedProps.get('_hass') as HomeAssistant | undefined;
      if (!oldHass) {
        return true;
      }
      for (const entity in this.entities) {
        if (oldHass.states[entity] !== this._hass.states[entity]) {
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
    const entities: HassEntities = {};
    stringEntities.forEach((stringEntity) => {
      if (hass.states[stringEntity]) {
        entities[stringEntity] = hass.states[stringEntity];
      }
    });
    this.entities = entities;
    this.header = getHeader(this._config, this.colors, this.entities[this._config?.indicator_sensors[0].sensor], this.entities);
    this.compass = getCompass(this._config, this.colors, this.entities);
    this.indicatorSensors = getIndicatorSensors(this._config, this.colors, this.entities);
    this.valueSensors = getValueSensors(this._config, this.colors, this.entities);
    const allScales = [
      ...this.indicatorSensors.map((is) => is.indicator.scale).filter((scale) => scale !== SVG_SCALE_MIN),
      ...this.indicatorSensors.map((is) => is.indicator.dynamic_style?.bands?.map((band) => band.scale).filter((scale) => scale !== SVG_SCALE_MIN)).flat(),
      ...this.indicatorSensors.map((is) => is.indicator.dynamic_style?.unknown?.scale).filter((scale) => scale !== SVG_SCALE_MIN),
    ];
    this.svgScale = this.compass.scale === SVG_SCALE_MIN
      ? Math.min(...allScales.map((scale) => (scale === SVG_SCALE_MIN ? SVG_SCALE_MAX : scale)))
      : this.compass.scale;
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
      <ha-card
        tabindex=${this._config.tap_action ? '0' : nothing}
        role=${this._config.tap_action ? 'button' : nothing}
        .label=${`Compass: ${this.header.label}`}
        class="flex compass-card"
        @click=${(e) => this.handlePopup(e)}
        @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
      >
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
      <span class="abbr" style="--compass-card-indicator-abbr-color: ${this.getColor(indicator.state_abbreviation)};">${this.visibleIndicator(indicator)?.abbreviation ?? ''}</span>
    `;
  }

  private visibleIndicator(indicator: CCIndicatorSensor): CCDirectionInfo | undefined {
    const info = this.computeIndicator(indicator);
    return this.hideUnknown(info) ? undefined : info;
  }

  private getIndicatorValue(indicator: CCIndicatorSensor): TemplateResult {
    return html`
      <span class="value" style="--compass-card-indicator-value-color: ${this.getColor(indicator.state_value)};"
        >${this.visibleIndicator(indicator)?.degrees.toFixed(indicator.decimals) ?? ''}</span
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

  /**
   * Returns the dynamic style band matching the current sensor value (highest from_value <= value), if any.
   */
  private getActiveBand(properties: CCProperties): CCStyleBand | undefined {
    const { bands } = properties.dynamic_style;
    if (bands.length === NO_ELEMENTS) {
      return undefined;
    }
    const value = this.getValue(properties.dynamic_style);
    if (!isNumeric(value.value)) {
      return undefined;
    }
    const usableBands = bands.filter((band) => band.from_value <= Number(value.value));
    return usableBands[usableBands.length + LENGTH_TO_INDEX];
  }

  private getVisibility(properties: CCProperties): boolean {
    return getBoolean(this.getActiveBand(properties)?.show, properties.show);
  }

  private getColor(properties: CCProperties): string {
    return this.getActiveBand(properties)?.color || properties.color;
  }
  private getSize(properties: CCIndicator): number {
    return this.getActiveBand(properties)?.size || properties.size;
  }

  private getRadius(properties: CCIndicator): number {
    return this.getActiveBand(properties)?.radius || properties.radius;
  }

  private getOpacity(properties: CCIndicator): number {
    return this.getActiveBand(properties)?.opacity || properties.opacity;
  }

  private getBackgroundImage(properties: CCCircle): string {
    return this.getActiveBand(properties)?.background_image || properties.background_image;
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
         style="--compass-card-svg-scale:${this.svgScale}; --compass-card-svg-image-opacity: ${this.compass.circle.background_opacity}; --compass-circle-stroke: ${this.getColor(this.compass.circle)}; --compass-circle-stroke-width: ${this.compass.circle.stroke_width}px;">
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
          ${this.compass.ticks.show ? this.renderTicks() : ''}
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

  private renderTicks(): TemplateResult {
    const { color: ticksColor, radius: ticksRadius, step: ticksStep } = this.compass.ticks;
    const ticks: TemplateResult[] = [];
    const center = CIRCLE.CENTER;
    const radiusOuter = ticksRadius + TICKS_OUTER_RADIUS_OFFSET;
    const radiusInnerMinor = ticksRadius - MINOR_TICK_INNER_RADIUS_LENGTH;
    const radiusInnerMedium = ticksRadius - MEDIUM_TICK_INNER_RADIUS_LENGTH;
    const radiusInnerMajor = ticksRadius - MAJOR_TICK_INNER_RADIUS_LENGTH;

    for (let angle = 0; angle < DEGREES_MAX; angle += ticksStep) {
      // normalize angle into 0–359
      const angle_n = CompassCard.positiveDegrees(angle);

      // Level classification:
      const isMajor = angle_n % DEGREES_QRT === DEGREES_MIN; // N, E, S, W
      let isMedium = false;
      if (!isMajor) {
        const ratio = angle_n / MAJOR_TICK_ANGLE; // e.g. 22.5 → 1, 45 → 2, 67.5 → 3
        const nearest = Math.round(ratio);
        const nearestAngle = nearest * MAJOR_TICK_ANGLE;
        const diff = Math.abs(angle_n - nearestAngle); // difference in degrees

        isMedium = diff <= TICKS_TOLERANCE_DEGREE;
      }

      let level: 'major' | 'medium' | 'minor';
      let r1: number;

      if (isMajor) {
        level = 'major';
        r1 = radiusInnerMajor;
      } else if (isMedium) {
        level = 'medium';
        r1 = radiusInnerMedium;
      } else {
        level = 'minor';
        r1 = radiusInnerMinor;
      }

      const r2 = radiusOuter;

      const rad = (angle_n * Math.PI) / DEGREES_MID;
      const x1 = center + r1 * Math.sin(rad);
      const y1 = center - r1 * Math.cos(rad);
      const x2 = center + r2 * Math.sin(rad);
      const y2 = center - r2 * Math.cos(rad);

      ticks.push(svg`
      <line
        x1="${x1}" y1="${y1}"
        x2="${x2}" y2="${y2}"
        class="tick ${level}"
      />
    `);
    }
    return svg`
      <g class="ticks" style=${ticksColor ? `--compass-card-tick-color: ${ticksColor};` : ''}>
        ${ticks}
      </g>
    `;
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
    return this.getActiveBand(properties)?.image || properties.image;
  }

  private svgIndicator(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const img = this.getIndicatorImage(indicatorSensor.indicator);
    switch (img) {
      case 'arrow_outward':
        return this.svgIndicatorArrowOutward(indicatorSensor);
      case 'arrow_inward':
        return this.svgIndicatorArrowInward(indicatorSensor);
      case 'circle':
        return this.svgIndicatorCircle(indicatorSensor);
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
    const info = this.computeIndicator(indicatorSensor);
    if (this.hideUnknown(info)) return svg``;
    const { degrees } = info;

    // set per-indicator color via CSS variable so presentational attributes move to CSS
    return svg`
      <g class="indicator-${index}" transform="rotate(${degrees},${CIRCLE.CENTER},${CIRCLE.CENTER})" style="--compass-card-indicator-color: ${this.getColor(indicatorSensor.indicator)}; --compass-card-indicator-opacity: ${this.getOpacity(indicatorSensor.indicator)}">
        ${indicatorPath}
      </g>
    `;
  }

  private svgIndicatorArrowOutward(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const size = this.getSize(indicatorSensor.indicator);
    const r = this.getRadius(indicatorSensor.indicator);
    const opacity = this.getOpacity(indicatorSensor.indicator);

    const box = size;
    const x = CIRCLE.CENTER - box * CENTER_OBJECT_FACTOR;
    const y = CIRCLE.CENTER - r - box * CENTER_OBJECT_FACTOR;

    // Original exported circle artwork geometry (from original path)
    const R0 = 9.1809;
    const S0 = 18.361;   // original diameter used by v18.361
    const X0 = CIRCLE.CENTER - R0; // original left edge
    const Y0 = 5.8262;            // original top edge

    // Use BOTH radius + size:
    // - r controls scale (radius)
    // - size controls available box (fit)
    const sByR = r / R0;
    const sByBox = box / S0;
    const s = Math.min(sByR, sByBox);

    // Map original artwork top-left (X0,Y0) -> desired (x,y) after scaling
    const tx = x - s * X0;
    const ty = y - s * Y0;
    return svg`
      <g class="arrow-outward" opacity=${opacity} transform="translate(${tx} ${ty}) scale(${s})">
        <path d="M${CIRCLE.CENTER} 0v23l-8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
  }

  private svgIndicatorArrowInward(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const size = this.getSize(indicatorSensor.indicator);
    const r = this.getRadius(indicatorSensor.indicator);
    const opacity = this.getOpacity(indicatorSensor.indicator);

    const box = size;
    const x = CIRCLE.CENTER - box * CENTER_OBJECT_FACTOR;
    const y = CIRCLE.CENTER - r - box * CENTER_OBJECT_FACTOR;

    const R0 = 9.1809;
    const S0 = 18.361;
    const X0 = CIRCLE.CENTER - R0;
    const Y0 = 5.8262;

    const sByR = r / R0;
    const sByBox = box / S0;
    const s = Math.min(sByR, sByBox);

    const tx = x - s * X0;
    const ty = y - s * Y0;
    return svg`
      <g class="arrow-inward" opacity=${opacity} transform="translate(${tx} ${ty}) scale(${s})">
        <path d="M${CIRCLE.CENTER} 30.664v-23l-8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
  }

  private svgIndicatorCircle(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const size = this.getSize(indicatorSensor.indicator);
    const r = this.getRadius(indicatorSensor.indicator);
    const opacity = this.getOpacity(indicatorSensor.indicator);

    const R0 = 9.1809;
    const S0 = 18.361;
    const Y0 = 5.8262;

    const s = size / S0;

    const cx0 = CIRCLE.CENTER;
    const cy0 = Y0 + R0;

    const cxT = CIRCLE.CENTER;
    const cyT = CIRCLE.CENTER - r;

    const tx = cxT - s * cx0;
    const ty = cyT - s * cy0;

    return svg`
      <g class="circle-indicator" opacity=${opacity} transform="translate(${tx} ${ty}) scale(${s})">
        <path d="m${CIRCLE.CENTER} 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1813 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z"
              fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z"
              fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z"
              fill="white" opacity="0.5"/>
      </g>
    `;
  }

  private static readonly iconPaths = new Map<string, string>();
  private static readonly iconRequests = new Map<string, Promise<string | undefined>>();

  /**
   * Resolve an icon (mdi: or any other HA iconset) to its SVG path through Home Assistant's own
   * ha-icon, so the card does not have to bundle the full @mdi/js set. Returns undefined while loading.
   */
  private resolveIconPath(icon: string): string | undefined {
    if (!icon?.includes(':')) return undefined;
    const cached = CompassCard.iconPaths.get(icon);
    if (cached) return cached;
    if (!CompassCard.iconRequests.has(icon)) {
      CompassCard.iconRequests.set(icon, CompassCard.loadIconPath(icon));
    }
    CompassCard.iconRequests.get(icon)?.then((path) => {
      if (path) this.iconsLoaded++;
    });
    return undefined;
  }

  private static async loadIconPath(icon: string): Promise<string | undefined> {
    const ICON_POLL_MS = 50;
    const ICON_POLL_TRIES = 100;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = document.createElement('ha-icon') as any;
    el.icon = icon;
    el.style.display = 'none';
    document.body.appendChild(el);
    try {
      for (let i = 0; i < ICON_POLL_TRIES; i++) {
        await el.updateComplete;
        const path = el.shadowRoot?.querySelector('ha-svg-icon')?.path as string | undefined;
        if (path) {
          CompassCard.iconPaths.set(icon, path);
          return path;
        }
        await new Promise((resolve) => setTimeout(resolve, ICON_POLL_MS));
      }
      return undefined;
    } finally {
      el.remove();
    }
  }

  // svg indicator is using pure SVG to avoid issues in iOS  (no foreignObject ha-icon)
  private svgIndicatorMdi(indicatorSensor: CCIndicatorSensor): SVGTemplateResult {
    const MDI_BOX_MIN_SIZE = 24;
    const icon_v = this.getIndicatorImage(indicatorSensor.indicator) as string;
    const d = this.resolveIconPath(icon_v) ?? mdiCompass;
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
        const value = resolveAttrPath(entityObj.attributes, attribStr) ?? UNAVAILABLE;
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
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.handlePopup(e);
    }
  }

  private handlePopup(e: { stopPropagation: () => void; }) {
    e.stopPropagation();
    if (this._config.tap_action) {
      handleClick(this, this._hass, this._config, this._config.tap_action);
    }
  }

  private computeIndicator(entity: CCEntity): CCDirectionInfo {
    const info = this.parseIndicator(entity);
    const mode = this._config.unknown_direction || DEFAULT_UNKNOWN_DIRECTION;
    if (!info.unknown) {
      this.lastKnownDirections.set(entity.sensor, info);
      return info;
    }
    if (mode === 'last') {
      const last = this.lastKnownDirections.get(entity.sensor);
      if (last) return { ...last, unknown: true };
    }
    return info;
  }

  private parseIndicator(entity: CCEntity): CCDirectionInfo {
    let degrees: number;
    let abbreviation: string | number;
    let unknown = false;

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
          unknown = true;
        }
        abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
      } else {
        abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
      }
    } else {
      degrees = CompassCard.positiveDegrees(parseFloat(directionStr.value));
      abbreviation = CompassCard.getCompassAbbreviation(degrees, this._config.language);
    }
    if (UNKNOWN_STATES.includes(String(directionStr.value).toLowerCase())) {
      unknown = true;
    }
    return { abbreviation, degrees: Math.round(degrees), unknown };
  }

  private hideUnknown(info: CCDirectionInfo): boolean {
    return info.unknown && this._config.unknown_direction === 'hide';
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
