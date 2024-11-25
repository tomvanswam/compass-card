import {
  LitElement,
  html,
  CSSResult,
  nothing,
  css,
  CSSResultGroup,
  TemplateResult,
  PropertyValues,
  svg,
  SVGTemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  actionHandler,
  ActionHandlerEvent,
  computeRTL,
  handleAction,
  hasAction,
  HomeAssistant,
  isActive,
  LovelaceCard,
  LovelaceCardEditor,
  LovelaceGridOptions,
  LovelaceLayoutOptions,  
} from "../../ha";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";
// import { CompassCardConfig } from './editorTypes';
import {
  CcColors,
  CcCompass,
  CcDirectionInfo,
  CcEntity,
  CcHeader,
  CcIndicatorSensor,
  CcValueSensor,
  CcValue,
  CcProperties,
} from "./compass-card-config";
// import handleClick from '../../utils/handleClick';
import { registerCustomCard } from "../../utils/custom-cards";
import { COMPASS_CARD_EDITOR_NAME, COMPASS_CARD_NAME } from "./const";
import { CompassCardConfig } from "./compass-card-config";
import { CcBaseCard } from "../../utils/base-card";
import { CcBaseElement } from "../../utils/base-element";
import { computeEntityPicture } from "../../utils/info";
import { computeRgbColor } from "../../utils/colors";
import { computeAppearance } from "../../utils/appearance";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { cardStyle } from "../../utils/card-styles";

import "./compass-card-editor";
// import style from './style';

import { COMPASS_ABBREVIATIONS, COMPASS_POINTS } from "../../const";

import setupCustomlocalize from "../../localize";
import {
  getHeader,
  getCompass,
  getIndicatorSensors,
  getValueSensors,
  getBoolean,
  findValues,
  isNumeric,
} from "../../utils/objectHelpers";

registerCustomCard({
  type: COMPASS_CARD_NAME,
  name: "Compass Card",
  description:
    "Show a compass with an indicator in the direction of the entity's value",
});

