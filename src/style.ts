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
    flex-direction: column;
    flex: 1;
    position: relative;
    overflow: hidden;
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
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    margin: 10px auto;
    height: auto;
    max-width: 100%;
  }
  .content {
    position: relative;
    width: 100%;
    font-weight: normal;
    line-height: 28px;
    height: auto;
  }
  .indicator-sensors,
  .value-sensors {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    pointer-events: none;
  }
  .indicator-sensors {
    top: 20%;
    line-height: 18px;
    font-weight: 500;
    font-size: 16px;
  }
  .value-sensors {
    top: 42%;
  }
  .value-sensors .measurement {
    font-size: 1rem;
  }
  .value-sensors .value {
    font-size: 1.75rem;
  }
  .compass-svg {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
`;
export default style;
