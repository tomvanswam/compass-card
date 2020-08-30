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
    padding: 16px;
    display: block;
    width: 120px;
    height: 120px;
    position: relative;
    margin: 10px auto;
    font-family: var(--compass-font-caption_-_font-family, var(--paper-font-caption_-_font-family));
  }
  .compass > .direction {
    height: 100%;
    width: 100%;
    margin: -3px;
    display: block;
    border-radius: 100%;
    border-width: 3px;
    border-color: var(--compass-ring-color, var(--primary-color));
    border-style: solid;
    color: var(--compass-primary-text-color, var(--primary-text-color));
  }
  .compass > .direction > p {
    text-align: center;
    margin: 0;
    padding: 30% 0 0 0;
    top: 30px;
    width: 100%;
    line-height: normal;
    display: block;
    font-size: 28px;
    font-weight: bold;
  }
  .compass > .direction > p > span {
    display: block;
    line-height: normal;
    font-size: 11px;
    font-weight: normal;
  }
  .indicator-pane {
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    /* substract the direction border width to get correct size */
    right: 0px;
    /* add the direction border width to get correct size */
    top: 0px;
  }
  .indicator {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    margin-left: -3px;
  }
  .arrow_outward {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 30px solid var(--compass-indicator-color, var(--accent-color));
    /* substract left+right border width from full size to center */
    left: calc((100% - 10px) / 2);
    z-index: 99;
  }
  .arrow_inward {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 30px solid var(--compass-indicator-color, var(--accent-color));
    /* substract left+right border width from full size to center */
    left: calc((100% - 10px) / 2);
    z-index: 89;
  }
  .circle {
    border: 8px solid var(--compass-indicator-color, var(--accent-color));
    margin: 8px;
    border-radius: 50%;
    /* substract 2x border + 2x margin from full size to center */
    left: calc((100% - 32px) / 2);
    z-index: 79;
  }
  .north {
    color: var(--compass-north-color, var(--primary-color));
    padding-top: 0px;
    margin: -3px;
    /* substract margin from full size to center */
    left: calc((100% - 5px) / 2);
    z-index: 109;
  }
`;

export default style;
