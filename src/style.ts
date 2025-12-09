import { css, CSSResult } from 'lit';

const style: CSSResult = css`
  :host {
    --compass-card-compass-padding: 16px;
    --compass-card-svg-scale: 1;
    --compass-card-masonry-row-height: 50px;
    --compass-card-masonry-rows: 3;
    --compass-card-masonry-header-rows: 1;
    --compass-card-section-min-height: calc(var(--row-size) * var(--row-height));
    --compass-card-masonry-min-height: calc(var(--compass-card-masonry-rows) * var(--compass-card-masonry-row-height));
    --compass-card-masonry-min-height-header: calc((var(--compass-card-masonry-rows) + var(--compass-card-masonry-header-rows)) * var(--compass-card-masonry-row-height));
    --compass-card-svg-image-opacity: 0;
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
    min-height: var(--compass-card-section-min-height, var(--compass-card-masonry-min-height, 150px));
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  ha-card:has(.header) {
    min-height: var(--compass-card-section-min-height, var(--compass-card-masonry-min-height-header, 200px));
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
    color: var(--compass-card-header-title-color, var(--primary-text-color));
  }
  .icon {
    margin-top: 8px;
    float: right;
    color: var(--compass-card-header-icon-color, var(--primary-text-color));
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
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
    overflow: visible;
    transform: scale(var(--compass-card-svg-scale, 1));
    transform-box: fill-box;
    transform-origin: center center;
    aspect-ratio: 1;
  }
  .compass-svg .compass-background {
    opacity: var(--compass-card-svg-image-opacity);
  }

  /* circle presentational styling via variables */
  .compass-svg .circle {
    fill: none;
    stroke: var(--compass-circle-stroke, var(--primary-text-color));
    stroke-width: var(--compass-circle-stroke-width, 2px);
    stroke-opacity: 1;
  }

  /* indicator shapes use --compass-card-indicator-color (set inline on the group) */
  .compass-svg [class^='indicator-'] *,
  .compass-svg .arrow-outward path,
  .compass-svg .arrow-inward path,
  .compass-svg .circle-indicator path {
    /* elements that use var(--compass-card-indicator-color) will inherit it */
  }

  /* direction labels: centralized font & sizing, color via --compass-card-dir-text-color */
  .compass-svg .dir-text {
    font-family: sans-serif;
    font-size: 13.333px;
    fill: var(--compass-card-dir-text-color, var(--primary-text-color));
  }

  /* anchors for compass points */
  .compass-svg .north-text,
  .compass-svg .south-text {
    text-anchor: middle;
  }
  .compass-svg .east-text,
  .compass-svg .west-text {
    text-anchor: start;
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
    color: var(--compass-card-indicator-abbr-color, var(--primary-text-color));
  }
  .indicator-sensor .measurement {
    padding-left: 0.2rem;
    font-size: 1rem;
    color: var(--compass-card-indicator-units-color, var(--secondary-text-color));
  }
  .indicator-sensor .value {
    padding-left: 0.2rem;
    font-size: 1rem;
    color: var(--compass-card-indicator-value-color, var(--primary-text-color));
  }
  .value-sensor .measurement {
    font-size: 1rem;
    padding-left: 0.2rem;
    color: var(--compass-card-value-units-color, var(--secondary-text-color));
  }
  .value-sensor .value {
    font-size: 2rem;
    color: var(--compass-card-value-value-color, var(--primary-text-color));
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
  .compass__ticks {
    stroke: var(--compass-card-tick-color, var(--primary-text-color));
    stroke-linecap: round;
  }
  .compass__tick {
    stroke-width: 0.7;
    opacity: 0.7;
  }
  .compass__tick--major {
    stroke-width: 1.2;
    opacity: 0.7;
  }
  .compass__tick--minor {
    stroke-width: 0.7;
    opacity: 0.7;
  }
`;

export default style;
