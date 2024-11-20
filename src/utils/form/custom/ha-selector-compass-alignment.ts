import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { fireEvent, HomeAssistant } from "../../../ha";
import "../../../shared/editor/alignment-picker";

export type cmpAlignementSelector = {
  cc_alignment: {};
};

@customElement("ha-selector-cc_alignment")
export class HacmpAlignmentSelector extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public selector!: cmpAlignementSelector;

  @property() public value?: string;

  @property() public label?: string;

  protected render() {
    return html`
      <cc-alignment-picker
        .hass=${this.hass}
        .label=${this.label}
        .value=${this.value}
        @value-changed=${this._valueChanged}
      ></cc-alignment-picker>
    `;
  }

  private _valueChanged(ev: CustomEvent) {
    fireEvent(this, "value-changed", { value: ev.detail.value || undefined });
  }
}
