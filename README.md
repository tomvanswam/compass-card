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

## Using the card

- Add the card with the visual editor
- Or add the card manually with the following configuration:

  ```yaml
  type: custom:compass-card
  name: Compass
  entity: sensor.wind_dir
  secondary_entity: sensor.wind_speed
  direction_offset: 0
  compass:
    indicator: arrow_outward
  ```

## Lovelace Example

### Default

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-outward.png?raw=true)

### Compass indicator `arrow_inward`

```yaml
type: custom:compass-card
entity: sensor.wind_dir
secondary_entity: sensor.wind_speed
compass:
  indicator: arrow_inward
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-inward.png?raw=true)

### Compass indicator `circle`

```yaml
type: custom:compass-card
entity: sun.azimuth
secondary_entity: sun.elevation
compass:
  indicator: circle
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-north.png?raw=true)

### Compass indicator `north indicator`

Left image yaml:

```yaml
type: custom:compass-card
entity: sun.azimuth
secondary_entity: sun.elevation
compass:
  indicator: circle
  show_north: true
```

Right image yaml:

```yaml
type: custom:compass-card
entity: sun.azimuth
secondary_entity: sun.elevation
direction_offset: 15
compass:
  indicator: circle
  show_north: true
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-circle.png?raw=true)

## Options

| Name             | Type                              | Requirement  | Default               | Supported | Visual Config | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | --------------------------------- | ------------ | --------------------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| type             | string                            | **Required** | `custom:compass-card` | v0.0.1    |               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| name             | string                            | **Optional** |                       | v0.0.1    | &#10003;      | Card header                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| entity           | sensor                            | **Required** | `none`                | v0.0.1    | &#10003;      | Entity that is used to draw the indicator in the compass. Valid entity states are:<br />number - (positive and/or negative, multiples of 360 are removed).<br />string - only Cardinal directions in English (e.g. E of WSW)<br/>string - any string with numbers in it will use the numbers as direction for both indicator and display value (e.g. `E (90.4)` parsed to `90.4`, note a string like `E (90) speed 80` parsed to `9080` and be recalculated to `80` (= `9080 % 360`))<br />Indicator direction is full range (not only the 16 cardinal directions) |
| secondary_entity | sensor                            | **Optional** | `none`                | v0.0.1    | &#10003;      | Entity to show under the direction in compass                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| direction_offset | number                            | **Optional** | `0`                   | v0.0.1    | &#10003;      | Value to offset the indicator display with.<br />(E.g. to create a relative north)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| compass          | [compass object](#compass-object) | **Optional** |                       | v0.1.0    | &#8594;       | Compass properties                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### Compass Object

| Name       | Type      | Requirement  | Default         | Supported | Visual Config | Description                                                                                                                       |
| ---------- | --------- | ------------ | --------------- | --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| indicator  | list item | **Optional** | `arrow_outward` | v0.1.0    | &#10003;      | Type of indicator to display in compass following indicators are possible:<br />`arrow_outward`<br />`arrow_inward`<br />`circle` |
| show_north | boolean   | **Optional** | `falsed`        | v0.2.0    | &#10003;      | Show an indicator at the northern side of the compass                                                                             |

## Wish/Todo list

- Additional entities to show on circle
- Custom styled indicator (per entity)
- Background image
- Hide indicator in certain directions (to use the card to display the sun or moon's movement)
- Css options to change look & feel
- Localisation of direction abbreviation
- Cleanup unused boilerplate code

## Contact

You can find me on the [Home Assistant Community Site](https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909)<br />
And occasionally on the [HACS](https://discord.gg/apgchf8) and [Home Assistant](https://www.home-assistant.io/join-chat) Discord

## Thanks to

- [@rsnodgrass](https://github.com/rsnodgrass) for [wind-compass-card](https://github.com/rsnodgrass/wind-compass-card), which gave me the idea to make this
- [@iantrich](https://www.github.com/iantrich) for the [boiler-plate card](https://github.com/custom-cards/boilerplate-card), which got me started
- [@xixao](https://codepen.io/xixao/) for [wind speed/direction css](https://codepen.io/xixao/pen/OPovyN)

## Support

Help me out for a couple of :beers:, a :coffee: or legos!<br />
Or clone, and create and a PR to help make the card even better.

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/tomvanswam)

[commits-shield]: https://img.shields.io/github/commit-activity/y/tomvanswam/compass-card.svg?style=for-the-badge
[commits]: https://github.com/tomvanswam/compass-card/commits/master
[license-shield]: https://img.shields.io/github/license/custom-cards/boilerplate-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/maintenance/yes/2020.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/tomvanswam/compass-card.svg?style=for-the-badge
[releases]: https://github.com/tomvanswam/compass-card/releases
