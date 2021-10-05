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
    line-height: 40px;
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
    display: block;
    width: 100%;
    height: 152px;
    max-width: 152px;
    margin: 10px auto;
  }
  .content {
    height: 162px;
    position: relative;
    width: 100%;
    font-weight: normal;
    line-height: 28px;
  }
  .value-sensors {
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    text-align: center;
    top: 62px;
    left: 50%;
    transform: translateX(-50%);
  }
  .indicator-sensors {
    line-height: 18px;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    overflow: hidden;
    position: absolute;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
  }
  .value-sensors .measurement {
    font-size: 18px;
  }
  .value-sensors .value {
    font-size: 28px;
  }
`;

export default style;