@customElement(COMPASS_CARD_NAME)
export class CompassCard
  extends CcBaseElement
  implements LovelaceCard
{
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./compass-card-editor");
    return document.createElement(
      COMPASS_CARD_EDITOR_NAME
    ) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    hass: HomeAssistant
  ): Promise<CompassCardConfig> {
    const entities = Object.keys(hass.states);
    return {
      type: `custom:${COMPASS_CARD_NAME}`,
      indicator_sensors: [{ sensor: entities[0] }],
    };
  }

  @state() private _config?: CompassCardConfig;  

  @property({ reflect: true, type: String })
  public layout: string | undefined;  

  private _handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action!);
  }

  setConfig(config: CompassCardConfig): void {
    this._config = {
      tap_action: {
        action: "toggle",
      },
      hold_action: {
        action: "more-info",
      },
      ...config,
    };
  }

  public getCardSize(): number | Promise<number> {
    let height = 1;
    if (!this._config) return height;
    const appearance = computeAppearance(this._config);
    if (appearance.layout === "vertical") {
      height += 1;
    }
    return height;
  }

  public getLayoutOptions(): LovelaceLayoutOptions {
    const options: LovelaceLayoutOptions = {
      grid_columns: 2,
      grid_rows: 1,
    };
    if (!this._config) return options;
    const appearance = computeAppearance(this._config);
    if (appearance.layout === "vertical") {
      options.grid_rows! += 1;
    }
    if (appearance.layout === "horizontal") {
      options.grid_columns = 4;
    }
    if (this._config?.multiline_secondary) {
      options.grid_rows = undefined;
    }
    return options;
  }

  // For HA < 2024.11
  public getGridOptions(): LovelaceGridOptions {
    // No min and max because the content can be dynamic
    const options: LovelaceGridOptions = {
      columns: 6,
      rows: 1,
    };
    if (!this._config) return options;
    const appearance = computeAppearance(this._config);
    if (appearance.layout === "vertical") {
      options.rows! += 1;
    }
    if (appearance.layout === "horizontal") {
      options.columns = 12;
    }
    if (this._config?.multiline_secondary) {
      options.rows = undefined;
    }
    return options;
  } 

  // @property({ attribute: false }) public _hass!: HomeAssistant;
  // @property({ attribute: false }) protected _config!: CompassCardConfig;
  @state() protected colors!: CcColors;
  @state() protected header!: CcHeader;
  @state() protected compass!: CcCompass;
  @state() protected indicatorSensors!: CcIndicatorSensor[];
  @state() protected entities: HassEntities = {};
  @state() protected valueSensors!: CcValueSensor[];

  // public setConfig(config: CompassCardConfig): void {
  //   const customLocalize = setupCustomlocalize(this.hass!);
  //   if (!config) {
  //     throw new Error(customLocalize('common.invalid_configuration'));
  //   }

  //   if (!config.indicator_sensors || !config.indicator_sensors[0].sensor) {
  //     throw new Error(customLocalize('common.missing_direction_entity'));
  //   }

  //   // if (config.test_gui) {
  //   //   getLovelace().setEditMode(true);
  //   // }

  //   this.colors = {
  //     accent: 'var(--accent-color)',
  //     primary: 'var(--primary-color)',
  //     stateIcon: 'var(--state-icon-color)',
  //     secondaryText: 'var(--secondary-text-color)',
  //     primaryText: 'var(--primary-text-color)',
  //   };

  //   this._config = {
  //     ...config,
  //   };

  //   this.updateConfig(hass, this._config);
  // }

  // public getCardSize(): number {
  //   return 5;
  // }

  // set hass(hass: HomeAssistant) {
  //   this._hass = hass;
  //   this.updateConfig(this._hass, this._config);
  // }

  // protected shouldUpdate(changedProps: PropertyValues): boolean {
  //   if (changedProps.has('_config')) {
  //     return true;
  //   }
  //   if (changedProps.has('_hass')) {
  //     const newHass = changedProps.get('_hass') as HomeAssistant;
  //     for (const entity in this.entities) {
  //       if (newHass.states[entity].last_updated !== this._hass.states[entity].last_updated) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  // private updateConfig(hass: HomeAssistant, config: CompassCardConfig): void {
  //   if (!hass || !config) {
  //     return;
  //   }
  //   const stringEntities = findValues(this._config, hass.states, getBoolean(this._config.debug, false));
  //   stringEntities.forEach((stringEntity) => {
  //     if (this._hass.states[stringEntity]) {
  //       const entity = this._hass.states[stringEntity];
  //       this.entities[entity.entity_id] = this._hass.states[stringEntity];
  //     }
  //   });
  //   this.header = getHeader(this._config, this.colors, this.entities[this._config?.indicator_sensors[0].sensor], this.entities);
  //   this.compass = getCompass(this._config, this.colors, this.entities);
  //   this.indicatorSensors = getIndicatorSensors(this._config, this.colors, this.entities);
  //   this.valueSensors = getValueSensors(this._config, this.colors, this.entities);
  //   if (getBoolean(this._config.debug, false)) {
  //     console.info('Compass-Card inflated configuration: header', this.header); // eslint-disable-line
  //     console.info('Compass-Card inflated configuration: compass', this.compass); // eslint-disable-line
  //     console.info('Compass-Card inflated configuration: indicator sensors', this.indicatorSensors); //eslint-disable-line
  //     console.info('Compass-Card inflated configuration: value sensors', this.valueSensors); //eslint-disable-line
  //     console.info('Compass-Card configuration: listening to entities', this.entities); // eslint-disable-line
  //   }
  // }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const rtl = computeRTL(this.hass);

    const name = this._config.name || ""; //this._config.entity.attributes.friendly_name || 
    const icon = this._config.icon;
    const appearance = computeAppearance(this._config);

    const picture = computeEntityPicture(this._config.entity, appearance.icon_type);

    //  @click=${(e) => this.handlePopup(e)}

    return html`
      <ha-card
        class=${classMap({ "fill-container": appearance.fill_container })}
      >
        <cc-card .appearance=${appearance} ?rtl=${rtl}>
          <cc-state-item
            ?rtl=${rtl}
            .appearance=${appearance}
            @action=${this._handleAction}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this._config.hold_action),
              hasDoubleClick: hasAction(this._config.double_tap_action),
            })}
          >
            <div class="content">
              <div class="compass">
                ${this.svgCompass(this.compass.north.offset)}
              </div>
              <div class="indicator-sensors">${this.renderDirections()}</div>
              <div class="value-sensors">${this.renderValues()}</div>
            </div>
          </cc-state-item>
        </cc-card>
      </ha-card>
    `;
    // return html`
    //   <ha-card tabindex="0" .label=${`Compass: ${this.header.label}`} class="flex compass-card" >

    //     ${this.getVisibility(this.header.title) || this.getVisibility(this.header.icon) ? this.renderHeader() : ''}

    //   </ha-card>
    // `;
  }

  /**
   * Render Header (title and icon on top of card)
   */

  // private renderHeader(): TemplateResult {
  //   return html`
  //     <div class="header">
  //       <div class="name" style="color:${this.getColor(this.header.title)};">${this.getVisibility(this.header.title) ? this.renderTitle() : html`<span>&nbsp;</span>`}</div>
  //       <div class="icon" style="color:${this.getColor(this.header.icon)};">${this.getVisibility(this.header.icon) ? this.renderIcon() : html`<span>&nbsp;</span>`}</div>
  //     </div>
  //   `;
  // }

  private renderTitle(): TemplateResult {
    return html`<span>${this.header.title.value} </span>`;
  }

  // private renderIcon(): TemplateResult {
  //   return html`<ha-icon .icon=${this.header.icon.value}></ha-icon>`;
  // }

  /**
   * Render Directions (abbreviation/degrees inside compass)
   */

  private renderDirections(): TemplateResult[] {
    const divs: TemplateResult[] = [];
    let index = 0;

    this.indicatorSensors.forEach((indicator) => {
      if (
        this.getVisibility(indicator.state_abbreviation) ||
        this.getVisibility(indicator.state_value)
      ) {
        divs.push(
          html`<div class="sensor-${index}">
            <span
              class="abbr"
              style="color: ${this.getColor(indicator.state_abbreviation)};"
              >${this.getVisibility(indicator.state_abbreviation)
                ? this.computeIndicator(indicator).abbreviation
                : ""}</span
            >
            <span
              class="value"
              style="color: ${this.getColor(indicator.state_value)};"
              >${this.getVisibility(indicator.state_value)
                ? this.computeIndicator(indicator).degrees.toFixed(
                    indicator.decimals
                  )
                : ""}</span
            >
            <span
              class="measurement"
              style="color: ${this.getColor(indicator.state_units)};"
              >${this.getVisibility(indicator.state_units)
                ? indicator.units
                : ""}</span
            >
          </div>`
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
            <span
              class="value"
              style="color: ${this.getColor(value.state_value)};"
              >${this.getVisibility(value.state_value)
                ? this.getValue(value).value
                : ""}</span
            >
            <span
              class="measurement"
              style="color: ${this.getColor(value.state_units)};"
              >${this.getVisibility(value.state_units) ? value.units : ""}</span
            >
          </div>`
        );
        index++;
      }
    });
    return divs;
  }

  private getVisibility(properties: CcProperties): boolean {
    if (properties.dynamic_style.bands.length === 0) {
      return properties.show;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter(
        (band) => band.from_value <= Number(value.value)
      );
      return getBoolean(
        usableBands[usableBands.length - 1]?.show,
        properties.show
      );
    }
    return properties.show;
  }

  private getColor(properties: CcProperties): string {
    if (properties.dynamic_style.bands.length === 0) {
      return properties.color;
    }
    const value = this.getValue(properties.dynamic_style);
    if (isNumeric(value.value)) {
      const usableBands = properties.dynamic_style.bands.filter(
        (band) => band.from_value <= Number(value.value)
      );
      return usableBands[usableBands.length - 1]?.color || properties.color;
    }
    return properties.color;
  }

  /**
   * Draw compass with indicators
   */

  private svgCompass(directionOffset: number): SVGTemplateResult {
    return svg`
    <svg viewbox="0 0 152 152" preserveAspectRatio="xMidYMin slice" style="width: 100%; padding-bottom: 92%; height: 1px; overflow: visible">
      <defs>
        <pattern id="image" x="0" y="0" patternContentUnits="objectBoundingBox" height="100%" width="100%">
          <image x="0" y="0" height="1" width="1" href="${this.compass.circle.background_image}" preserveAspectRatio="xMidYMid meet"></image>
        </pattern>
      </defs>
      ${this.getVisibility(this.compass.circle) ? this.svgCircle(this.compass.circle.offset_background ? directionOffset : 0) : ""}
        <g class="indicators" transform="rotate(${directionOffset},76,76)" stroke-width=".5">
          ${this.compass.north.show ? this.svgIndicatorNorth() : ""}
          ${this.compass.east.show ? this.svgIndicatorEast() : ""}
          ${this.compass.south.show ? this.svgIndicatorSouth() : ""}
          ${this.compass.west.show ? this.svgIndicatorWest() : ""}
          ${this.svgIndicators()}
        </g>
    </svg>
    `;
  }

  private svgCircle(directionOffset: number): SVGTemplateResult {
    return svg`<circle class="circle" cx="76" cy="76" r="62" stroke="${this.getColor(this.compass.circle)}" stroke-width="2" fill="${this.circleFill()}" fill-opacity="${
      this.compass.circle.background_opacity
    }" stroke-opacity="1.0" transform="rotate(${directionOffset},76,76)" />`;
  }

  private circleFill(): string {
    return this.compass.circle.background_image === ""
      ? "white"
      : "url(#image)";
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

  private svgIndicator(indicatorSensor: CcIndicatorSensor): SVGTemplateResult {
    switch (indicatorSensor.indicator.type) {
      case "arrow_outward":
        return this.svgIndicatorArrowOutward(indicatorSensor);
      case "circle":
        return this.svgIndicatorCircle(indicatorSensor);
      default:
    }
    return this.svgIndicatorArrowInward(indicatorSensor);
  }

  private svgSingleIndicator(
    indicatorSensor: CcIndicatorSensor,
    index = 0
  ): SVGTemplateResult {
    const indicatorPath = this.svgIndicator(indicatorSensor);
    const { degrees } = this.computeIndicator(indicatorSensor);

    return svg`
      <g class="indicator-${index}" transform="rotate(${degrees},76,76)">
        ${indicatorPath}
      </g>
    `;
  }

  private svgIndicatorArrowOutward(
    indicatorSensor: CcIndicatorSensor
  ): SVGTemplateResult {
    return svg`
      <g class="arrow-outward">
        <path d="M76 0v23l-8 7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width=".5"/>
        <path d="M76 0v23l8 7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width="0"/>
        <path d="M76 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
  }

  private svgIndicatorArrowInward(
    indicatorSensor: CcIndicatorSensor
  ): SVGTemplateResult {
    return svg`
      <g class="arrow-inward">
        <path d="M76 30.664v-23l-8-7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width=".5" />
        <path d="M76 30.664v-23l8-7z" fill="${this.getColor(indicatorSensor.indicator)}" stroke="${this.getColor(indicatorSensor.indicator)}" stroke-width="0" />
        <path d="M76 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
  }

  private svgIndicatorCircle(
    indicatorSensor: CcIndicatorSensor
  ): SVGTemplateResult {
    return svg`
      <g class="circle">
        <path d="m76 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1809 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z" fill="${this.getColor(
          indicatorSensor.indicator
        )}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="${this.getColor(indicatorSensor.indicator)}"/>
        <path d="m76 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z" fill="white" opacity="0.5"/>
      </g>
    `;
  }

  private svgIndicatorNorth(): SVGTemplateResult {
    const customLocalize = setupCustomlocalize(this.hass!);
    return svg`
      <g class="north">
        <text x="76" y="10.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.getColor(this.compass.north)}">
          <tspan x="76" y="11">${customLocalize("directions.N")}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorEast(): SVGTemplateResult {
    const customLocalize = setupCustomlocalize(this.hass!);
    return svg`
      <g class="east">
        <text x="140" y="80.089" font-family="sans-serif" font-size="13.333" text-anchor="right" fill="${this.getColor(this.compass.east)}">
          <tspan x="140" y="81">${customLocalize("directions.E")}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorSouth(): SVGTemplateResult {
    const customLocalize = setupCustomlocalize(this.hass!);
    return svg`
      <g class="south">
        <text x="76" y="150.089" font-family="sans-serif" font-size="13.333" text-anchor="middle" fill="${this.getColor(this.compass.south)}">
          <tspan x="76" y="151">${customLocalize("directions.S")}</tspan>
        </text>
      </g>
    `;
  }

  private svgIndicatorWest(): SVGTemplateResult {
    const customLocalize = setupCustomlocalize(this.hass!);
    return svg`
      <g class="west">
        <text x="-2" y="80.089" font-family="sans-serif" font-size="13.333" text-anchor="left" fill="${this.getColor(this.compass.west)}">
          <tspan x="-2" y="81">${customLocalize("directions.W")}</tspan>
        </text>
      </g>
    `;
  }

  private getValue(entity: CcEntity): CcValue {
    const customLocalize = setupCustomlocalize(this.hass!);
    if (entity.is_attribute) {
      const entityStr = entity.sensor.slice(0, entity.sensor.lastIndexOf("."));
      const entityObj = this.entities[entityStr];
      if (entityObj && entityObj.attributes) {
        const attribStr = entity.sensor.slice(
          entity.sensor.lastIndexOf(".") + 1
        );
        const value =
          entityObj.attributes[attribStr] || customLocalize("common.invalid");
        return {
          value: isNumeric(value)
            ? Number(value).toFixed(entity.decimals)
            : value,
          units: entity.units,
        };
      }
      return { value: customLocalize("directions.W"), units: entity.units };
    }
    const value =
      this.entities[entity.sensor]?.state || customLocalize("directions.W");
    return {
      value: isNumeric(value) ? Number(value).toFixed(entity.decimals) : value,
      units: entity.units,
    };
  }

  // private handlePopup(e) {
  //   e.stopPropagation();
  //   if (this._config.tap_action) {
  //     handleClick(this, this._hass, this._config, this._config.tap_action);
  //   }
  // }

  renderIcon(stateObj: HassEntity, icon?: string): TemplateResult {
    const active = isActive(stateObj);
    const iconStyle = {};
    // const iconColor = this._config?.icon_color;
    // if (iconColor) {
    //   const iconRgbColor = computeRgbColor(iconColor);
    //   iconStyle["--icon-color"] = `rgb(${iconRgbColor})`;
    //   iconStyle["--shape-color"] = `rgba(${iconRgbColor}, 0.2)`;
    // }
    return html`
      <cc-shape-icon
        slot="icon"
        .disabled=${!active}
        style=${styleMap(iconStyle)}
      >
        <ha-state-icon
          .hass=${this.hass}
          .stateObj=${stateObj}
          .icon=${icon}
        ></ha-state-icon>
      </cc-shape-icon>
    `;
  }

  private computeIndicator(entity: CcEntity): CcDirectionInfo {
    const customLocalize = setupCustomlocalize(this.hass!);
    // default to North
    let degrees = 0;
    let abbreviation = customLocalize("common.invalid");

    /* The direction entity may either return degrees or a named abbreviations, thus
           determine the degrees and abbreviation with whichever data was returned. */
    const directionStr = this.getValue(entity);

    if (Number.isNaN(Number(directionStr.value))) {
      degrees = CompassCard.getDegrees(directionStr.value);
      abbreviation = directionStr.value;
      if (degrees === -1) {
        const matches = directionStr.value
          .replace(/\s+/g, "")
          .match(/[+-]?\d+(\.\d)?/);
        if (matches?.length) {
          degrees = CompassCard.positiveDegrees(parseFloat(matches[0]));
        } else {
          degrees = 0;
        }
        abbreviation = this.getCompassAbbreviation(degrees);
      } else {
        abbreviation = this.getCompassAbbreviation(degrees);
      }
    } else {
      degrees = CompassCard.positiveDegrees(parseFloat(directionStr.value));
      abbreviation = this.getCompassAbbreviation(degrees);
    }
    return { abbreviation, degrees: Math.round(degrees) };
  }

  // static get styles(): CSSResult {
  //   return style;
  // }

  static getDegrees(abbrevation: string): number {
    if (COMPASS_POINTS[abbrevation.toUpperCase()]) {
      return COMPASS_POINTS[abbrevation.toUpperCase()];
    }
    return -1;
  }

  private getCompassAbbreviation(degrees: number): string {
    const customLocalize = setupCustomlocalize(this.hass!);
    const index = Math.round(CompassCard.positiveDegrees(degrees) / 22.5);
    let string = "N";
    string = COMPASS_ABBREVIATIONS[index];
    if (index > 15) {
      string = COMPASS_ABBREVIATIONS[0];
    }
    return customLocalize(`directions.${string}`);
  }

  static positiveDegrees(degrees: number): number {
    return degrees < 0
      ? degrees + (Math.abs(Math.ceil(degrees / 360)) + 1) * 360
      : degrees % 360;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      cardStyle,
      css`
        compass-state-item {
          cursor: pointer;
        }
        compass-shape-icon {
          --icon-color: rgb(var(--rgb-state-entity));
          --shape-color: rgba(var(--rgb-state-entity), 0.2);
        }
      `,
    ];
  }
}
