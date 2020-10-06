import { CSSResult, css } from 'lit-element';

const style: CSSResult = css`
  :host ::slotted(.card-content:not(:first-child)),
  slot:not(:first-child)::slotted(.card-content) {
    padding-top: 0px;
    margin-top: -8px;
  }
  :host ::slotted(.card-content) {
    padding: 16px;
  }
  .floated-label-placeholder {
    font-family: var(--paper-font-caption_-_font-family);
    -webkit-font-smoothing: var(--paper-font-caption_-_-webkit-font-smoothing);
    white-space: var(--paper-font-caption_-_white-space);
    overflow: var(--paper-font-caption_-_overflow);
    text-overflow: var(--paper-font-caption_-_text-overflow);
    font-size: var(--paper-font-caption_-_font-size);
    font-weight: var(--paper-font-caption_-_font-weight);
    letter-spacing: var(--paper-font-caption_-_letter-spacing);
    line-height: var(--paper-font-caption_-_line-height);
    color: var(--disabled-text-color);
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
    width: 152px;
    height: 152px;
    margin: 10px auto;
  }
  .content {
    height: 162px;
    position: relative;
    width: 100%;
    font-weight: normal;
    line-height: 28px;
  }
  .info {
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    text-align: center;
    top: 62px;
    left: 50%;
    transform: translateX(-50%);
  }
  .direction {
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
  .measurement {
    font-size: 18px;
  }
  .value {
    font-size: 28px;
  }
`;

export default style;
