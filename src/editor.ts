/* eslint-disable sort-keys */
import { CCHeaderConfig, CCHeaderItemConfig, CCValueSensorConfig, CompassCardConfig } from './editorTypes';
import { COMPASS_LANGUAGES, localize } from './localize/localize.js';
import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEGREES_MAX, DEGREES_MIN, ICON_VALUES, ICONS } from './const';
import { fireEvent, HomeAssistant, LovelaceCardEditor } from './utils/ha-helpers';



interface CardHelpers {
  // eslint-disable-next-line no-unused-vars
  importMoreInfoControl(type: string): void;
}

@customElement('compass-card-editor')
export class CompassCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _helpers?: CardHelpers;
  @state() private _config?: CompassCardConfig;
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

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private _computeSchema() {
    const entityDomains = ['sensor', 'sun', 'input_number', 'input_text'];
    return [
      {
        name: 'header',
        type: 'expandable',
        schema: [
          {
            type: 'expandable',
            title: localize('editor.title'),
            schema: [
              { name: 'header_title_value', selector: { text: {} } },
              { name: 'header_title_show', selector: { boolean: {} } },
              { name: 'header_title_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.icon'),
            schema: [
              { name: 'header_icon_value', selector: { icon: {} } },
              { name: 'header_icon_show', selector: { boolean: {} } },
              { name: 'header_icon_color', selector: { text: {} } },
            ]
          }
        ]
      },
      {
        type: 'expandable',
        title: localize('editor.compass'),
        schema: [
          {
            type: 'expandable',
            title: localize('directions.north'),
            schema: [
              { name: 'north', selector: { boolean: {} } },
              { name: 'offset', selector: { number: { max: DEGREES_MAX, min: DEGREES_MIN, mode: 'box' } } },
              { name: 'compass_north_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('directions.east'),
            schema: [
              { name: 'compass_east_show', selector: { boolean: {} } },
              { name: 'compass_east_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('directions.south'),
            schema: [
              { name: 'compass_south_show', selector: { boolean: {} } },
              { name: 'compass_south_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('directions.west'),
            schema: [
              { name: 'compass_west_show', selector: { boolean: {} } },
              { name: 'compass_west_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.circle'),
            schema: [
              { name: 'compass_circle_show', selector: { boolean: {} } },
              { name: 'compass_circle_color', selector: { text: {} } },
              { name: 'compass_circle_stroke_width', selector: { number: { mode: 'box' } } },
              {
                type: 'expandable',
                title: localize('editor.background_image'),
                schema: [
                  { name: 'compass_circle_background_image', selector: { text: {} } },
                  { name: 'compass_circle_background_opacity', selector: { number: { min: 0, max: 1, step: 0.1, mode: 'slider' } } },
                  { name: 'compass_circle_offset_background', selector: { boolean: {} } },
                ]
              },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.ticks'),
            schema: [
              { name: 'compass_ticks_show', selector: { boolean: {} } },
              { name: 'compass_ticks_color', selector: { text: {} } },
              { name: 'compass_ticks_radius', selector: { number: { mode: 'box' } } },
              { name: 'compass_ticks_step', selector: { number: { min: 1, max: 180, mode: 'box' } } },
            ]
          },
        ]
      },
      {
        type: 'expandable',
        title: localize('editor.indicator_settings'),
        schema: [
          { name: 'language', selector: { select: { mode: 'dropdown', options: COMPASS_LANGUAGES } } },
          { name: 'primary_entity', required: true, selector: { entity: { domain: entityDomains } } },
          { name: 'primary_attribute', selector: { attribute: { entity_id: this._config?.indicator_sensors?.[0]?.sensor } } },
          { name: 'primary_decimals', selector: { number: { mode: 'box' } } },
          { name: 'primary_units', selector: { text: {} } },
          {
            type: 'expandable',
            title: localize('editor.indicator'),
            schema: [
              {
                name: 'primary_indicator_icon_type',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: [
                      { value: 'standard', label: localize('editor.type_standard') },
                      { value: 'icon', label: localize('editor.type_mdi') },
                      { value: 'string', label: localize('editor.type_string') }
                    ]
                  }
                }
              },
              ...(this._getIconType() === 'standard' ? [{ name: 'primary_indicator_image', selector: { select: { mode: 'dropdown', options: [...ICON_VALUES] } } }] : []),
              ...(this._getIconType() === 'icon' ? [{ name: 'primary_indicator_custom_icon', selector: { icon: {} } }] : []),
              ...(this._getIconType() === 'string' ? [{ name: 'primary_indicator_custom_string', selector: { text: {} } }] : []),
              { name: 'primary_indicator_show', selector: { boolean: {} } },
              { name: 'primary_indicator_color', selector: { text: {} } },
              { name: 'primary_indicator_opacity', selector: { number: { min: 0, max: 1, step: 0.1, mode: 'slider' } } },
              { name: 'primary_indicator_radius', selector: { number: { mode: 'box' } } },
              { name: 'primary_indicator_size', selector: { number: { mode: 'box' } } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.state_abbreviation'),
            schema: [
              { name: 'primary_show_abbreviation', selector: { boolean: {} } },
              { name: 'primary_abbreviation_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.state_value'),
            schema: [
              { name: 'primary_show_value', selector: { boolean: {} } },
              { name: 'primary_value_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.state_units'),
            schema: [
              { name: 'primary_show_units', selector: { boolean: {} } },
              { name: 'primary_units_color', selector: { text: {} } },
            ]
          },
        ]
      },
      {
        type: 'expandable',
        title: localize('editor.value_sensors'),
        schema: [
          { name: 'secondary_entity', selector: { entity: { domain: entityDomains } } },
          { name: 'secondary_attribute', selector: { attribute: { entity_id: this._config?.value_sensors?.[0]?.sensor } } },
          { name: 'secondary_decimals', selector: { number: { mode: 'box' } } },
          { name: 'secondary_units', selector: { text: {} } },
          {
            type: 'expandable',
            title: localize('editor.state_value'),
            schema: [
              { name: 'secondary_show_value', selector: { boolean: {} } },
              { name: 'secondary_value_color', selector: { text: {} } },
            ]
          },
          {
            type: 'expandable',
            title: localize('editor.state_units'),
            schema: [
              { name: 'secondary_show_units', selector: { boolean: {} } },
              { name: 'secondary_units_color', selector: { text: {} } },
            ]
          },
        ]
      },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
  private _computeLabel = (schema: any) => {
    // Map flattened keys to localized labels
    const labelMap: Record<string, string> = {
      header: localize('editor.header'),
      title_settings: localize('editor.title'),
      icon_settings: localize('editor.icon'),
      header_title_value: localize('editor.title'),
      header_title_show: localize('editor.show'),
      header_title_color: localize('editor.color'),
      header_icon_value: localize('editor.icon'),
      header_icon_show: localize('editor.show'),
      header_icon_color: localize('editor.color'),

      indicator_settings: localize('editor.indicator_settings'),
      primary_entity: localize('editor.primary entity description'),
      primary_attribute: localize('editor.attribute'),
      primary_decimals: localize('editor.decimals'),
      primary_units: localize('editor.units'),
      primary_indicator_icon_type: localize('editor.icon_type'),
      primary_indicator_image: localize('editor.indicator'),
      primary_indicator_custom_icon: localize('editor.icon'),
      primary_indicator_custom_string: localize('editor.type_string'),
      primary_indicator_show: localize('editor.show'),
      primary_indicator_color: localize('editor.color'),
      primary_indicator_opacity: localize('editor.opacity'),
      primary_indicator_radius: localize('editor.radius'),
      primary_indicator_size: localize('editor.size'),
      primary_show_abbreviation: localize('editor.abbreviations'),
      primary_abbreviation_color: localize('editor.color'),
      primary_show_value: localize('editor.state_value'),
      primary_value_color: localize('editor.color'),
      primary_show_units: localize('editor.state_units'),
      primary_units_color: localize('editor.color'),

      value_sensors: localize('editor.sensors'),
      secondary_entity: localize('editor.secondary entity description'),
      secondary_attribute: localize('editor.attribute'),
      secondary_decimals: localize('editor.decimals'),
      secondary_units: localize('editor.units'),
      secondary_show_value: localize('editor.state_value'),
      secondary_value_color: localize('editor.color'),
      secondary_show_units: localize('editor.state_units'),
      secondary_units_color: localize('editor.color'),

      compass: localize('editor.compass'),
      north: localize('directions.north'),
      offset: localize('editor.offset description'),
      compass_north_color: localize('editor.color'),
      compass_east_show: localize('directions.east'),
      compass_east_color: localize('editor.color'),
      compass_south_show: localize('directions.south'),
      compass_south_color: localize('editor.color'),
      compass_west_show: localize('directions.west'),
      compass_west_color: localize('editor.color'),
      compass_circle_show: localize('editor.circle'),
      compass_circle_color: localize('editor.color'),
      compass_circle_stroke_width: localize('editor.stroke_width'),
      compass_circle_background_image: localize('editor.background_image'),
      compass_circle_background_opacity: localize('editor.opacity'),
      compass_circle_offset_background: localize('editor.offset'),
      compass_ticks_show: localize('editor.ticks'),
      compass_ticks_color: localize('editor.color'),
      compass_ticks_radius: localize('editor.radius'),
      compass_ticks_step: localize('editor.step'),

      language: localize('editor.language description')
    };
    return labelMap[schema.name] || schema.name;
  };

  private _getIconType(): 'standard' | 'icon' | 'string' {
    const val = this._config?.indicator_sensors?.[0]?.indicator?.image;
    if (val === undefined) return 'standard';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (ICON_VALUES.includes(val as any)) return 'standard';
    if (val.startsWith('mdi:')) return 'icon';
    return 'string';
  }

  private _computeData() {
    const iconType = this._getIconType();
    const imageVal = this._config?.indicator_sensors?.[0]?.indicator?.image;
    const defaultImage = DEFAULT_ICON_VALUE;

    return {
      language: this._config?.language || '',

      header_title_value: this._config?.header?.title?.value || '',
      header_title_show: this._config?.header?.title?.show !== false,
      header_title_color: this._config?.header?.title?.color || '',
      header_icon_value: this._config?.header?.icon?.value || '',
      header_icon_show: this._config?.header?.icon?.show !== false,
      header_icon_color: this._config?.header?.icon?.color || '',

      primary_entity: this._config?.indicator_sensors?.[0]?.sensor || '',
      primary_attribute: this._config?.indicator_sensors?.[0]?.attribute || '',
      primary_decimals: this._config?.indicator_sensors?.[0]?.decimals || 0,
      primary_units: this._config?.indicator_sensors?.[0]?.units || '',

      primary_indicator_icon_type: iconType,
      primary_indicator_image: iconType === 'standard' ? (imageVal || defaultImage) : defaultImage,
      primary_indicator_custom_icon: iconType === 'icon' ? (imageVal || ICONS.sun) : ICONS.sun,
      primary_indicator_custom_string: iconType === 'string' ? (imageVal || '') : '',

      primary_indicator_show: this._config?.indicator_sensors?.[0]?.indicator?.show !== false,
      primary_indicator_color: this._config?.indicator_sensors?.[0]?.indicator?.color || '',
      primary_indicator_opacity: this._config?.indicator_sensors?.[0]?.indicator?.opacity !== undefined ? this._config.indicator_sensors[0].indicator.opacity : 1,
      primary_indicator_radius: this._config?.indicator_sensors?.[0]?.indicator?.radius || 0,
      primary_indicator_size: this._config?.indicator_sensors?.[0]?.indicator?.size || 0,
      primary_show_abbreviation: this._config?.indicator_sensors?.[0]?.state_abbreviation?.show !== false,
      primary_abbreviation_color: this._config?.indicator_sensors?.[0]?.state_abbreviation?.color || '',
      primary_show_value: this._config?.indicator_sensors?.[0]?.state_value?.show !== false,
      primary_value_color: this._config?.indicator_sensors?.[0]?.state_value?.color || '',
      primary_show_units: this._config?.indicator_sensors?.[0]?.state_units?.show !== false,
      primary_units_color: this._config?.indicator_sensors?.[0]?.state_units?.color || '',

      secondary_entity: this._config?.value_sensors?.[0]?.sensor || '',
      secondary_attribute: this._config?.value_sensors?.[0]?.attribute || '',
      secondary_decimals: this._config?.value_sensors?.[0]?.decimals || 0,
      secondary_units: this._config?.value_sensors?.[0]?.units || '',
      secondary_show_value: this._config?.value_sensors?.[0]?.state_value?.show !== false,
      secondary_value_color: this._config?.value_sensors?.[0]?.state_value?.color || '',
      secondary_show_units: this._config?.value_sensors?.[0]?.state_units?.show !== false,
      secondary_units_color: this._config?.value_sensors?.[0]?.state_units?.color || '',

      north: this._config?.compass?.north?.show !== false,
      offset: this._config?.compass?.north?.offset || DEGREES_MIN,
      compass_north_color: this._config?.compass?.north?.color || '',
      compass_east_show: this._config?.compass?.east?.show !== false,
      compass_east_color: this._config?.compass?.east?.color || '',
      compass_south_show: this._config?.compass?.south?.show !== false,
      compass_south_color: this._config?.compass?.south?.color || '',
      compass_west_show: this._config?.compass?.west?.show !== false,
      compass_west_color: this._config?.compass?.west?.color || '',
      compass_circle_show: this._config?.compass?.circle?.show !== false,
      compass_circle_color: this._config?.compass?.circle?.color || '',
      compass_circle_stroke_width: this._config?.compass?.circle?.stroke_width || 0,
      compass_circle_background_image: this._config?.compass?.circle?.background_image || '',
      compass_circle_background_opacity: this._config?.compass?.circle?.background_opacity !== undefined ? this._config.compass.circle.background_opacity : 1,
      compass_circle_offset_background: this._config?.compass?.circle?.offset_background !== false,
      compass_ticks_show: this._config?.compass?.ticks?.show !== false,
      compass_ticks_color: this._config?.compass?.ticks?.color || '',
      compass_ticks_radius: this._config?.compass?.ticks?.radius || 0,
      compass_ticks_step: this._config?.compass?.ticks?.step || 0,
    };
  }


  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const config = this._config;

    if (!config) return;

    const newConfig = { ...config };

    // --- Language ---
    if (data.language !== undefined) {
      newConfig.language = data.language;
      if (!newConfig.language) delete newConfig.language;
    }

    // --- Header ---
    if (data.header) {
      const header: CCHeaderConfig = { ...newConfig.header };

      // Title
      const headerTitle = { ...header.title };
      if ('header_title_value' in data.header) {
        const val = data.header.header_title_value;
        if (!val || val === '') delete headerTitle.value;
        else headerTitle.value = val;
      }
      if ('header_title_show' in data.header) headerTitle.show = data.header.header_title_show;
      if ('header_title_color' in data.header) {
        const val = data.header.header_title_color;
        if (!val || val === '') delete headerTitle.color;
        else headerTitle.color = val;
      }

      // Clean up title object if totally empty (optional, but good for cleanliness)
      if (Object.keys(headerTitle).length === 0) delete header.title;
      else header.title = headerTitle;

      // Icon
      const headerIcon: CCHeaderItemConfig = { ...header.icon };
      if ('header_icon_value' in data.header) {
        const val = data.header.header_icon_value;
        if (!val || val === '') delete headerIcon.value;
        else headerIcon.value = val;
      }
      if ('header_icon_show' in data.header) headerIcon.show = data.header.header_icon_show;
      if ('header_icon_color' in data.header) {
        const val = data.header.header_icon_color;
        if (!val || val === '') delete headerIcon.color;
        else headerIcon.color = val;
      }

      if (Object.keys(headerIcon).length === 0) delete header.icon;
      else header.icon = headerIcon;

      if (Object.keys(header).length === 0) delete newConfig.header;
      else newConfig.header = header;
    }

    // --- Indicator Sensor (Primary) ---
    // Flattened: access fields directly from data
    const indicatorSensors = [...(newConfig.indicator_sensors || [])];
    if (indicatorSensors.length === 0) indicatorSensors.push({ sensor: '', indicator: {} });
    const primaryInfo = { ...indicatorSensors[0] };
    const primaryIndicator = { ...primaryInfo.indicator };
    const primaryAbbr = { ...primaryInfo.state_abbreviation };
    const primaryValue = { ...primaryInfo.state_value };
    const primaryUnits = { ...primaryInfo.state_units };

    if ('primary_entity' in data) primaryInfo.sensor = data.primary_entity;
    if ('primary_attribute' in data) {
      const val = data.primary_attribute;
      if (!val || val === '') delete primaryInfo.attribute;
      else primaryInfo.attribute = val;
    }
    if ('primary_decimals' in data) primaryInfo.decimals = Number(data.primary_decimals);
    if ('primary_units' in data) {
      const val = data.primary_units;
      if (!val || val === '') delete primaryInfo.units;
      else primaryInfo.units = val;
    }

    // Icon Type Logic
    const oldType = this._getIconType();
    const newType = data.primary_indicator_icon_type;

    if (newType !== undefined && newType !== oldType) {
      // Mode switched: Set default for new mode
      if (newType === 'standard') primaryIndicator.image = DEFAULT_ICON_VALUE;
      else if (newType === 'icon') primaryIndicator.image = 'mdi:compass';
      else if (newType === 'string') primaryIndicator.image = '';
    } else {
      // No mode switch: Update value from active field
      const activeType = newType || oldType;
      if (activeType === 'standard' && 'primary_indicator_image' in data) {
        primaryIndicator.image = data.primary_indicator_image;
      } else if (activeType === 'icon' && 'primary_indicator_custom_icon' in data) {
        primaryIndicator.image = data.primary_indicator_custom_icon;
      } else if (activeType === 'string' && 'primary_indicator_custom_string' in data) {
        primaryIndicator.image = data.primary_indicator_custom_string;
      }
    }

    if ('primary_indicator_show' in data) primaryIndicator.show = data.primary_indicator_show;
    if ('primary_indicator_color' in data) {
      const val = data.primary_indicator_color;
      if (!val || val === '') delete primaryIndicator.color;
      else primaryIndicator.color = val;
    }
    if ('primary_indicator_opacity' in data) primaryIndicator.opacity = Number(data.primary_indicator_opacity);
    if ('primary_indicator_radius' in data) primaryIndicator.radius = Number(data.primary_indicator_radius);
    if ('primary_indicator_size' in data) primaryIndicator.size = Number(data.primary_indicator_size);

    if ('primary_show_abbreviation' in data) primaryAbbr.show = data.primary_show_abbreviation;
    if ('primary_abbreviation_color' in data) {
      const val = data.primary_abbreviation_color;
      if (!val || val === '') delete primaryAbbr.color;
      else primaryAbbr.color = val;
    }

    if ('primary_show_value' in data) primaryValue.show = data.primary_show_value;
    if ('primary_value_color' in data) {
      const val = data.primary_value_color;
      if (!val || val === '') delete primaryValue.color;
      else primaryValue.color = val;
    }

    if ('primary_show_units' in data) primaryUnits.show = data.primary_show_units;
    if ('primary_units_color' in data) {
      const val = data.primary_units_color;
      if (!val || val === '') delete primaryUnits.color;
      else primaryUnits.color = val;
    }

    primaryInfo.indicator = primaryIndicator;
    primaryInfo.state_abbreviation = primaryAbbr;
    primaryInfo.state_value = primaryValue;
    primaryInfo.state_units = primaryUnits;
    if (!primaryInfo.attribute) delete primaryInfo.attribute;
    indicatorSensors[0] = primaryInfo;
    newConfig.indicator_sensors = indicatorSensors;

    // --- Value Sensor (Secondary) ---
    // Flattened: access fields directly from data
    const valueSensors = [...(newConfig.value_sensors || [])];
    if ('secondary_entity' in data) {
      if (data.secondary_entity) {
        if (valueSensors.length === 0) valueSensors.push({ sensor: '' });
        const secondaryInfo: CCValueSensorConfig = { ...valueSensors[0] };
        const secondaryValue = { ...secondaryInfo.state_value };
        const secondaryUnits = { ...secondaryInfo.state_units };

        secondaryInfo.sensor = data.secondary_entity;
        if ('secondary_attribute' in data) {
          const val = data.secondary_attribute;
          if (!val || val === '') delete secondaryInfo.attribute;
          else secondaryInfo.attribute = val;
        }
        if ('secondary_decimals' in data) secondaryInfo.decimals = Number(data.secondary_decimals);
        if ('secondary_units' in data) {
          const val = data.secondary_units;
          if (!val || val === '') delete secondaryInfo.units;
          else secondaryInfo.units = val;
        }
        if ('secondary_show_value' in data) secondaryValue.show = data.secondary_show_value;
        if ('secondary_value_color' in data) {
          const val = data.secondary_value_color;
          if (!val || val === '') delete secondaryValue.color;
          else secondaryValue.color = val;
        }
        if ('secondary_show_units' in data) secondaryUnits.show = data.secondary_show_units;
        if ('secondary_units_color' in data) {
          const val = data.secondary_units_color;
          if (!val || val === '') delete secondaryUnits.color;
          else secondaryUnits.color = val;
        }

        secondaryInfo.state_value = secondaryValue;
        secondaryInfo.state_units = secondaryUnits;
        if (!secondaryInfo.attribute) delete secondaryInfo.attribute;
        valueSensors[0] = secondaryInfo;
        newConfig.value_sensors = valueSensors;
      } else if (valueSensors.length > 0) {
        // If entity is cleared, clear the sensors array
        newConfig.value_sensors = [];
      }
    }

    // --- Compass ---
    // Flattened: access fields directly from data
    const compass = { ...newConfig.compass };
    const north = { ...compass.north };
    const east = { ...compass.east };
    const south = { ...compass.south };
    const west = { ...compass.west };
    const circle = { ...compass.circle };
    const ticks = { ...compass.ticks };

    if ('north' in data) north.show = data.north;
    if ('offset' in data) north.offset = Number(data.offset);
    if ('compass_north_color' in data) {
      const val = data.compass_north_color;
      if (!val || val === '') delete north.color;
      else north.color = val;
    }

    if ('compass_east_show' in data) east.show = data.compass_east_show;
    if ('compass_east_color' in data) {
      const val = data.compass_east_color;
      if (!val || val === '') delete east.color;
      else east.color = val;
    }

    if ('compass_south_show' in data) south.show = data.compass_south_show;
    if ('compass_south_color' in data) {
      const val = data.compass_south_color;
      if (!val || val === '') delete south.color;
      else south.color = val;
    }

    if ('compass_west_show' in data) west.show = data.compass_west_show;
    if ('compass_west_color' in data) {
      const val = data.compass_west_color;
      if (!val || val === '') delete west.color;
      else west.color = val;
    }

    if ('compass_circle_show' in data) circle.show = data.compass_circle_show;
    if ('compass_circle_color' in data) {
      const val = data.compass_circle_color;
      if (!val || val === '') delete circle.color;
      else circle.color = val;
    }
    if ('compass_circle_stroke_width' in data) circle.stroke_width = Number(data.compass_circle_stroke_width);
    if ('compass_circle_background_image' in data) {
      const val = data.compass_circle_background_image;
      if (!val || val === '') delete circle.background_image;
      else circle.background_image = val;
    }
    if ('compass_circle_background_opacity' in data) circle.background_opacity = Number(data.compass_circle_background_opacity);
    if ('compass_circle_offset_background' in data) circle.offset_background = data.compass_circle_offset_background;

    if ('compass_ticks_show' in data) ticks.show = data.compass_ticks_show;
    if ('compass_ticks_color' in data) {
      const val = data.compass_ticks_color;
      if (!val || val === '') delete ticks.color;
      else ticks.color = val;
    }
    if ('compass_ticks_radius' in data) ticks.radius = Number(data.compass_ticks_radius);
    if ('compass_ticks_step' in data) ticks.step = Number(data.compass_ticks_step);

    compass.north = north;
    compass.east = east;
    compass.south = south;
    compass.west = west;
    compass.circle = circle;
    compass.ticks = ticks;
    newConfig.compass = compass;

    // cleanup
    if (newConfig.header?.title && !newConfig.header.title.value && !newConfig.header.title.color && newConfig.header.title.show === true) delete newConfig.header.title;

    if (newConfig.header?.icon && !newConfig.header.icon.value && !newConfig.header.icon.color && newConfig.header.icon.show === true) delete newConfig.header.icon;

    if (newConfig.header && !newConfig.header.title && !newConfig.header.icon) delete newConfig.header;

    this._config = newConfig;
    fireEvent(this, 'config-changed', { config: this._config });
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
