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
    min-height: var(--row-size, var(--grid-card-column-count, 200px));
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex: stretch;
    flex-direction: column;
  }
  ha-card:has(.header) {
    min-height: var(--row-size, var(--grid-card-column-count, 250px));
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
    z-index: 1;
  }
  .sensors {
    z-index: 2;
  }
  .sensors,
  .compass {
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: calc(100% - 32px);
    justify-content: center;
    padding: 16px;
    position: absolute;
    width: calc(100% - 32px);
  }
  .header ~ .sensors,
  .header ~ .compass {
    padding-top: 0px;
    top: 58px;
    height: calc(100% - 74px);
  }
  .compass-svg {
    width: auto;
    height: auto;
    max-height: 100%;
    display: block;
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
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.2rem;
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
    font-size: 2rem;
  }
  [class^='sensor-'] {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }
`;

export default style;
