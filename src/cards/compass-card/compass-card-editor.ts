import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { LovelaceCardEditor, fireEvent } from "../../ha";
import setupCustomlocalize from "../../localize";
import { computeActionsFormSchema } from "../../shared/config/actions-config";
import { CcBaseElement } from "../../utils/base-element";
import { GENERIC_LABELS } from "../../utils/form/generic-fields";
import { HaFormSchema } from "../../utils/form/ha-form";
import { loadHaComponents } from "../../utils/loader";
import { COMPASS_CARD_EDITOR_NAME } from "./const";
import {
  CompassCardConfig,
  compassCardConfigStruct,
} from "./compass-card-config";

// import { LitElement, html, TemplateResult, CSSResult, css } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';
// import { HomeAssistant, fireEvent, LovelaceCardEditor } from "../../ha";

// import { CompassCardConfigV0, isV0Config, configV0ToV1 } from './updateV0ToV1';
// import { CCCompassConfig, CCHeaderConfig, CCIndicatorConfig, CCNorthConfig, CCHeaderItemConfig, CompassCardConfig } from './editorTypes';

// import { INDICATORS, DEFAULT_INDICATOR } from '../../const';

// import setupCustomlocalize, { COMPASS_LANGUAGES } from '../../localize';
// import { isNumeric } from '../../utils/objectHelpers';
// import { EditorTarget } from '../../utils/ha-types';

const SCHEMA: HaFormSchema[] = [
  { name: "header.title.value", selector: { text: {} } },
  { name: "indicator_sensors[0].sensor", selector: { entity: {} } },
  { name: "value_sensors[0].sensor", selector: { entity: {} } },
  { name: "compass.north.show", selector: { boolean: {} } },
  { name: "indicator_sensors[0].indicator.type", selector: { boolean: {} } },
  ...computeActionsFormSchema(),
];

@customElement(COMPASS_CARD_EDITOR_NAME)
export class CompassCardEditor
  extends CcBaseElement
  implements LovelaceCardEditor
{
  @state() private _config?: CompassCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: CompassCardConfig): void {
    assert(config, compassCardConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (GENERIC_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }
}
