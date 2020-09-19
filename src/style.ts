import { CSSResult, css } from 'lit-element';

const style: CSSResult = css`
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
  .header > .name,
  .direction {
    color: var(--compass-secondary-text-color, var(--secondary-text-color));
    line-height: 40px;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon {
    color: var(--compass-state-icon-color, var(--state-icon-color));
    margin-top: 8px;
    float: right;
  }
  .compass {
    display: block;
    /* position: relative; */
    width: 152px;
    height: 152px;
    margin: 10px auto;
    /* font-family: var(--compass-font-caption_-_font-family, var(--paper-font-caption_-_font-family)); */
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
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .direction {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .measurement {
    font-size: 18px;
    color: var(--secondary-text-color);
  }
  .value {
    font-size: 28px;
    color: var(--primary-text-color);
  }
`;

export default style;
