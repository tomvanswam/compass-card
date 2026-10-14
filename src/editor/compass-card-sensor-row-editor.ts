import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent, SensorRow, SubElementConfig } from '../utils/events';
import { INDEX_ELEMENT_0, INDEX_ELEMENT_1, NO_ELEMENTS } from '../const';
import { mdiClose, mdiDragHorizontalVariant, mdiPencil } from '@mdi/js';
import { HomeAssistant } from '../utils/ha-helpers';
import { repeat } from 'lit/directives/repeat.js';

declare global {
  interface HTMLElementTagNameMap {
    'compass-card-sensor-row-editor': CompassCardSensorRowEditor;
  }
}

/**
 * Sortable list of indicator or value sensors: pick the entity per row, edit a row in its detail editor
 * (fires 'edit-detail-element' with the given type), remove rows and add new ones.
 * Content placed inside the element is shown above the list. Fires 'entities-changed' with the new list.
 */
@customElement('compass-card-sensor-row-editor')
export class CompassCardSensorRowEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entities?: SensorRow[];
  @property() public label?: string;
  // Detail editor type passed with 'edit-detail-element'
  @property() public type: SubElementConfig['type'] = 'indicator';
  // The first rows that cannot be removed
  @property({ attribute: false }) public fixedRows = NO_ELEMENTS;
  // Maximum number of rows; the add picker is replaced by limitMessage when reached
  @property({ attribute: false }) public maxRows = Infinity;
  @property() public limitMessage = '';
  // Configuration for a newly added entity; without it only the sensor is set
  // eslint-disable-next-line no-unused-vars
  @property({ attribute: false }) public newRow?: (sensor: string) => SensorRow;

  private _entityKeys = new WeakMap<SensorRow, string>();

  private _getKey(entity: SensorRow) {
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
        <slot></slot>
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
                    .disabled=${index < this.fixedRows}
                  ></ha-icon-button>
                </div>
              `,
            )}
          </div>
        </ha-sortable>
        ${entities.length < this.maxRows
          ? html`<ha-entity-picker class="add-entity" .hass=${this.hass} @value-changed=${this._addEntity} add-button></ha-entity-picker>`
          : html`<div class="secondary">${this.limitMessage}</div>`}
      </ha-expansion-panel>
    `;
  }

  private _valueChanged(ev: CustomEvent<{ value?: string }>): void {
    const { value } = ev.detail;
    const { index } = ev.target as HTMLElement & { index: number };
    const newConfigEntities = [...(this.entities || [])];
    // Don't delete on empty, just update. User can delete with X button.
    newConfigEntities[index] = { ...newConfigEntities[index], sensor: value || '' };
    fireEvent(this, 'entities-changed', { entities: newConfigEntities });
  }

  private _addEntity(ev: CustomEvent<{ value?: string }>): void {
    const { value } = ev.detail;
    const entities = this.entities || [];
    if (value === '' || entities.length >= this.maxRows) {
      return;
    }
    (ev.target as HTMLElement & { value: string }).value = '';
    fireEvent(this, 'entities-changed', { entities: entities.concat(this.newRow ? this.newRow(value as string) : { sensor: value as string }) });
  }

  private _rowMoved(ev: CustomEvent<{ newIndex: number; oldIndex: number }>): void {
    ev.stopPropagation();
    const { oldIndex, newIndex } = ev.detail;
    const newEntities = (this.entities || []).concat();
    newEntities.splice(newIndex, INDEX_ELEMENT_0, newEntities.splice(oldIndex, INDEX_ELEMENT_1)[0]);
    fireEvent(this, 'entities-changed', { entities: newEntities });
  }

  private _removeRow(index: number): void {
    if (index < this.fixedRows) {
      return;
    }
    const newConfigEntities = (this.entities || []).concat();
    newConfigEntities.splice(index, INDEX_ELEMENT_1);
    fireEvent(this, 'entities-changed', { entities: newConfigEntities });
  }

  private _editRow(index: number): void {
    fireEvent(this, 'edit-detail-element', {
      subElementConfig: {
        elementConfig: this.entities![index],
        index,
        type: this.type,
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
