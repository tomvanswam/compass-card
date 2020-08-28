# Compass card

A custom Lovelace card that displays an indicator in a circle for use with [Home Assistant](https://home-assistant.io/).

[![GitHub Release][releases-shield]][releases-link] [![GitHub Release Date][release-date-shield]][releases-link] [![GitHub Releases][latest-download-shield]][traffic-link] [![GitHub Releases][total-download-shield]][traffic-link]

[![HACS Badge][hacs-shield]][hacs-link] [![HomeAssistant][home-assistant-shield]][home-assistant-link] [![License][license-shield]][license-link]

![Project Maintenance][maintenance-shield] [![GitHub Activity][activity-shield]][activity-link] [![Open bugs][bugs-shield]][bugs-link] [![Open enhancements][enhancements-shield]][enhancement-link]

[![Community Forum][forum-shield]][forum-link] [![Buy Me A Coffee][coffee-shield]][coffee-link]

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
1. In Home Assistant go to `Configuration->Lovelace Dashboards->Resources` (When there is no `resources` tag on the `Lovelace Dashboard` page, enable advanced mode in your account settings, and retry this step)
1. Add a new resource
   1. Url = `/local/compass-card.js`
   1. Resource type = `module`
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>F5</kbd>)
1. Add compass-card to your page

## Using the card

- Add the card with the visual editor
- Or add the card manually with the following (minimal) configuration:

  ```yaml
  type: custom:compass-card
  entity: sensor.wind_dir
  secondary_entity: sensor.wind_speed
  ```

## Lovelace Examples

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

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-circle.png?raw=true)

### Compass `north indicator` and `direction_offset`

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

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-north.png?raw=true)

## Options

