import { CSSResult, css } from 'lit';

const style: CSSResult = css`
  :host ::slotted(.card-content:not(:first-child)),
  slot:not(:first-child)::slotted(.card-content) {
    padding-top: 0px;
    margin-top: -8px;
  }
  :host ::slotted(.card-content) {
    padding: 16px;
  }
  ha-card {
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex: stretch;
    flex-direction: column;
  }
  .header {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 0px;
  }
  .header > .name {
    line-height: 50px;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon {
    margin-top: 8px;
    float: right;
  }
  .compass {
    flex: 1;
    padding: 16px;
    z-index: 1;
  }
  .header ~ .compass {
    padding-top: 0px;
  }
  .sensors {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: calc(100% - 32px);
    height: calc(100% - 32px);
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 2;
  }
  .header ~ .sensors {
    padding-top: 0px;
    top: 58px;
    height: calc(100% - 74px);
  }
  .compass-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .indicator-sensors,
  .value-sensors {
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .indicator-sensors .abbr {
    font-size: 1rem;
  }
  .indicator-sensors .measurement {
    font-size: 1rem;
  }
  .indicator-sensors .value {
    font-size: 1rem;
  }
  .value-sensors .measurement {
    font-size: 1rem;
  }
  .value-sensors .value {
    font-size: 1rem;
  }
  [class^='sensor-'] {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }
`;
export default style;
