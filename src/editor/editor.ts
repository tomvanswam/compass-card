import { actionData, actionFromData, actionSchema } from './actionForm';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_UNKNOWN_DIRECTION, NO_ELEMENTS } from '../const';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from '../utils/ha-helpers';
import { CompassCardConfig } from './editorTypes';
import { localize } from '../localize/localize.js';
import { setOrDelete } from './editorHelpers';

// eslint-disable-next-line sort-imports
import './compass-card-compass-editor';
import './compass-card-dynamic-style-editor';
import './compass-card-header-editor';
import './compass-card-indicator-editor';
import './compass-card-indicator-row-editor';
import './compass-card-value-editor';
import './compass-card-value-row-editor';

interface CardHelpers {
  // eslint-disable-next-line no-unused-vars
  importMoreInfoControl(type: string): void;
}

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _helpers?: CardHelpers;
  @state() private _config?: CompassCardConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @state() private _subElementEditorConfig?: any;
  private _initialized = false;

  public setConfig(config: CompassCardConfig): void {
    this._config = config;
    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers || !this._config) {
      return html``;
    }

    // The climate more-info has ha-switch and paper-dropdown-menu elements that are lazy loaded unless explicitly done here
    this._helpers.importMoreInfoControl('climate');

    if (this._subElementEditorConfig) {
      if (this._subElementEditorConfig.type === 'indicator') {
        return html`
          <compass-card-indicator-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
            .index=${this._subElementEditorConfig.index}
            @go-back=${this._goBack}
            @config-changed=${this._handleSubElementChanged}
          ></compass-card-indicator-editor>
        `;
      }
      if (this._subElementEditorConfig.type === 'value') {
        return html`
          <compass-card-value-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
            @go-back=${this._goBack}
            @config-changed=${this._handleSubElementChanged}
          ></compass-card-value-editor>
        `;
      }
    }

    // Force load of ha-entity-picker by using it in a hidden ha-form
    const forceLoadSchema = [{ name: 'dummy_conf', selector: { entity: {} } }];

    return html`
      <div style="display: none">
        <ha-form .hass=${this.hass} .data=${{}} .schema=${forceLoadSchema}></ha-form>
      </div>
      <compass-card-header-editor
        .hass=${this.hass}
        .config=${this._config.header}
        @config-changed=${this._handleHeaderConfigChanged}
      ></compass-card-header-editor>
      <compass-card-compass-editor
        .hass=${this.hass}
        .config=${this._config.compass}
        @config-changed=${this._handleCompassConfigChanged}
      ></compass-card-compass-editor>
      <compass-card-indicator-row-editor
        .hass=${this.hass}
        .entities=${this._config.indicator_sensors}
        .language=${this._config.language}
        .unknownDirection=${this._config.unknown_direction}
        .label=${localize('editor.indicator_sensors')}
        @entities-changed=${this._handleIndicatorEntitiesChanged}
        @language-changed=${this._onLanguageChanged}
        @unknown-direction-changed=${this._onUnknownDirectionChanged}
        @edit-detail-element=${this._editDetailElement}
      ></compass-card-indicator-row-editor>
      <compass-card-value-row-editor
        .hass=${this.hass}
        .entities=${this._config.value_sensors}
        .label=${localize('editor.value_sensors')}
        @entities-changed=${this._handleValueEntitiesChanged}
        @edit-detail-element=${this._editDetailElement}
      ></compass-card-value-row-editor>
      <ha-form
        .hass=${this.hass}
        .data=${this._computeCardData()}
        .schema=${this._computeCardSchema()}
        .computeLabel=${CompassCardEditor._computeCardLabel}
        @value-changed=${this._handleCardConfigChanged}
      ></ha-form>
    `;
  }

  // Card level options: tap action and debug logging
  private _computeCardData() {
    return {
      card_conf: {
        debug: this._config?.debug === true,
        tap_action: actionData(this._config?.tap_action),
      },
    };
  }

  private _computeCardSchema() {
    return [
      {
        name: 'card_conf',
        schema: [
          { name: 'tap_action', schema: actionSchema(actionData(this._config?.tap_action)), title: localize('editor.tap_action.title'), type: 'expandable' },
          { name: 'debug', selector: { boolean: {} } },
        ],
        title: localize('editor.card_conf'),
        type: 'expandable',
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeCardLabel(schema: any): string {
    return localize(`editor.${schema.name}`) || localize(`editor.tap_action.${schema.name}`) || schema.name;
  }

  private _handleCardConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const cardData = ev.detail.value.card_conf;
    if (!this._config || !this.hass || !cardData) {
      return;
    }
    const newConfig: CompassCardConfig = { ...this._config };
    setOrDelete(newConfig, 'tap_action', actionFromData(cardData.tap_action, this._config.tap_action));
    setOrDelete(newConfig, 'debug', cardData.debug, false);
    this._config = newConfig;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _editDetailElement(ev: CustomEvent): void {
    this._subElementEditorConfig = ev.detail.subElementConfig;
  }

  private _goBack(): void {
    this._subElementEditorConfig = undefined;
  }

  private _handleSubElementChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const configValue = this._subElementEditorConfig.type;
    const value = ev.detail.config;

    if (configValue === 'indicator') {
      const newConfigEntities = [...(this._config.indicator_sensors || [])];
      newConfigEntities[this._subElementEditorConfig.index] = value;
      this._config = { ...this._config, indicator_sensors: newConfigEntities };
    } else if (configValue === 'value') {
      const newConfigEntities = [...(this._config.value_sensors || [])];
      newConfigEntities[this._subElementEditorConfig.index] = value;
      this._config = { ...this._config, value_sensors: newConfigEntities };
    }

    this._subElementEditorConfig = {
      ...this._subElementEditorConfig,
      elementConfig: value,
    };

    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _handleIndicatorEntitiesChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { entities } = ev.detail;
    this._config = { ...this._config, indicator_sensors: entities };
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _handleValueEntitiesChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { entities } = ev.detail;
    this._config = { ...this._config, value_sensors: entities };
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _onLanguageChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { language } = ev.detail;
    this._config = {
      ...this._config,
      language,
    };
    if (!language) delete this._config.language;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _onUnknownDirectionChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { unknownDirection } = ev.detail;
    this._config = { ...this._config, unknown_direction: unknownDirection };
    // The default fallback is left out of the YAML
    if (!unknownDirection || unknownDirection === DEFAULT_UNKNOWN_DIRECTION) delete this._config.unknown_direction;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _handleHeaderConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { config } = ev.detail;
    const newConfig = { ...this._config, header: config };
    if (newConfig.header && Object.keys(newConfig.header).length === NO_ELEMENTS) {
      delete newConfig.header;
    }
    this._config = newConfig;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _handleCompassConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }
    const { config } = ev.detail;
    const newConfig = { ...this._config, compass: config };
    if (newConfig.compass && Object.keys(newConfig.compass).length === NO_ELEMENTS) {
      delete newConfig.compass;
    }
    this._config = newConfig;
    fireEvent(this as unknown as HTMLElement, 'config-changed', { config: this._config });
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._helpers = await (window as any).loadCardHelpers();
  }

  static get styles(): CSSResult {
    return css`
      /* small space between the Header, Compass, Indicators and Values groups */
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
      }
      ha-form {
        width: 100%;
      }
      ha-expansion-panel {
        margin-top: 24px;
      }
    `;
  }
}
