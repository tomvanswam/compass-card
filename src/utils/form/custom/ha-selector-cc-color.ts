import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { fireEvent, HomeAssistant } from "../../../ha";
import "../../../shared/editor/color-picker";

export type MushColorSelector = {
  cc_color: {};
};

@customElement("ha-selector-cc_color")
export class HaMushColorSelector extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public selector!: MushColorSelector;

  @property() public value?: string;

  @property() public label?: string;

  protected render() {
    return html`
      <cc-color-picker
        .hass=${this.hass}
        .label=${this.label}
        .value=${this.value}
        @value-changed=${this._valueChanged}
      ></cc-color-picker>
    `;
  }

  private _valueChanged(ev: CustomEvent) {
    fireEvent(this, "value-changed", { value: ev.detail.value || undefined });
  }
}
