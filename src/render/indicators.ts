import { ARROW_ART, CENTER_OBJECT_FACTOR, CIRCLE } from '../const.js';
import { svg, SVGTemplateResult } from 'lit';

// SVG shapes of an indicator, drawn pointing north at `radius` from the center; the caller rotates them

export interface IndicatorShape {
  opacity: number;
  radius: number;
  size: number;
}

// The mdi viewBox is 24x24; smaller indicators are drawn in a box of at least that size
const MDI_BOX = 24;
const MDI_CENTER = 12;

/**
 * Placement of the original arrow artwork: scaled to fit both the radius and the size box, and moved so the
 * box is centered `radius` above the compass center.
 */
export function arrowTransform(size: number, radius: number): { scale: number; x: number; y: number } {
  const x = CIRCLE.CENTER - size * CENTER_OBJECT_FACTOR;
  const y = CIRCLE.CENTER - radius - size * CENTER_OBJECT_FACTOR;
  const scale = Math.min(radius / ARROW_ART.RADIUS, size / ARROW_ART.SIZE);
  return { scale, x: x - scale * (CIRCLE.CENTER - ARROW_ART.RADIUS), y: y - scale * ARROW_ART.TOP };
}

// Placement of the circle artwork: scaled to the size and centered `radius` above the compass center
export function circleTransform(size: number, radius: number): { scale: number; x: number; y: number } {
  const scale = size / ARROW_ART.SIZE;
  return { scale, x: CIRCLE.CENTER - scale * CIRCLE.CENTER, y: CIRCLE.CENTER - radius - scale * (ARROW_ART.TOP + ARROW_ART.RADIUS) };
}

export function svgArrowOutward({ opacity, radius, size }: IndicatorShape): SVGTemplateResult {
  const { scale, x, y } = arrowTransform(size, radius);
  return svg`
      <g class="arrow-outward" opacity=${opacity} transform="translate(${x} ${y}) scale(${scale})">
        <path d="M${CIRCLE.CENTER} 0v23l-8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0"/>
        <path d="M${CIRCLE.CENTER} 0v23l8 7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5"/>
      </g>
    `;
}

export function svgArrowInward({ opacity, radius, size }: IndicatorShape): SVGTemplateResult {
  const { scale, x, y } = arrowTransform(size, radius);
  return svg`
      <g class="arrow-inward" opacity=${opacity} transform="translate(${x} ${y}) scale(${scale})">
        <path d="M${CIRCLE.CENTER} 30.664v-23l-8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width=".5" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="var(--compass-card-indicator-color)" stroke="var(--compass-card-indicator-color)" stroke-width="0" />
        <path d="M${CIRCLE.CENTER} 30.664v-23l8-7z" fill="white" opacity="0.5" stroke="white" stroke-width=".5" />
      </g>
    `;
}

export function svgCircleIndicator({ opacity, radius, size }: IndicatorShape): SVGTemplateResult {
  const { scale, x, y } = circleTransform(size, radius);
  return svg`
      <g class="circle-indicator" opacity=${opacity} transform="translate(${x} ${y}) scale(${scale})">
        <path d="m${CIRCLE.CENTER} 5.8262a9.1809 9.1809 0 0 0-0.0244 0 9.1809 9.1809 0 0 0-9.1813 9.18 9.1809 9.1813 0 0 0 9.1813 9.1813 9.1809 9.1809 0 0 0 0.0244 0z"
              fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z"
              fill="var(--compass-card-indicator-color)"/>
        <path d="m${CIRCLE.CENTER} 5.8262v18.361a9.1809 9.1809 0 0 0 9.1556-9.1813 9.1809 9.1809 0 0 0-9.1556-9.18z"
              fill="white" opacity="0.5"/>
      </g>
    `;
}

// An icon path (24x24 viewBox) as pure SVG, so it also works on iOS (no foreignObject ha-icon)
export function svgIconIndicator(path: string, { opacity, radius, size }: IndicatorShape): SVGTemplateResult {
  const box = Math.max(size, MDI_BOX);
  const x = CIRCLE.CENTER - box * CENTER_OBJECT_FACTOR;
  const y = CIRCLE.CENTER - radius - box * CENTER_OBJECT_FACTOR;
  return svg`
      <svg x=${x} y=${y} width=${box} height=${box} viewBox="0 0 ${box} ${box}" overflow="visible">
        <g transform="translate(${box * CENTER_OBJECT_FACTOR}, ${box * CENTER_OBJECT_FACTOR}) scale(${size / MDI_BOX}) translate(-${MDI_CENTER}, -${MDI_CENTER})">
          <path d=${path} fill="var(--compass-card-indicator-color)" opacity=${opacity}/>
        </g>
      </svg>
    `;
}

export function svgImageIndicator(href: string, { opacity, radius, size }: IndicatorShape): SVGTemplateResult {
  return svg`
      <image
        href=${href}
        x=${CIRCLE.CENTER - size * CENTER_OBJECT_FACTOR}
        y=${CIRCLE.CENTER - radius - size * CENTER_OBJECT_FACTOR}
        width=${size}
        height=${size}
        preserveAspectRatio="xMidYMid meet"
        opacity=${opacity}
      />
    `;
}
