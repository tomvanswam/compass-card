# Compass card

A custom Lovelace card that displays an indicator in a circle for use with [Home Assistant](https://home-assistant.io/).

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

## Installation

### [HACS](https://hacs.xyz/) (Home Assistant Community Store)

1. Go to HACS page on your Home Assistant instance
1. Select `Frontend`
1. Press add icon and search for `compass`
1. Select Compass Card repo and install
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd>)
1. Add compass-card to your page

### Manual

1. Download the 'compass-card.js' from the latest [release](https://github.com/tomvanswam/compass-card/releases) (with right click, save link as)
1. Place the downloaded file on your Home Assistant machine in the `config/www` folder (when there is no `www` folder in the folder where your `configuration.yaml` file is, create it and place the file there)
1. In Home Assistant go to `Configuration->Lovelace Dashboards->Resources` (When there is no `resources` tag on the `Lovelace Dashboard` page, enable advanced mode in your account settings, rand retry this step)
1. Add a new resource
   1. Url = `/local/compass-card.js`
   1. Resource type = `module`
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd>)
1. Add compass-card to your page

## Lovelace Example

![Lovelace Examples](https://github.com/tomvanswam/compass-card/blob/master/docs/compass-card.png?raw=true)

## Using the card

- Add the card with the visual editor
- Or add the card manually with the following configuration:

  ```yaml
  type: custom:compass-card
  name: Compass
  entity: sensor.wind_dir
  secondary_entity: sensor.wind_speed
  direction_offset: 0
  ```

## Options

| Name             | Type   | Requirement  | Description                                                                                                                                                                                                              | Default               | Supported |
| ---------------- | ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | --------- |
| type             | string | **Required** |                                                                                                                                                                                                                          | `custom:compass-card` | v0.0.1    |
| name             | string | **Optional** | Card header                                                                                                                                                                                                              |                       | v0.0.1    |
| entity           | sensor | **Required** | Entity that is used to draw the indicator in the compass<br />(with state in 0-360° or in English direction abbreviations (e.g N or WSW))).<br />Indicator direction is full range (not only the 16 cardinal directions) | `none`                | v0.0.1    |
| secondary_entity | sensor | **Optional** | Entity to show under the direction in compass                                                                                                                                                                            | `none`                | v0.0.1    |
| direction_offset | number | **Optional** | Value to offset the indicator display with.<br />(E.g. to create a relative north)                                                                                                                                       | `0`                   | v0.0.1    |

## Wish/Todo list

- Additional entities to show on circle
- Custom styled indicator (per entity)
- Background image
- Hide indicator in certain directions (to use the card to display the sun or moon's movement)
- Css options to change look & feel
- Localisation of direction abbreviation
- Cleanup unused boilerplate code

## Thanks to

- [@rsnodgrass](https://github.com/rsnodgrass) for [wind-compass-card](https://github.com/rsnodgrass/wind-compass-card), which gave me the idea to make this
- [@iantrich](https://www.github.com/iantrich) for the [boiler-plate card](https://github.com/custom-cards/boilerplate-card), which got me started
- [@xixao](https://codepen.io/xixao/) for [wind speed/direction css](https://codepen.io/xixao/pen/OPovyN)

## Support

Help me out for a couple of :beers:, a :coffee: or legos!
Or clone, and create and a PR to make the card even better.

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/tomvanswam)

[commits-shield]: https://img.shields.io/github/commit-activity/y/tomvanswam/compass-card.svg?style=for-the-badge
[commits]: https://github.com/tomvanswam/compass-card/commits/master
[devcontainer]: https://code.visualstudio.com/docs/remote/containers
[license-shield]: https://img.shields.io/github/license/custom-cards/boilerplate-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2020.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/tomvanswam/compass-card.svg?style=for-the-badge
[releases]: https://github.com/tomvanswam/compass-card/releases
