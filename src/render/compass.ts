import { CIRCLE, DEGREES_MAX, DEGREES_MID, DEGREES_MIN, DEGREES_QRT, MAJOR_TICK_ANGLE, MAJOR_TICK_INNER_RADIUS_LENGTH, MEDIUM_TICK_INNER_RADIUS_LENGTH, MINOR_TICK_INNER_RADIUS_LENGTH, RADIUS_TO_DIAMETER_FACTOR, TICKS_OUTER_RADIUS_OFFSET, TICKS_TOLERANCE_DEGREE } from '../const.js';
import { svg, SVGTemplateResult } from 'lit';
import { CCTicks } from '../cardTypes.js';
import { positiveDegrees } from './direction.js';

// The compass itself: circle, ticks and the N/E/S/W letters

export type TickLevel = 'major' | 'medium' | 'minor';

export interface Tick {
  level: TickLevel;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

// Major ticks at N/E/S/W, medium ones near the 22.5 degree compass points, minor ones for the rest
export function tickLevel(angle: number): TickLevel {
  if (angle % DEGREES_QRT === DEGREES_MIN) return 'major';
  const nearestPoint = Math.round(angle / MAJOR_TICK_ANGLE) * MAJOR_TICK_ANGLE;
  return Math.abs(angle - nearestPoint) <= TICKS_TOLERANCE_DEGREE ? 'medium' : 'minor';
}

const INNER_LENGTH: Record<TickLevel, number> = { major: MAJOR_TICK_INNER_RADIUS_LENGTH, medium: MEDIUM_TICK_INNER_RADIUS_LENGTH, minor: MINOR_TICK_INNER_RADIUS_LENGTH };

// Tick lines every `step` degrees, starting at north, from inside the radius to just outside it
export function tickLines(radius: number, step: number): Tick[] {
  const ticks: Tick[] = [];
  for (let angle = 0; angle < DEGREES_MAX; angle += step) {
    const normalized = positiveDegrees(angle);
    const level = tickLevel(normalized);
    const inner = radius - INNER_LENGTH[level];
    const outer = radius + TICKS_OUTER_RADIUS_OFFSET;
    const rad = (normalized * Math.PI) / DEGREES_MID;
    ticks.push({
      level,
      x1: CIRCLE.CENTER + inner * Math.sin(rad),
      x2: CIRCLE.CENTER + outer * Math.sin(rad),
      y1: CIRCLE.CENTER - inner * Math.cos(rad),
      y2: CIRCLE.CENTER - outer * Math.cos(rad),
    });
  }
  return ticks;
}

export function svgTicks({ color, radius, step }: CCTicks): SVGTemplateResult {
  return svg`
      <g class="ticks" style=${color ? `--compass-card-tick-color: ${color};` : ''}>
        ${tickLines(radius, step).map(({ level, x1, x2, y1, y2 }) => svg`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="tick ${level}" />`)}
      </g>
    `;
}

export function svgCircle(rotation: number): SVGTemplateResult {
  return svg`<circle class="circle" cx="${CIRCLE.CENTER}" cy="${CIRCLE.CENTER}" r="${CIRCLE.RADIUS}" transform="rotate(${rotation},${CIRCLE.CENTER},${CIRCLE.CENTER})" />`;
}

// Text positions of the N/E/S/W letters in the 152x152 viewBox
const LETTERS = {
  east: { textY: 80.089, x: 140, y: 81 },
  north: { textY: 10.089, x: CIRCLE.CENTER, y: 11 },
  south: { textY: 150.089, x: CIRCLE.CENTER, y: 151 },
  west: { textY: 80.089, x: -2, y: 81 },
};

export type Direction = keyof typeof LETTERS;

export function svgDirectionLetter(direction: Direction, text: string, color: string): SVGTemplateResult {
  const { textY, x, y } = LETTERS[direction];
  return svg`
      <g class="dir-text ${direction}">
        <text class="dir-text ${direction}-text" x="${x}" y="${textY}" style="--compass-card-dir-text-color: ${color}">
          <tspan x="${x}" y="${y}">${text}</tspan>
        </text>
      </g>
    `;
}

// The background image, clipped to the circle (so an animated GIF keeps animating) and rotated with the compass
export function svgBackground(href: string, rotation: number): SVGTemplateResult {
  const size = CIRCLE.RADIUS * RADIUS_TO_DIAMETER_FACTOR;
  const corner = CIRCLE.CENTER - CIRCLE.RADIUS;
  return svg`<image href="${href}" x="${corner}" y="${corner}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice" clip-path="url(#imageClip)" transform="rotate(${rotation}, ${CIRCLE.CENTER}, ${CIRCLE.CENTER})" class="compass-background" />`;
}
