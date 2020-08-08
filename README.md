# Compass card

A custom Lovelace card that displays an indicator in a circle for use with [Home Assistant](https://home-assistant.io/).

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)

<!-- [![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs) -->

![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

<!-- ## HACS installation

1. Go into [HACS](https://hacs.xyz/) (Home Assistant Community Store) on your Home Assistant instance
2. Press menu icon and select **Custom repositories**
3. Add new repository
   <pre>
   url: https://github.com/tomvanswam/compass-card
   category: Lovelace
   </pre>
4. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd>)
5. Add compass-card to your page -->

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

| Name             | Type   | Requirement  | Description                                                                                                                                                                                                    | Default |
| ---------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| type             | string | **Required** | `custom:compass-card`                                                                                                                                                                                          |
| name             | string | **Optional** | Card header                                                                                                                                                                                                    | ``      |
| entity           | string | **Required** | Entity that is used to draw the indicator in the compass (with state in 0-360° or in English direction abbreviations (e.g N or WSW))). Indicator direction is full range (not only the 16 cardinal directions) | `none`  |
| secondary_entity | string | **Optional** | Value to show under the direction in compass                                                                                                                                                                   | `none`  |
| direction_offset | number | **Optional** | Value to offset the indicator display with (e.g. to create a relative north)                                                                                                                                   | `0`     |

## Wish/Todo list

- Implement Github actions, for correct HACS usage
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