| Name             | Type                              | Requirement  | Default               | Supported | Config                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | --------------------------------- | ------------ | --------------------- | --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type             | string                            | **Required** | `custom:compass-card` | v0.0.1    |                                       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| name             | string                            | **Optional** |                       | v0.0.1    | Visual/YAML                           | Card header                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| entity           | sensor                            | **Required** | `none`                | v0.0.1    | Visual/YAML                           | Entity that is used to draw the indicator in the compass. Valid entity states are:<br />number - (positive and/or negative, multiples of 360 are removed).<br />string - only Cardinal directions in English (e.g. E of WSW)<br/>string - any string with numbers in it will use the numbers as direction for both indicator and display value (e.g. `E (90.4)` parsed to `90.4`)<br />Indicator direction is full range (not only the 16 cardinal directions) |
| secondary_entity | sensor                            | **Optional** | `none`                | v0.0.1    | Visual/YAML                           | Entity to show under the direction in compass                                                                                                                                                                                                                                                                                                                                                                                                                  |
| direction_offset | number                            | **Optional** | `0`                   | v0.0.1    | Visual/YAML                           | Value to offset the indicator display with.<br />(E.g. to create a relative north)                                                                                                                                                                                                                                                                                                                                                                             |
| compass          | [compass object](#compass-object) | **Optional** |                       | v0.1.0    | See [compass object](#compass-object) | Compass properties                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| tap_action       | [action config](#action-config)   | **Optional** |                       | v0.4.0    | See [action config](#action-config)   | Tap action settings (what happens when you click/touch the card)                                                                                                                                                                                                                                                                                                                                                                                               |

### Compass Object

| Name       | Type                  | Requirement  | Default         | Supported | Config      | Description                                                                                                                       |
| ---------- | --------------------- | ------------ | --------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------- |
| indicator  | list item             | **Optional** | `arrow_outward` | v0.1.0    | Visual/YAML | Type of indicator to display in compass following indicators are possible:<br />`arrow_outward`<br />`arrow_inward`<br />`circle` |
| show_north | boolean               | **Optional** | `false`         | v0.2.0    | Visual/YAML | Show an indicator at the northern side of the compass                                                                             |
| language   | [language](#language) | **Optional** |                 | v0.3.0    | Visual/YAML | Show the abbreviation in the language configured in Home Assistant (default/empty), or configured language                        |

### Action Config

| Name            | Type                | Requirement                                  | Default                             | Supported | Config    | Description                                                                                                                                                                                         |
| --------------- | ------------------- | -------------------------------------------- | ----------------------------------- | --------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| action          | list item           | **Optional**                                 | `more-info`                         | v0.4.0    | YAML only | Type of action to launch when clicking/touching the card:<br />`more-info`<br />`navigate`<br />`url`<br/>`call-service`                                                                            |
| entity          | string              | **Optional** for action `more-info`          | `entity` used for compass direction | v0.4.0    | YAML only | Entity to show the `more-info` of. When empty the compass direction `more-info` is shown                                                                                                            |
| navigation_path | string              | **Required** for action `navigate`           |                                     | v0.4.0    | YAML only | Path to navigate to, has to be on the same host as the card is. E.g. `/logbook`, `/config/dashboard` or `lovelace/default_view`                                                                     |
| url             | string              | **Required** for action `url`                |                                     | v0.4.0    | YAML only | Url to navigate to, can be any valid webpage                                                                                                                                                        |
| new_tab         | boolean             | **Optional** for action `url` and `navigate` | `true`                              | v0.4.1    | YAML only | Open url or navigate in new tab/window                                                                                                                                                              |
| service         | string              | **Required** for action `call-service`       |                                     | v0.4.0    | YAML only | Home Assistant service to call, see `Developer Tools -> Services` what services are available, e.g. `light.turn_on`                                                                                 |
| service_data    | string, json format | **Optional** for action `call-service`       |                                     | v0.4.0    | YAML only | Service data to send, see `Developer Tools -> Services` what data specific services need.<br/>Needs to be a string in json format e.g. `{"entity_id": "light.kitchen", "rgb_color": [255,100,100]}` |

#### Action config examples

##### More Info

Open the more info of a person entity when clicking/touching the card

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
tap_action:
  entity: person.friend
```

##### Navigate

Open the Home Assistant map page when clicking/touching the card

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
tap_action:
  action: navigate
  navigation_path: /map
```

##### Url

Open Google Maps when clicking/touching the card

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
tap_action:
  action: url
  url: https://www.google.nl/maps
```

##### Call Service

Send notification when clicking/touching the card

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
tap_action:
  action: call-service
  service: notify.notify
  service_data: '{"message": "Hey Im watching you.", "title": "Message from your best friend"}'
```

### Language

The following languages are supported:

| Language  | Yaml value | Supported | Translated by                                                |
| --------- | ---------- | --------- | ------------------------------------------------------------ |
| Czech     | `cz`       | v0.4.0    | [@woodcat64](https://github.com/Woodcat64)                   |
| Dutch     | `nl`       | v0.3.0    | [@tomvanswam](https://github.com/tomvanswam)                 |
| English   | `en`       | v0.3.0    | [@tomvanswam](https://github.com/tomvanswam)                 |
| French    | `fr`       | v0.3.1    | [@andilge](https://github.com/andilge)                       |
| German    | `de`       | v0.3.0    | [@rainer-geiger](https://github.com/rainer-geiger)           |
| Italian   | `it`       | v0.3.0    | [@matteofranceschini](https://github.com/matteofranceschini) |
| Norwegian | `no`       | v0.3.1    | [@hwikene](https://github.com/hwikene)                       |
| Portugese | `pt`       | v0.3.1    | [@andilge](https://github.com/andilge)                       |
| Polish    | `pl`       | v0.3.2    | [@porebas](https://github.com/porebas)                       |
| Russian   | `ru`       | v0.4.0    | [@artemyevav](https://github.com/artemyevav)                 |
| Spanish   | `es`       | v0.3.1    | [@andilge](https://github.com/andilge)                       |

Pick the language in the visual editor, or add it to yaml config.

Example for Portugese abbreviations (regardless of Home Assistant language setting):

```yaml
type: custom:compass-card
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
compass:
  language: pt
```

## Wish/Todo list

- Additional entities to show on circle
- Background image ([#12](https://github.com/tomvanswam/compass-card/issues/12))
- Hide indicator in certain directions (to use the card to display the sun or moon's movement) ([#12](https://github.com/tomvanswam/compass-card/issues/12))
- Css options to change look & feel ([#12](https://github.com/tomvanswam/compass-card/issues/12)/[#14](https://github.com/tomvanswam/compass-card/issues/14))

## Contact

You can find me on the [Home Assistant Community Site](https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909)<br />
And occasionally on the [HACS](https://discord.gg/apgchf8) and [Home Assistant](https://www.home-assistant.io/join-chat) Discord

## Thanks to

- [@rsnodgrass](https://github.com/rsnodgrass) for [wind-compass-card](https://github.com/rsnodgrass/wind-compass-card), which gave me the idea to make this
- [@iantrich](https://www.github.com/iantrich) for the [boiler-plate card](https://github.com/custom-cards/boilerplate-card), which got me started
- [@xixao](https://codepen.io/xixao/) for [wind speed/direction css](https://codepen.io/xixao/pen/OPovyN)
- [All the translators](#language)

## Support

Help me out for a couple of :beers:, a :coffee: or legos!<br />
Or clone, and create and a PR to help make the card even better.

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/tomvanswam)

[releases-shield]: https://img.shields.io/github/release/tomvanswam/compass-card.svg?style=flat-square
[releases-link]: https://github.com/tomvanswam/compass-card/releases/latest
[release-date-shield]: https://img.shields.io/github/release-date/tomvanswam/compass-card?style=flat-square
[latest-download-shield]: https://img.shields.io/github/downloads/tomvanswam/compass-card/latest/total?style=flat-square&label=downloads%20latest%20release
[total-download-shield]: https://img.shields.io/github/downloads/tomvanswam/compass-card/total?style=flat-square&label=total%20views
[traffic-link]: https://github.com/tomvanswam/compass-card/graphs/traffic
[hacs-shield]: https://img.shields.io/badge/HACS-Default-orange.svg?style=flat-square
[hacs-link]: https://github.com/custom-components/hacs
[home-assistant-shield]: https://img.shields.io/badge/Home%20Assistant-visual%20editor/yaml-green?style=flat-square
[home-assistant-link]: https://www.home-assistant.io/
[license-shield]: https://img.shields.io/github/license/custom-cards/boilerplate-card.svg?style=flat-square
[license-link]: LICENSE.md
[activity-shield]: https://img.shields.io/github/commit-activity/y/tomvanswam/compass-card.svg?style=flat-square
[activity-link]: https://github.com/tomvanswam/compass-card/commits/master
[bugs-shield]: https://img.shields.io/github/issues/tomvanswam/compass-card/bug?color=red&style=flat-square&label=bugs
[bugs-link]: https://github.com/tomvanswam/compass-card/labels/bug
[enhancements-shield]: https://img.shields.io/github/issues/tomvanswam/compass-card/enhancement?color=blue&style=flat-square&label=enhancements
[enhancement-link]: https://github.com/tomvanswam/compass-card/labels/enhancement
[maintenance-shield]: https://img.shields.io/maintenance/yes/2020.svg?style=flat-square
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=flat-square
[forum-link]: https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909
[coffee-shield]: https://img.shields.io/badge/donate-buymeacoffe-sienna?style=flat-square
[coffee-link]: https://www.buymeacoffee.com/tomvanswam
