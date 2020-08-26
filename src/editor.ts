import { LitElement, html, customElement, property, TemplateResult, CSSResult, css, internalProperty } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { CompassCardConfig } from './types';
import {
  INDICATORS,
  DEFAULT_INDICATOR,
  CONFIG_COMPASS,
  CONFIG_INDICATOR,
  CONFIG_ENTITY,
  CONFIG_SECONDARY_ENTITY,
  CONFIG_DIRECTION_OFFSET,
  CONFIG_NAME,
  CONFIG_SHOW_NORTH,
  CONFIG_DOMAINS,
  CONFIG_LANGUAGE,
} from './const';

import { localize, COMPASS_LANGUAGES } from './localize/localize';

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @internalProperty() private _config?: CompassCardConfig;

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

  get _compass_indicator(): string {
    if (this._config) {
      return this._config?.compass?.indicator || INDICATORS[DEFAULT_INDICATOR];
    }
    return INDICATORS[DEFAULT_INDICATOR];
  }

  get _compass_show_north(): boolean {
    if (this._config) {
      return this._config?.compass?.show_north || false;
    }
    return false;
  }

  get _compass_language(): string {
    if (this._config) {
      return this._config?.compass?.language || '';
    }
    return '';
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    // You can restrict on domain type
    const entities = Object.keys(this.hass.states)
      .filter((eid) => CONFIG_DOMAINS.includes(eid.substr(0, eid.indexOf('.'))))
      .sort();

    return html`
      <div class="card-config">
        ${this.getEditorInput('editor.name', 'editor.optional', CONFIG_NAME, this._name)}
        ${this.getEditorDropDown('editor.primary entity description', 'editor.required', CONFIG_ENTITY, this._entity, entities)}
        ${this.getEditorDropDown('editor.secondary entity description', 'editor.optional', CONFIG_SECONDARY_ENTITY, this._secondary_entity, entities)}
        ${this.getEditorDropDown('editor.indicator', 'editor.optional', CONFIG_COMPASS + '.' + CONFIG_INDICATOR, this._compass_indicator, INDICATORS)}
        ${this.getEditorDropDown('editor.language description', 'editor.optional', CONFIG_COMPASS + '.' + CONFIG_LANGUAGE, this._compass_language, COMPASS_LANGUAGES)}
        ${this.getEditorInput('editor.offset description', 'editor.optional', CONFIG_DIRECTION_OFFSET, this._direction_offset)}
        ${this.getEditorSwitch('editor.show north description', CONFIG_COMPASS + '.' + CONFIG_SHOW_NORTH, this._compass_show_north)}
      </div>
    `;
  }

  private getValue(item, ancestor) {
    const dotLoc = item.configValue.indexOf('.');
    if (dotLoc > -1) {
      const parent = item.configValue.substr(0, dotLoc);
      const child = item.configValue.substr(dotLoc + 1, item.configValue.length);
      if (child.indexOf('.') > -1) {
        this.getValue(item, child);
      }
      return {
        ...ancestor,
        [parent]: {
          ...ancestor[parent],
          [child]: item.checked !== undefined ? item.checked : item.value,
        },
      };
    } else {
      return {
        ...ancestor,
        [item.configValue]: item.checked !== undefined ? item.checked : item.value,
      };
    }
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.checked !== undefined) {
      if (this[`_${target.configValue}`] === target.checked) {
        return;
      }
    } else if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      this._config = this.getValue(target, this._config);
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  private getEditorDropDown(label: string, required: string, key: string, value: string, list): TemplateResult {
    return html` <paper-dropdown-menu class="editor-entity-select" label="${localize(label)} (${localize(required)})" @value-changed=${this._valueChanged} .configValue=${key}>
      <paper-listbox slot="dropdown-content" .selected=${list.indexOf(value)}>
        ${list.map((listItem) => {
          return html` <paper-item>${listItem}</paper-item> `;
        })}
      </paper-listbox>
    </paper-dropdown-menu>`;
  }

  private getEditorInput(label: string, required: string, key: string, value: string): TemplateResult {
    return html`<paper-input label="${localize(label)} (${localize(required)})" .value=${value} .configValue=${key} @value-changed=${this._valueChanged}></paper-input>`;
  }

  private getEditorSwitch(label: string, key: string, value: boolean): TemplateResult {
    return html`        
      <div class="floated-label-placeholder">
          ${localize(label)}
        </div>
        <ha-switch
          aria-label=${`${localize('editor.toggle')} ${localize('directions.north')} ${value ? localize('common.off') : localize('common.on')}`}
          .checked=${this._compass_show_north !== false}
          .configValue=${key}
          @change=${this._valueChanged}
          >${localize(label)}</ha-switch>
      </div>`;
  }

  static get styles(): CSSResult {
    return css`
      .editor-entity-select {
        width: 100%;
      }

      ha-switch {
        padding-bottom: 8px;
      }
      .floated-label-placeholder {
        font-family: var(--paper-font-caption_-_font-family);
        -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
        white-space: var(--paper-font-caption_-_white-space);
        overflow: var(--paper-font-caption_-_overflow);
        text-overflow: var(--paper-font-caption_-_text-overflow);
        font-size: var(--paper-font-caption_-_font-size);
        font-weight: var(--paper-font-caption_-_font-weight);
        letter-spacing: var(--paper-font-caption_-_letter-spacing);
        line-height: var(--paper-font-caption_-_line-height);
      }
    `;
  }
}
