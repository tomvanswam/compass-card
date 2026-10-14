import { activeColor, isVisible } from './activeStyle.js';
import { CCDirectionInfo, CCHeader, CCIndicatorSensor, CCValueSensor } from '../cardTypes.js';
import { html, TemplateResult } from 'lit';
import { getValue } from './direction.js';
import { HassEntities } from 'home-assistant-js-websocket';

// The card's texts: the header and the value lines of indicator and value sensors

export function showHeader(header: CCHeader, entities: HassEntities): boolean {
  return isVisible(header.title, entities) || isVisible(header.icon, entities);
}

export function renderHeader(header: CCHeader, entities: HassEntities): TemplateResult {
  return html`
      <div class="header">
        <div class="name" style="--compass-card-header-title-color: ${activeColor(header.title, entities)};">
          ${isVisible(header.title, entities) ? html`<span>${header.title.value} </span>` : html`<span>&nbsp;</span>`}
        </div>
        <div class="icon" style="--compass-card-header-icon-color: ${activeColor(header.icon, entities)};">
          ${isVisible(header.icon, entities) ? html`<ha-icon .icon=${header.icon.value}></ha-icon>` : html`<span>&nbsp;</span>`}
        </div>
      </div>
    `;
}

// Line of an indicator sensor: abbreviation, degrees and units. direction is undefined while it is hidden (unknown)
export function renderIndicatorText(indicator: CCIndicatorSensor, direction: CCDirectionInfo | undefined, entities: HassEntities): TemplateResult {
  return html`
            ${isVisible(indicator.state_abbreviation, entities)
              ? html`<span class="abbr" style="--compass-card-indicator-abbr-color: ${activeColor(indicator.state_abbreviation, entities)};">${direction?.abbreviation ?? ''}</span>`
              : ''}
            ${isVisible(indicator.state_value, entities)
              ? html`<span class="value" style="--compass-card-indicator-value-color: ${activeColor(indicator.state_value, entities)};">${direction?.degrees.toFixed(indicator.decimals) ?? ''}</span>`
              : ''}
            ${isVisible(indicator.state_units, entities)
              ? html` <span class="measurement" style="--compass-card-indicator-units-color: ${activeColor(indicator.state_units, entities)};">${indicator.units}</span> `
              : ''}
          `;
}

// Line of a value sensor: value and units
export function renderValueText(value: CCValueSensor, entities: HassEntities): TemplateResult {
  return html`
            <span class="value" style="--compass-card-value-value-color: ${activeColor(value.state_value, entities)};">${getValue(value, entities).value}</span>
            <span class="measurement" style="--compass-card-value-units-color: ${activeColor(value.state_units, entities)};">${isVisible(value.state_units, entities) ? value.units : ''}</span>
          `;
}
