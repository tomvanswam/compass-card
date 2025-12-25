import './compass-card-indicator-editor';
import './compass-card-indicator-row-editor';
import './compass-card-value-editor';
import './compass-card-value-row-editor';
import { CCCompassConfig, CCNorthConfig, CompassCardConfig } from './editorTypes';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEGREES_MAX, DEGREES_MIN, NO_ELEMENTS } from './const';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from './utils/ha-helpers';
import { localize } from './localize/localize.js';


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

    const schema = this._computeSchema();
    const data = this._computeData();

    if (this._subElementEditorConfig) {
      if (this._subElementEditorConfig.type === 'indicator') {
        return html`
          <compass-card-indicator-editor
            .hass=${this.hass}
            .config=${this._subElementEditorConfig.elementConfig}
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
    const forceLoadSchema = [{ name: 'dummy', selector: { entity: {} } }];

    return html`
      <div style="display: none">
        <ha-form .hass=${this.hass} .data=${{}} .schema=${forceLoadSchema}></ha-form>
      </div>
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${CompassCardEditor._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          ${localize('editor.indicator_sensors')}
        </h3>
        <compass-card-indicator-row-editor
          .hass=${this.hass}
          .entities=${this._config.indicator_sensors}
          .language=${this._config.language}
          @entities-changed=${this._handleIndicatorEntitiesChanged}
          @language-changed=${this._onLanguageChanged}
          @edit-detail-element=${this._editDetailElement}
        ></compass-card-indicator-row-editor>
      </ha-expansion-panel>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          ${localize('editor.value_sensors')}
        </h3>
        <compass-card-value-row-editor
          .hass=${this.hass}
          .entities=${this._config.value_sensors}
          @entities-changed=${this._handleValueEntitiesChanged}
          @edit-detail-element=${this._editDetailElement}
        ></compass-card-value-row-editor>
      </ha-expansion-panel>
    `;
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

  // eslint-disable-next-line class-methods-use-this
  private _computeSchema() {
    return [
      {
        name: 'header_conf',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'header_icon', selector: { icon: {} } },
        ],
        title: localize('editor.header_conf'),
        type: 'expandable',
      },
      {
        name: 'circle_conf',
        schema: [
          { name: 'offset', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
          { name: 'compass_north_show', selector: { boolean: {} } },
          { name: 'compass_east_show', selector: { boolean: {} } },
          { name: 'compass_south_show', selector: { boolean: {} } },
          { name: 'compass_west_show', selector: { boolean: {} } },
          { name: 'compass_circle_stroke', selector: { number: { min: 0, mode: 'box' } } },
          { name: 'compass_ticks_radius', selector: { number: { min: 0, mode: 'box' } } },
          { name: 'compass_ticks_step', selector: { number: { max: 180, min: 1, mode: 'box' } } },
          {
            name: 'background_image_conf',
            schema: [
              { name: 'compass_circle_background_image', selector: { text: {} } },
              { name: 'compass_circle_background_offset', selector: { boolean: {} } },
              { name: 'compass_circle_background_opacity', selector: { number: { max: 1, min: 0, mode: 'box', step: 0.05 } } },
            ],
            title: 'Background Image',
            type: 'expandable',
          },
        ],
        title: localize('editor.circle_conf'),
        type: 'expandable',
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel = (schema: any) => {
    if (schema.name === 'name' || schema.name === 'offset') {
      switch (schema.name) {
        case 'name':
          return `${localize('editor.name')} (${localize('editor.optional')})`;
        case 'offset':
          return `${localize('editor.offset description')} (${localize('editor.optional')})`;
        default:
          return schema.name;
      }
    }
    return localize(`editor.${schema.name}`) || schema.name;
  };

  private _computeData() {
    return {
      circle_conf: {
        background_image_conf: {
          compass_circle_background_image: this._config?.compass?.circle?.background_image || '',
          compass_circle_background_offset: this._config?.compass?.circle?.offset_background || false,
          compass_circle_background_opacity: this._config?.compass?.circle?.background_opacity,
        },
        compass_east_show: this._config?.compass?.east?.show !== false,
        compass_north_show: this._config?.compass?.north?.show !== false,
        compass_south_show: this._config?.compass?.south?.show !== false,
        compass_ticks_radius: this._config?.compass?.ticks?.radius,
        compass_ticks_step: this._config?.compass?.ticks?.step,
        compass_west_show: this._config?.compass?.west?.show !== false,
        offset: this._config?.compass?.north?.offset || DEGREES_MIN,
      },
      header_conf: {
        header_icon: this._config?.header?.icon?.value || '',
        name: this._config?.header?.title?.value || '',
      },
    };
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const config = this._config;

    if (!config) return;

    const newConfig = { ...config };

    const headerData = data.header_conf;
    const circleData = data.circle_conf;

    // Update Name
    if (headerData && 'name' in headerData) {
      const newHeader = { ...newConfig.header };
      const newTitle = newHeader.title ? { ...newHeader.title } : {};

      if (headerData.name === '' || headerData.name === undefined) {
        delete newTitle.value;
        delete newTitle.show;
      } else {
        newTitle.value = headerData.name;
        // Default behavior dictates show is true if value is present, but we can be explicit if needed.
        // For now, let's leave show undefined to rely on default which is true if value is present.
        delete newTitle.show;
      }

      if (Object.keys(newTitle).length === NO_ELEMENTS) {
        delete newHeader.title;
      } else {
        newHeader.title = newTitle;
      }

      if (Object.keys(newHeader).length === NO_ELEMENTS) {
        delete newConfig.header;
      } else {
        newConfig.header = newHeader;
      }
    }

    // Update Offset
    if (circleData && circleData.offset !== undefined) {
      const north: CCNorthConfig = { ...newConfig.compass?.north, offset: Number(circleData.offset) };
      const compass: CCCompassConfig = { ...newConfig.compass, north };
      newConfig.compass = compass;

      if (Number(circleData.offset) === DEGREES_MIN) {
        delete newConfig.compass?.north?.offset;
        // Cleanup if empty
        if (newConfig.compass?.north && Object.keys(newConfig.compass.north).length === NO_ELEMENTS) {
          delete newConfig.compass.north;
        }
      }
    }

    // Update Header Icon
    if (headerData && 'header_icon' in headerData) {
      const newHeader = { ...newConfig.header };
      const newIcon = newHeader.icon ? { ...newHeader.icon } : {};

      if (headerData.header_icon === '' || headerData.header_icon === undefined) {
        delete newIcon.value;
        newIcon.show = false; // Explicitly hide to prevent fallback default icon when title exists
      } else {
        newIcon.value = headerData.header_icon;
        delete newIcon.show; // Allow default behavior (show if value present)
      }

      if (Object.keys(newIcon).length === NO_ELEMENTS) {
        delete newHeader.icon;
      } else {
        newHeader.icon = newIcon;
      }

      if (Object.keys(newHeader).length === NO_ELEMENTS) {
        delete newConfig.header;
      } else {
        newConfig.header = newHeader;
      }
    }


    // Update Compass Directions
    if (circleData) {
      const compass: CCCompassConfig = { ...newConfig.compass };

      // North Show
      if (circleData.compass_north_show !== undefined) {
        compass.north = { ...compass.north, show: circleData.compass_north_show };
      }
      // East Show
      if (circleData.compass_east_show !== undefined) {
        compass.east = { ...compass.east, show: circleData.compass_east_show };
      }
      // South Show
      if (circleData.compass_south_show !== undefined) {
        compass.south = { ...compass.south, show: circleData.compass_south_show };
      }
      // West Show
      if (circleData.compass_west_show !== undefined) {
        compass.west = { ...compass.west, show: circleData.compass_west_show };
      }

      // Circle
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circle: any = { ...compass.circle };
      const backgroundData = circleData.background_image_conf || {};

      if (backgroundData.compass_circle_background_image !== undefined) circle.background_image = backgroundData.compass_circle_background_image;
      if (backgroundData.compass_circle_background_opacity !== undefined) circle.background_opacity = backgroundData.compass_circle_background_opacity;
      if (backgroundData.compass_circle_background_offset !== undefined) circle.offset_background = backgroundData.compass_circle_background_offset;
      if (circleData.compass_circle_stroke !== undefined) circle.stroke_width = circleData.compass_circle_stroke;
      compass.circle = circle;

      // Ticks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ticks: any = { ...compass.ticks };
      if (circleData.compass_ticks_radius !== undefined) ticks.radius = circleData.compass_ticks_radius;
      if (circleData.compass_ticks_step !== undefined) ticks.step = circleData.compass_ticks_step;
      compass.ticks = ticks;

      newConfig.compass = compass;
    }


    // Cleanup compass if empty
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
      ha-form {
        width: 100%;
      }
    `;
  }
}
