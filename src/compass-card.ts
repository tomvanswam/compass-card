import './editor/editor';
import { ActionConfig, CompassCardConfig, CompassCardConfigStruct } from './editor/editorTypes.js';
import { activeBackgroundImage, activeColor, activeImage, activeOpacity, activeRadius, activeSize, isVisible } from './render/activeStyle.js';
import { assert, StructError } from 'superstruct';
import { CARD_VERSION, CIRCLE, DEFAULT_CARD_SIZE, DEFAULT_SECTIONS_SIZE, DEFAULT_UNKNOWN_DIRECTION, DEGREES_MIN, ICON_VALUES, NO_ELEMENTS, SVG_SCALE_MAX, SVG_SCALE_MIN } from './const.js';
import { CCColors, CCCompass, CCDirectionInfo, CCEntity, CCHeader, CCIndicatorSensor, CCProperties, CCValueSensor } from './cardTypes.js';
import { CSSResult, html, LitElement, nothing, PropertyValues, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Direction, svgBackground, svgCircle, svgDirectionLetter, svgTicks } from './render/compass.js';
import { findValues, getBoolean, getCompass, getHeader, getIndicatorSensors, getValueSensors } from './utils/objectHelpers.js';
import { getValue, parseDirection } from './render/direction.js';
import { HomeAssistant, LovelaceCard, LovelaceCardEditor } from './utils/ha-helpers.js';
import { IndicatorShape, svgArrowInward, svgArrowOutward, svgCircleIndicator, svgIconIndicator, svgImageIndicator } from './render/indicators.js';
import { localize, setHassLanguage } from './localize/localize.js';
import { renderHeader, renderIndicatorText, renderValueText, showHeader } from './render/texts.js';
import { CONFIG_DEFAULTS } from './defaults.js';
import { debugLog } from './utils/debug.js';
import handleClick from './utils/handleClick.js';
import { HassEntities } from 'home-assistant-js-websocket';
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

  // Only the entity and image are written explicitly; everything else uses CONFIG_DEFAULTS, which the editor displays as well
  public static getStubConfig(hass?: HomeAssistant): CompassCardConfig {
    const windDirection = Object.keys(hass?.states || {}).find((entityId) => entityId.startsWith('sensor.') && hass?.states[entityId].attributes?.device_class === 'wind_direction');
    const source = windDirection ? { sensor: windDirection } : { attribute: 'azimuth', sensor: 'sun.sun' };
    return {
      indicator_sensors: [
        {
          ...source,
          indicator: { image: CONFIG_DEFAULTS.indicator_sensor.indicator.image },
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
      if (last === 'background_image') {
        throw new Error(
          `Compass Card: ${err.path.join('.')} should be an image URL (e.g. https://example.com/image.png) or a path starting with / (e.g. /local/image.png). More info: https://github.com/tomvanswam/compass-card/wiki/YAML-configuration`,
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
    setHassLanguage(hass.locale?.language ?? hass.language);
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
    const debug = getBoolean(this._config.debug, false);
    debugLog(debug, 'inflated configuration: header', this.header);
    debugLog(debug, 'inflated configuration: compass', this.compass);
    debugLog(debug, 'inflated configuration: indicator sensors', this.indicatorSensors);
    debugLog(debug, 'inflated configuration: value sensors', this.valueSensors);
    debugLog(debug, 'configuration: listening to entities', this.entities);
    debugLog(debug, 'configuration: svgScale', this.svgScale);
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
        @click=${(e: Event) => this.handlePopup(e)}
        @keydown=${(e: KeyboardEvent) => this.handleKeyDown(e)}
      >
        ${this.showHeader() ? renderHeader(this.header, this.entities) : ''}
        <div class="compass">${this.svgCompass(this.compass.north.offset)}</div>
        <div class="sensors">${this.renderIndicatorTexts()} ${this.renderValueTexts()}</div>
      </ha-card>
    `;
  }

  private showHeader(): boolean {
    return showHeader(this.header, this.entities);
  }

  // Value lines of the indicator sensors whose abbreviation or value is shown
  private renderIndicatorTexts(): TemplateResult[] {
    return this.indicatorSensors
      .map((indicator, sensorIndex) => ({ indicator, sensorIndex }))
      .filter(({ indicator }) => isVisible(indicator.state_abbreviation, this.entities) || isVisible(indicator.state_value, this.entities))
      .map(({ indicator, sensorIndex }, index) => {
        const action = this.getSensorAction('indicator_sensors', sensorIndex);
        return html`<div class="sensor-${index} indicator-sensor ${action ? 'clickable' : ''}" @click=${(e: Event) => this.handleSensorClick(e, action, indicator.entity?.entity_id)}>
          ${renderIndicatorText(indicator, this.visibleDirection(indicator), this.entities)}
        </div>`;
      });
  }

  // Value lines of the value sensors that are shown
  private renderValueTexts(): TemplateResult[] {
    return this.valueSensors
      .map((value, sensorIndex) => ({ sensorIndex, value }))
      .filter(({ value }) => isVisible(value.state_value, this.entities))
      .map(({ sensorIndex, value }, index) => {
        const action = this.getSensorAction('value_sensors', sensorIndex);
        return html`<div class="sensor-${index} value-sensor ${action ? 'clickable' : ''}" @click=${(e: Event) => this.handleSensorClick(e, action, value.entity?.entity_id)}>
          ${renderValueText(value, this.entities)}
        </div>`;
      });
  }

  /**
   * Draw compass with indicators
   */
  private svgCompass(directionOffset: number): SVGTemplateResult {
    const { circle, east, north, south, ticks, west } = this.compass;
    const background = activeBackgroundImage(circle, this.entities);
    const circleRotation = circle.offset_background ? directionOffset : DEGREES_MIN;
    const letter = (direction: Direction, properties: CCProperties, name: string) =>
      svgDirectionLetter(direction, localize(`directions.${name}`, '', '', this._config.language), activeColor(properties, this.entities));

    return svg`
    <svg viewbox="0 0 152 152" preserveAspectRatio="xMidYMid meet" class="compass-svg"
         style="--compass-card-svg-scale:${this.svgScale}; --compass-card-svg-image-opacity: ${circle.background_opacity}; --compass-circle-stroke: ${activeColor(circle, this.entities)}; --compass-circle-stroke-width: ${circle.stroke_width}px;">
      <defs>
        <!-- clip the image to the circle so the GIF can animate -->
        <clipPath id="imageClip">
          <circle cx="${CIRCLE.CENTER}" cy="${CIRCLE.CENTER}" r="${CIRCLE.RADIUS}" />
        </clipPath>
      </defs>

      ${background ? svgBackground(background, circleRotation) : ''}
      ${isVisible(circle, this.entities) ? svgCircle(circleRotation) : ''}
        <g class="indicators" transform="rotate(${directionOffset},${CIRCLE.CENTER},${CIRCLE.CENTER})" stroke-width=".5">
          ${ticks.show ? svgTicks(ticks) : ''}
          ${north.show ? letter('north', north, 'N') : ''}
          ${east.show ? letter('east', east, 'E') : ''}
          ${south.show ? letter('south', south, 'S') : ''}
          ${west.show ? letter('west', west, 'W') : ''}
          ${this.indicatorSensors.filter((sensor) => isVisible(sensor.indicator, this.entities)).map((sensor, index) => this.svgIndicator(sensor, index))}
        </g>
    </svg>
    `;
  }

  // One indicator, rotated to its direction; colored and faded through CSS variables
  private svgIndicator(indicatorSensor: CCIndicatorSensor, index: number): SVGTemplateResult {
    const direction = this.visibleDirection(indicatorSensor);
    if (!direction) return svg``;
    const { indicator } = indicatorSensor;
    const shape = { opacity: activeOpacity(indicator, this.entities), radius: activeRadius(indicator, this.entities), size: activeSize(indicator, this.entities) };
    const action = this.getSensorAction('indicator_sensors', this.indicatorSensors.indexOf(indicatorSensor));
    return svg`
      <g class="indicator-${index} ${action ? 'clickable' : ''}" @click=${(e: Event) => this.handleSensorClick(e, action, indicatorSensor.entity?.entity_id)} transform="rotate(${direction.degrees},${CIRCLE.CENTER},${CIRCLE.CENTER})" style="--compass-card-indicator-color: ${activeColor(indicator, this.entities)}; --compass-card-indicator-opacity: ${shape.opacity}">
        ${this.svgIndicatorShape(activeImage(indicator, this.entities), shape)}
      </g>
    `;
  }

  private svgIndicatorShape(image: string, shape: IndicatorShape): SVGTemplateResult {
    switch (image) {
      case 'arrow_outward':
        return svgArrowOutward(shape);
      case 'arrow_inward':
        return svgArrowInward(shape);
      case 'circle':
        return svgCircleIndicator(shape);
      default:
        // an mdi: (or other iconset) icon, else an image url
        return image.startsWith('mdi:') ? svgIconIndicator(this.resolveIconPath(image) ?? mdiCompass, shape) : svgImageIndicator(image, shape);
    }
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

  /**
   * tap_action of the n-th rendered sensor. Rendered sensors skip config entries whose entity is missing,
   * so the same filter is applied to the configuration.
   */
  private getSensorAction(kind: 'indicator_sensors' | 'value_sensors', renderedIndex: number): ActionConfig | undefined {
    const configured = (this._config[kind] ?? []).filter((sensor) => sensor.sensor && this.entities[sensor.sensor]);
    return configured[renderedIndex]?.tap_action;
  }

  // entity is the sensor's own entity id (its `sensor` field includes the attribute, which is no entity), the more-info default
  private handleSensorClick(e: Event, action: ActionConfig | undefined, entity: string | undefined) {
    if (!action) return;
    e.stopPropagation();
    handleClick(this, this._config, action, entity);
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
      handleClick(this, this._config, this._config.tap_action);
    }
  }

  // Direction of an indicator; an unknown direction falls back to the last known one when configured
  private computeIndicator(entity: CCEntity): CCDirectionInfo {
    const info = parseDirection(getValue(entity, this.entities).value, this._config.language);
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

  // The direction to draw, or undefined when an unknown direction is configured to be hidden
  private visibleDirection(entity: CCEntity): CCDirectionInfo | undefined {
    const info = this.computeIndicator(entity);
    return info.unknown && this._config.unknown_direction === 'hide' ? undefined : info;
  }

  static get styles(): CSSResult {
    return style;
  }
}
