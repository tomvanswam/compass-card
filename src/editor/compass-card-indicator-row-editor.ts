import { COMPASS_LANGUAGES, localize } from '../localize/localize';
import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DEFAULT_ICON_VALUE, DEFAULT_UNKNOWN_DIRECTION, INDEX_ELEMENT_0, INDEX_ELEMENT_1, UNKNOWN_DIRECTION_VALUES } from '../const';
import { fireEvent, HomeAssistant } from '../utils/ha-helpers';
import { mdiClose, mdiDragHorizontalVariant, mdiPencil } from '@mdi/js';
import { CCIndicatorSensorConfig } from './editorTypes';
import { repeat } from 'lit/directives/repeat.js';


declare global {
  interface HTMLElementTagNameMap {
    'compass-card-indicator-row-editor': CompassCardIndicatorRowEditor;
  }
}

@customElement('compass-card-indicator-row-editor')
export class CompassCardIndicatorRowEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entities?: CCIndicatorSensorConfig[];
  @property() public label?: string;
  @property() public language?: string;
  @property({ attribute: false }) public unknownDirection?: string;

  private _entityKeys = new WeakMap<CCIndicatorSensorConfig, string>();

  private _getKey(entity: CCIndicatorSensorConfig) {
    if (!this._entityKeys.has(entity)) {
      this._entityKeys.set(entity, Math.random().toString());
    }
    return this._entityKeys.get(entity)!;
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html``;
    }
    const entities = this.entities || [];

    return html`
      <ha-expansion-panel outlined .header=${this.label}>
        <ha-form
          .hass=${this.hass}
          .data=${{
        language: this.language,
        unknown_direction: this.unknownDirection || DEFAULT_UNKNOWN_DIRECTION,
      }}
          .schema=${[
        {
          name: 'language',
          selector: {
            select: {
              mode: 'dropdown',
              options: COMPASS_LANGUAGES.filter((lang) => lang !== '').map((lang) => ({ label: lang, value: lang })),
            },
          },
        },
        {
          name: 'unknown_direction',
          selector: {
            select: {
              mode: 'dropdown',
              options: UNKNOWN_DIRECTION_VALUES.map((value) => ({ label: localize(`editor.sensor_config.unknown_direction_types.${value}`), value })),
            },
          },
        },
      ]}
          .computeLabel=${CompassCardIndicatorRowEditor._computeLanguageLabel}
          @value-changed=${this._languageChanged}
        ></ha-form>
        <ha-sortable handle-selector=".handle" @item-moved=${this._rowMoved}>
          <div class="entities">
            ${repeat(
        entities,
        (entityConf) => this._getKey(entityConf),
        (entityConf, index) => html`
                <div class="entity">
                  <div class="handle">
                    <ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon>
                  </div>
                  <div class="entity-content">
                    <ha-entity-picker
                      allow-custom-entity
                      hide-clear-icon
                      .hass=${this.hass}
                      .value=${entityConf.sensor}
                      .index=${index}
                      @value-changed=${this._valueChanged}
                    ></ha-entity-picker>
                  </div>
                  <ha-icon-button
                    .label=${this.hass!.localize('ui.components.entity.entity-picker.edit')}
                    .path=${mdiPencil}
                    class="edit-icon"
                    .index=${index}
                    @click=${() => this._editRow(index)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .label=${this.hass!.localize('ui.components.entity.entity-picker.clear')}
                    .path=${mdiClose}
                    class="remove-icon"
                    .index=${index}
                    @click=${() => this._removeRow(index)}
                    .disabled=${index === INDEX_ELEMENT_0}
                  ></ha-icon-button>
                </div>
              `
      )}
          </div>
        </ha-sortable>
        <ha-entity-picker
          class="add-entity"
          .hass=${this.hass}
          @value-changed=${this._addEntity}
          add-button
        ></ha-entity-picker>
      </ha-expansion-panel>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const { value } = ev.detail;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { index } = (ev.target as any);
    const newConfigEntities = [...(this.entities || [])];

    if (value === '' || value === undefined) {
      // Don't delete on empty, just update. User can delete with X button.
      newConfigEntities[index] = { ...newConfigEntities[index], sensor: '' };
    } else {
      newConfigEntities[index] = {
        ...newConfigEntities[index],
        sensor: value!,
      };
    }

    fireEvent(this, 'entities-changed', { entities: newConfigEntities });
  }

  private _languageChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    const { language, unknown_direction: unknownDirection } = ev.detail.value;
    if (language !== this.language) {
      fireEvent(this, 'language-changed', { language });
    }
    if (unknownDirection !== (this.unknownDirection || DEFAULT_UNKNOWN_DIRECTION)) {
      fireEvent(this, 'unknown-direction-changed', { unknownDirection });
    }
  }

  private _addEntity(ev: CustomEvent): void {
    const { value } = ev.detail;
    if (value === '') {
      return;
    }
    const newConfigEntities = this.entities!.concat({
      indicator: { image: DEFAULT_ICON_VALUE },
      sensor: value as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ev.target as any).value = '';
    fireEvent(this, 'entities-changed', { entities: newConfigEntities });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static _computeLanguageLabel(schema: any): string {
    return localize(`editor.sensor_config.${schema.name}`);
  }

  private _rowMoved(ev: CustomEvent): void {
    ev.stopPropagation();
    const { oldIndex, newIndex } = ev.detail;
    const newEntities = this.entities!.concat();
    newEntities.splice(newIndex, INDEX_ELEMENT_0, newEntities.splice(oldIndex, INDEX_ELEMENT_1)[0]);
    fireEvent(this, 'entities-changed', { entities: newEntities });
  }

  private _removeRow(index: number): void {
    if (index === INDEX_ELEMENT_0) {
      return;
    }
    const newConfigEntities = this.entities!.concat();
    newConfigEntities.splice(index, INDEX_ELEMENT_1);
    fireEvent(this, 'entities-changed', { entities: newConfigEntities });
  }

  private _editRow(index: number): void {
    fireEvent(this, 'edit-detail-element', {
      subElementConfig: {
        elementConfig: this.entities![index],
        index,
        type: 'indicator',
      },
    });
  }

  static styles = css`
    ha-entity-picker {
      margin-top: 8px;
    }
    .entity-content ha-entity-picker {
      display: block;
      width: 100%;
    }
    .add-entity {
      display: block;
      margin-left: 31px;
      margin-right: 71px;
      margin-inline-start: 31px;
      margin-inline-end: 71px;
      direction: var(--direction);
    }
    .entity {
      display: flex;
      align-items: center;
      padding: 8px 0;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
    }
    .entity:last-child {
      border-bottom: none;
    }
    .entity .handle {
      padding-right: 8px;
      cursor: move;
      cursor: grab;
      padding-inline-end: 8px;
      padding-inline-start: initial;
      direction: var(--direction);
    }
    .entity .handle > * {
      pointer-events: none;
    }
    .entity-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    .entity-content ha-entity-picker {
      margin-top: 0;
    }
    .secondary {
      font-size: var(--ha-font-size-s);
      color: var(--secondary-text-color);
    }
    .remove-icon,
    .edit-icon {
      --mdc-icon-button-size: 36px;
      color: var(--secondary-text-color);
    }
  `;
}
