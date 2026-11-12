# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`compass-card` is a custom Home Assistant Lovelace card (Lit + TypeScript) that draws a compass with one or more direction indicators (from entity states/attributes) and value sensors. Distributed via HACS (`hacs.json`) as a single bundled `dist/compass-card.js`. User-facing YAML docs live in the GitHub wiki, not in this repo.

## Commands

- `npm ci` – install
- `npm start` – rollup watch; serves `dist/` on `http://0.0.0.0:4000` (dev mode, no terser)
- `npm run build` – `eslint` + `npm cache verify` + `rollup -c` (minified). This is what CI (`.github/workflows/build.yml`) runs.
- `npm run lint` / `npm run lint:fix` – ESLint flat config (`eslint.config.mjs`) covers TS, JSON, CSS and Markdown
- `npm test` – vitest (jsdom) over `src/**/*.test.ts`; CI runs it after the build. Single file/test: `npx vitest run src/test/render.test.ts -t "<name>"`. Shared test configs/entities are in `src/test/fixtures.ts`.

If rollup builds behave oddly after switching branches, clear the stale cache: `rm -rf node_modules/.cache/rollup-plugin-typescript2`.

## Dev environment

The devcontainer (`.devcontainer/`) runs a Home Assistant instance on `localhost:8123` using `.hass_dev/` as its config. That HA loads the card from `http://localhost:4000/compass-card.js` (see `.hass_dev/configuration.yaml`), so run `npm start` and refresh HA to test. Example dashboards are in `.hass_dev/views/` and `.hass_dev/lovelace.yaml`; helper cards (card-mod, stack-in-card, …) in `.hass_dev/www/`.

## Architecture

- `src/compass-card.ts` – the `compass-card` element. Registers itself in `window.customCards`, provides `getConfigElement`/`getStubConfig`/`getGridOptions`. `setConfig` validates the YAML with the superstruct schema and throws user-readable errors (including v2→v3 migration hints). On every `hass` update, `updateConfig` turns raw config + entity states into render models; `shouldUpdate` limits re-renders to changes in the entities the config references. The element only composes; SVG/text pieces come from `src/render/`.
- `src/defaults.ts` – `CONFIG_DEFAULTS`, the single source of truth for defaults, used by rendering (`objectHelpers.ts`), the editor (shown values, and omitting defaults from the YAML) and `getStubConfig`. Change defaults only here.
- `src/cardTypes.ts` – resolved render models (`CC*` types: `CCCompass`, `CCIndicatorSensor`, `CCValueSensor`, `CCHeader`, `CCProperties`, …). The raw user config type and its superstruct `CompassCardConfigStruct` live in `src/editor/editorTypes.ts`.
- `src/utils/objectHelpers.ts` – config → `CC*` model resolution (`getCompass`, `getIndicatorSensors`, `getValueSensors`, `getHeader`) and `findValues`, which collects referenced entity ids (used for update filtering).
- `src/render/` – pure render helpers: `direction.ts` (sensor value → degrees/abbreviation), `activeStyle.ts` (an element's own style overridden by the dynamic style band of the current value, cached per `entities` object), `compass.ts` (circle, ticks, N/E/S/W), `indicators.ts` (arrow/circle/mdi/image shapes), `texts.ts` (header and value lines).
- `src/editor/` – visual editor. `editor.ts` is `compass-card-editor`; sub-editors per part (header, compass, indicator/value sensors, dynamic style) share a detail-editor base and helpers in `editorHelpers.ts`; `haTypes.ts` has local copies of HA frontend types.
- `src/const.ts` – shared constants (compass points/abbreviations, indicator icon values `arrow_inward|arrow_outward|circle`, size limits, `MAX_INDICATOR_ARRAY_SIZE = 10`).
- `src/localize/` – `localize(key)` with JSON files per language in `languages/`; `en.json` is the reference. Add new keys to all language files (non-English texts are partly machine-translated).
- `src/utils/` – `handleClick.ts` (tap/hold actions), `debug.ts` (`debugLog`, active with the `debug` option), `ha-helpers.ts`/`ha-types.ts`.

TypeScript runs with `noImplicitAny`; imports use explicit `.js` extensions.

## Conventions

- Indicator `image` accepts one of the `ICON_VALUES`, an `mdi:` icon, or an image URL; keep schema, error message and editor in sync when changing this.
- Color fields in the editor stay plain text inputs (HA's color picker was explicitly rejected by the maintainer).
- A `tap_action` without an `action:` key is treated strictly (defaults to more-info).
