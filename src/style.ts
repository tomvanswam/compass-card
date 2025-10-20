import { CSSResult, css } from 'lit';

const style: CSSResult = css`
  :host {
    --compass-card-masonry-height-without-header: 200px;
    --compass-card-masonry-height-with-header: calc(var(--compass-card-masonry-height-without-header, 200) + 50px);
    --compass-card-compass-padding: 16px;
    --compass-card-svg-scale: 100%;
  }

  :host ::slotted(.card-content:not(:first-child)),
  slot:not(:first-child)::slotted(.card-content) {
    padding-top: 0px;
    margin-top: -8px;
  }
  :host ::slotted(.card-content) {
    padding: 16px;
  }
  ha-card {
    min-height: var(--grid-column-count, var(--compass-card-masonry-height-without-header, 200px));
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex: stretch;
    flex-direction: column;
  }
  ha-card:has(.header) {
    min-height: var(--grid-column-count, var(--compass-card-masonry-height-with-header, 250px));
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
    height: calc(100% - (2 * var(--compass-card-compass-padding, 16px)));
    justify-content: center;
    padding: var(--compass-card-compass-padding, 16px);
    position: absolute;
    width: calc(100% - (2 * var(--compass-card-compass-padding, 16px)));
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
    transform: scale(var(--compass-card-svg-scale, 1));
  }
  .indicator-sensor,
  .value-sensor {
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .indicator-sensor .abbr {
    font-size: 2rem;
    font-weight: 600;
  }
  .indicator-sensor .measurement {
    padding-left: 0.2rem;
    font-size: 1rem;
  }
  .indicator-sensor .value {
    padding-left: 0.2rem;
    font-size: 1rem;
  }
  .value-sensor .measurement {
    font-size: 1rem;
    padding-left: 0.2rem;
  }
  .value-sensor .value {
    font-size: 2rem;
  }
  [class^='sensor-'] {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }
  .value-sensor[class^='sensor-']:not(:first-child) {
    margin-top: -0.8rem;
  }
`;

export default style;
