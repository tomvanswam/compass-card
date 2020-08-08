import { LitElement, html, customElement, property, TemplateResult, CSSResult, css } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { CompassCardConfig } from './types';

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property() public hass?: HomeAssistant;
  @property() private _config?: CompassCardConfig;

  public setConfig(config: CompassCardConfig): void {
    this._config = config;
  }

  get _name(): string {
    if (this._config) {
      return this._config.name || '';
    }

    return '';
  }

  get _entity(): string {
    if (this._config) {
      return this._config.entity || '';
    }

    return '';
  }

  get _secondary_entity(): string {
    if (this._config) {
      return this._config.secondary_entity || '';
    }

    return '';
  }

  get _direction_offset(): string {
    if (this._config) {
      return this._config.direction_offset || '0';
    }
    return '0';
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states); //.filter(eid => eid.substr(0, eid.indexOf('.')) === 'wind');

    return html`
      <div class="card-config">
        <div class="values">
          <paper-input
            label="Name (Optional)"
            .value=${this._name}
            .configValue=${'name'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div class="values">
          <paper-dropdown-menu
            label="Direction Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${'entity'}
          >
            <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._entity)}>
              ${entities.map((entity) => {
                return html` <paper-item>${entity}</paper-item> `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="values">
          <paper-dropdown-menu
            label="Secondary Entity (Required)"
            @value-changed=${this._valueChanged}
            .configValue=${'secondary_entity'}
          >
            <paper-listbox slot="dropdown-content" .selected=${entities.indexOf(this._secondary_entity)}>
              ${entities.map((secondary_entity) => {
                return html` <paper-item>${secondary_entity}</paper-item> `;
              })}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div class="values">
          <paper-input
            label="Direction offset (Optional)"
            .value=${this._direction_offset}
            @value-changed=${this._valueChanged}
            .configValue=${'direction_offset'}
          ></paper-input>
        </div>
      </div>
    `;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
      }
      ha-switch {
        padding-bottom: 8px;
      }
    `;
  }
}
