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
    const forceLoadSchema = [{ name: 'dummy_conf', selector: { entity: {} } }];

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
          { name: 'header_title_conf', selector: { text: {} } },
          {
            name: '',
            schema: [
              { name: 'header_title_show_conf', selector: { boolean: {} } },
              { name: 'header_title_color_conf', selector: { text: {} } },
            ],
            type: 'grid',
          },
          { name: 'header_icon_conf', selector: { icon: {} } },
          {
            name: '',
            schema: [
              { name: 'header_icon_show_conf', selector: { boolean: {} } },
              { name: 'header_icon_color_conf', selector: { text: {} } },
            ],
            type: 'grid',
          },
        ],
        title: localize('editor.header_conf'),
        type: 'expandable',
      },
      {
        name: 'compass_conf',
        schema: [
          { name: 'compass_offset_conf', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
          {
            name: '',
            schema: [
              { name: 'compass_north_show_conf', selector: { boolean: {} } },
              { name: 'compass_north_color_conf', selector: { text: {} } },
              { name: 'compass_east_show_conf', selector: { boolean: {} } },
              { name: 'compass_east_color_conf', selector: { text: {} } },
              { name: 'compass_south_show_conf', selector: { boolean: {} } },
              { name: 'compass_south_color_conf', selector: { text: {} } },
              { name: 'compass_west_show_conf', selector: { boolean: {} } },
              { name: 'compass_west_color_conf', selector: { text: {} } },
            ],
            type: 'grid',
          },
          { name: 'compass_circle_stroke_conf', selector: { number: { min: 0, mode: 'box' } } },
          {
            name: '',
            schema: [
              { name: 'compass_ticks_radius_conf', selector: { number: { min: 0, mode: 'box' } } },
              { name: 'compass_ticks_step_conf', selector: { number: { max: 180, min: 1, mode: 'box' } } },
            ],
            type: 'grid',
          },
          {
            name: 'compass_circle_background_conf',
            schema: [
              { name: 'compass_circle_background_image_conf', selector: { text: {} } },
              {
                name: '',
                schema: [
                  { name: 'compass_circle_background_offset_conf', selector: { boolean: {} } },
                  { name: 'compass_circle_background_opacity_conf', selector: { number: { max: 1, min: 0, mode: 'box', step: 0.05 } } },
                ],
                type: 'grid',
              },
            ],
            title: localize('editor.compass_circle_background_conf'),
            type: 'expandable',
          },
        ],
        title: localize('editor.compass_conf'),
        type: 'expandable',
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLabel = (schema: any) => {
    return localize(`editor.${schema.name}`) || schema.name;
  };

  private _computeData() {
    return {
      compass_conf: {
        compass_circle_background_conf: {
          compass_circle_background_image_conf: this._config?.compass?.circle?.background_image || '',
          compass_circle_background_offset_conf: this._config?.compass?.circle?.offset_background || false,
          compass_circle_background_opacity_conf: this._config?.compass?.circle?.background_opacity,
        },
        compass_circle_stroke_conf: this._config?.compass?.circle?.stroke_width,
        compass_east_color_conf: this._config?.compass?.east?.color || '',
        compass_east_show_conf: this._config?.compass?.east?.show !== false,
        compass_north_color_conf: this._config?.compass?.north?.color || '',
        compass_north_show_conf: this._config?.compass?.north?.show !== false,
        compass_offset_conf: this._config?.compass?.north?.offset || DEGREES_MIN,
        compass_south_color_conf: this._config?.compass?.south?.color || '',
        compass_south_show_conf: this._config?.compass?.south?.show !== false,
        compass_ticks_radius_conf: this._config?.compass?.ticks?.radius,
        compass_ticks_step_conf: this._config?.compass?.ticks?.step,
        compass_west_color_conf: this._config?.compass?.west?.color || '',
        compass_west_show_conf: this._config?.compass?.west?.show !== false,
      },
      header_conf: {
        header_icon_color_conf: this._config?.header?.icon?.color || '',
        header_icon_conf: this._config?.header?.icon?.value || '',
        header_icon_show_conf: this._config?.header?.icon?.show !== false,
        header_title_color_conf: this._config?.header?.title?.color || '',
        header_title_conf: this._config?.header?.title?.value || '',
        header_title_show_conf: this._config?.header?.title?.show !== false,
      },
    };
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const config = this._config;

    if (!config) return;

    const newConfig = { ...config };

    const headerData = data.header_conf;
    const compassData = data.compass_conf;

    // Update Title
    if (headerData && 'header_title_conf' in headerData) {
      console.log(headerData);
      const newHeader = { ...newConfig.header };
      const newTitle = newHeader.title ? { ...newHeader.title } : {};

      if (headerData.header_title_conf === '' || headerData.header_title_conf === undefined) {
        delete newTitle.value;
      } else {
        newTitle.value = headerData.header_title_conf;
      }

      if (headerData.header_title_show_conf !== undefined) {
        newTitle.show = headerData.header_title_show_conf;
      }

      if (headerData.header_title_color_conf !== undefined) {
        newTitle.color = headerData.header_title_color_conf;
      }

      if (newTitle.color === '') {
        delete newTitle.color;
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
    if (compassData && compassData.compass_offset_conf !== undefined) {
      const north: CCNorthConfig = { ...newConfig.compass?.north, offset: Number(compassData.compass_offset_conf) };
      const compass: CCCompassConfig = { ...newConfig.compass, north };
      newConfig.compass = compass;

      if (Number(compassData.compass_offset_conf) === DEGREES_MIN) {
        delete newConfig.compass?.north?.offset;
        // Cleanup if empty
        if (newConfig.compass?.north && Object.keys(newConfig.compass.north).length === NO_ELEMENTS) {
          delete newConfig.compass.north;
        }
      }
    }

    // Update Header Icon
    if (headerData && 'header_icon_conf' in headerData) {
      const newHeader = { ...newConfig.header };
      const newIcon = newHeader.icon ? { ...newHeader.icon } : {};

      if (headerData.header_icon_conf === '' || headerData.header_icon_conf === undefined) {
        delete newIcon.value;
      } else {
        newIcon.value = headerData.header_icon_conf;
      }

      if (headerData.header_icon_show_conf !== undefined) {
        newIcon.show = headerData.header_icon_show_conf;
      }

      if (headerData.header_icon_color_conf !== undefined) {
        newIcon.color = headerData.header_icon_color_conf;
      }

      if (newIcon.color === '') {
        delete newIcon.color;
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
    if (compassData) {
      const compass: CCCompassConfig = { ...newConfig.compass };

      // North
      if (compassData.compass_north_show_conf !== undefined) {
        compass.north = { ...compass.north, show: compassData.compass_north_show_conf };
      }
      if (compassData.compass_north_color_conf !== undefined) {
        compass.north = { ...compass.north, color: compassData.compass_north_color_conf };
      }
      if (compass.north?.color === '') delete compass.north.color;

      // East
      if (compassData.compass_east_show_conf !== undefined) {
        compass.east = { ...compass.east, show: compassData.compass_east_show_conf };
      }
      if (compassData.compass_east_color_conf !== undefined) {
        compass.east = { ...compass.east, color: compassData.compass_east_color_conf };
      }
      if (compass.east?.color === '') delete compass.east.color;

      // South
      if (compassData.compass_south_show_conf !== undefined) {
        compass.south = { ...compass.south, show: compassData.compass_south_show_conf };
      }
      if (compassData.compass_south_color_conf !== undefined) {
        compass.south = { ...compass.south, color: compassData.compass_south_color_conf };
      }
      if (compass.south?.color === '') delete compass.south.color;

      // West
      if (compassData.compass_west_show_conf !== undefined) {
        compass.west = { ...compass.west, show: compassData.compass_west_show_conf };
      }
      if (compassData.compass_west_color_conf !== undefined) {
        compass.west = { ...compass.west, color: compassData.compass_west_color_conf };
      }
      if (compass.west?.color === '') delete compass.west.color;

      // Circle
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circle: any = { ...compass.circle };
      const backgroundData = compassData.compass_circle_background_conf || {};

      if (backgroundData.compass_circle_background_image_conf !== undefined) circle.background_image = backgroundData.compass_circle_background_image_conf;
      if (backgroundData.compass_circle_background_opacity_conf !== undefined) circle.background_opacity = backgroundData.compass_circle_background_opacity_conf;
      if (backgroundData.compass_circle_background_offset_conf !== undefined) circle.offset_background = backgroundData.compass_circle_background_offset_conf;
      if (compassData.compass_circle_stroke_conf !== undefined) circle.stroke_width = compassData.compass_circle_stroke_conf;
      compass.circle = circle;

      // Ticks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ticks: any = { ...compass.ticks };
      if (compassData.compass_ticks_radius_conf !== undefined) ticks.radius = compassData.compass_ticks_radius_conf;
      if (compassData.compass_ticks_step_conf !== undefined) ticks.step = compassData.compass_ticks_step_conf;
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
      ha-expansion-panel {
        margin-top: 24px;
      }
    `;
  }
}
