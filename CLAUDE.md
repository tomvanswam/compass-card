# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`compass-card` is a custom Home Assistant Lovelace card (Lit + TypeScript) that draws a compass with one or more direction indicators (from entity states/attributes) and value sensors. Distributed via HACS (`hacs.json`) as a single bundled `dist/compass-card.js`. User-facing YAML docs live in the GitHub wiki, not in this repo.

## Commands

- `npm ci` – install
- `npm start` – rollup watch; serves `dist/` on `http://0.0.0.0:4000` (dev mode, no terser)
- `npm run build` – `eslint` + `npm cache verify` + `rollup -c` (minified). This is what CI (`.github/workflows/build.yml`) runs.
- `npm run lint` / `npm run lint:fix` – ESLint flat config (`eslint.config.mjs`) covers TS, JSON, CSS and Markdown
- There is no test runner on `master` yet.

If rollup builds behave oddly after switching branches, clear the stale cache: `rm -rf node_modules/.cache/rollup-plugin-typescript2`.

## Dev environment

The devcontainer (`.devcontainer/`) runs a Home Assistant instance on `localhost:8123` using `.hass_dev/` as its config. That HA loads the card from `http://localhost:4000/compass-card.js` (see `.hass_dev/configuration.yaml`), so run `npm start` and refresh HA to test. Example dashboards are in `.hass_dev/views/` and `.hass_dev/lovelace.yaml`; helper cards (card-mod, stack-in-card, …) in `.hass_dev/www/`.

## Architecture

- `src/compass-card.ts` – the `compass-card` element. Registers itself in `window.customCards`, provides `getConfigElement`/`getStubConfig`/`getGridOptions`. `setConfig` validates the YAML with the superstruct schema and throws user-readable errors (including v2→v3 migration hints). On every `hass` update, `updateConfig` turns raw config + entity states into render models; `shouldUpdate` limits re-renders to changes in the entities the config references. Rendering is a hand-built SVG.
- `src/cardTypes.ts` – two layers of types: the raw user config (`CompassCardConfig`, plus its superstruct `CompassCardConfigStruct`) and the resolved render models (`CC*` types: `CCCompass`, `CCIndicatorSensor`, `CCValueSensor`, `CCHeader`, `CCColors`, …).
- `src/utils/objectHelpers.ts` – config → `CC*` model resolution (`getCompass`, `getIndicatorSensors`, `getValueSensors`, `getHeader`), defaults, dynamic styling, and `findValues` which collects referenced entity ids (used for update filtering). Most behavioural changes land here.
- `src/editor.ts` / `src/editorTypes.ts` – the `compass-card-editor` visual editor (uses HA's form/selector elements; schemas in `editorTypes.ts`).
- `src/const.ts` – shared constants (compass points/abbreviations, indicator icon values `arrow_inward|arrow_outward|circle`, size defaults, `MAX_INDICATOR_ARRAY_SIZE = 10`).
- `src/style.ts` – card CSS.
- `src/localize/` – `localize(key)` with JSON files per language in `languages/`; `en.json` is the reference. Add new keys to all language files.
- `src/utils/handleClick.ts` – tap/hold action handling; `ha-helpers.ts`/`ha-types.ts` – minimal local copies of HA frontend types/helpers.

## Conventions

- Indicator `image` accepts one of the `ICON_VALUES`, an `mdi:` icon, or an image URL; keep schema, error message and editor in sync when changing this.
- Color fields in the editor stay plain text inputs (HA's color picker was explicitly rejected by the maintainer).
- A `tap_action` without an `action:` key is treated strictly (defaults to more-info).
