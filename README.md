# Compass card

A custom [Home Assistant](https://home-assistant.io/) dashboard card that displays an indicator in a circle.

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
indicator_sensors:
  - sensor: sensor.wind_dir
```

## Lovelace Examples

### Default

```yaml
type: custom:compass-card
header:
  title:
    value: Friend's location
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
```

[Issue #41](https://github.com/tomvanswam/compass-card/issues/41) shows an example how to calculate the distance/direction of your friend.

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-outward.png?raw=true)

### Compass indicator `arrow_inward`

```yaml
type: custom:compass-card
header:
  title:
    value: Wind
indicator_sensors:
  - sensor: sensor.wind_dir
    indicator:
      type: arrow_inward
value_sensors:
  - sensor: sensor.wind_speed
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-inward.png?raw=true)

### Compass indicator `circle`

```yaml
type: custom:compass-card
header:
  title:
    value: Sun
indicator_sensors:
  - sensor: sun.sun
    attribute: azimuth
    indicator:
      type: circle
value_sensors:
  - sensor: sun.sun
    attribute: elevation
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-circle.png?raw=true)

### Compass `north indicator` and `direction offset`

Left image yaml:

```yaml
type: custom:compass-card
header:
  title:
    value: Sun
indicator_sensors:
  - sensor: sun.sun
    attribute: azimuth
    indicator:
      type: circle
value_sensors:
  - sensor: sun.sun
    attribute: elevation
compass:
  north:
    show: true
```

Right image yaml:

```yaml
type: custom:compass-card
header:
  title:
    value: Sun
indicator_sensors:
  - sensor: sun.sun
    attribute: azimuth
    indicator:
      type: circle
value_sensors:
  - sensor: sun.sun
    attribute: elevation
compass:
  north:
    show: true
    offset: 15
```

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-north.png?raw=true)

### Compass `cardinal indicators` and `background`

```yaml
type: custom:compass-card
header:
  title:
    value: Sun
indicator_sensors:
  - sensor: sun.sun
    attribute: azimuth
    indicator:
      type: circle
value_sensors:
  - sensor: sun.sun
    attribute: elevation
compass:
  circle:
    background_image: /local/compass-card/home.png
    background_opacity: 0.5
  north:
    show: true
    offset: 30
  east:
    show: true
  west:
    show: true
  south:
    show: true
```

Store the background image in your `config/www/` folder (this maps to `/local/`)

![Default](https://github.com/tomvanswam/compass-card/blob/master/docs/images/compass-card-cardinals-background.png?raw=true)

## Options

| Name              | Type                                                           | Requirement  | Supported | Config                                                    | Description                                                                                                |
| ----------------- | -------------------------------------------------------------- | ------------ | --------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| type              | string                                                         | **Required** | v0.0.1    | N.a.                                                      |                                                                                                            |
| header            | [header object](#header-object)                                | **Optional** | v1.0.0    | See [header object](#header-object)                       | Card header settings                                                                                       |
| compass           | [compass object](#compass-object)                              | **Optional** | v1.0.0    | See [compass object](#compass-object)                     | Compass settings                                                                                           |
| indicator_sensors | Array of [indicator sensors object](#indicator-sensors-object) | **Required** | v1.0.0    | See [indicator sensors object](#indicator-sensors-object) | Entities to use as indicator on compass                                                                    |
| value_sensors     | Array of [value sensors object](#value-sensor-objects)         | **Optional** | v1.0.0    | See [value sensors object](#value-sensors-object)         | Entities to show under the direction in compass                                                            |
| language          | [language](#language)                                          | **Optional** | v1.0.0    | Visual/YAML                                               | Show the abbreviation in the language configured in Home Assistant (default/empty), or configured language |
| tap_action        | [action config object](#action-config-object)                  | **Optional** | v1.0.0    | See [action config object](#action-config-object)         | Tap action settings (what happens when you click/touch the card)                                           |
| debug             | boolean                                                        | **Optional** | v1.0.0    | YAML                                                      | Show inflated configration & incorrect configured entities and attributes in browsers developers console   |

### Header object

| Name  | Type                          | Requirement  | Supported | Config                            | Description                          |
| ----- | ----------------------------- | ------------ | --------- | --------------------------------- | ------------------------------------ |
| title | [title object](#title-object) | **Optional** | v1.0.0    | See [title object](#title-object) | Settings for the title in the header |
| icon  | [icon object](#icon-object)   | **Optional** | v1.0.0    | See [icon object](#icon-object)   | Settings for the icon in the header  |

### Title object

| Name          | Type                                          | Requirement  | Supported    | Config | Description                      |
| ------------- | --------------------------------------------- | ------------ | ------------ | ------ | -------------------------------- |
| value         | string                                        | **Optional** | v1.0.0       | YAML   | Title to show in the card header |
| color         | string                                        | **Optional** | v1.0.0       | YAML   | Color of object                  |
| show          | boolean                                       | **Optional** | v1.0.0       | YAML   | Show object                      |
| dynamic_style | [dynamic style object](#dynamic-style-object) | **Optional** | v1.0.0 (WIP) | YAML   | Change style on entity values    |

### Icon object

| Name          | Type                                          | Requirement  | Supported    | Config | Description                   |
| ------------- | --------------------------------------------- | ------------ | ------------ | ------ | ----------------------------- |
| value         | string                                        | **Optional** | v1.0.0       | YAML   | Icon show in the card header  |
| color         | string                                        | **Optional** | v1.0.0       | YAML   | Color of object               |
| show          | boolean                                       | **Optional** | v1.0.0       | YAML   | Show object                   |
| dynamic_style | [dynamic style object](#dynamic-style-object) | **Optional** | v1.0.0 (WIP) | YAML   | Change style on entity values |

### Compass object

| Name   | Type                                    | Requirement  | Supported | Config                              | Description                                       |
| ------ | --------------------------------------- | ------------ | --------- | ----------------------------------- | ------------------------------------------------- |
| north  | [north object](#north-object)           | **Optional** | v1.0.0    | See [north object](#north-object)   | Settings for the north indicator (default hidden) |
| east   | [properties object](#properties-object) | **Optional** | v1.2.0    | YAML                                | Settings for the east indicator (default hidden)  |
| south  | [properties object](#properties-object) | **Optional** | v1.2.0    | YAML                                | Settings for the south indicator (default hidden) |
| west   | [properties object](#properties-object) | **Optional** | v1.2.0    | YAML                                | Settings for the west indicator (default hidden)  |
| circle | [circle object](#circle-object)         | **Optional** | v1.0.0    | See [circle object](#circle-object) | Settings for the compass circle                   |

### North object

| Name          | Type                                          | Requirement  | Supported    | Config | Description                                                                        |
| ------------- | --------------------------------------------- | ------------ | ------------ | ------ | ---------------------------------------------------------------------------------- |
| offset        | string                                        | **Optional** | v1.0.0       | YAML   | Value to offset the indicator display with.<br />(E.g. to create a relative north) |
| color         | string                                        | **Optional** | v1.0.0       | YAML   | Color of object                                                                    |
| show          | boolean                                       | **Optional** | v1.0.0       | YAML   | Show object                                                                        |
| dynamic_style | [dynamic style object](#dynamic-style-object) | **Optional** | v1.0.0 (WIP) | YAML   | Change style on entity values                                                      |

### Circle object

| Name               | Type                                                    | Requirement  | Supported | Config | Description                                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------- | ------------ | --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| background_image   | string                                                  | **Optional** | v1.2.0    | YAML   | URL of image to show in the background of the circle (use square image of preferably 126px by 126px). See [Home Assistant documentation](https://www.home-assistant.io/integrations/http#hosting-files) for info about hosting files. |
| background_opacity | number                                                  | **Optional** | v1.2.0    | YAML   | Opacity of the background image 1 = 100% visible, 0.5 = 50% half visible, 0 = fully hidden, anything between 0 and 1 will do.                                                                                                         |
| offset_background  | boolean                                                 | **Optional** | v1.2.0    | YAML   | If `true` then image rotates with north offset (default), if `false` then image does not rotate with north offset                                                                                                                     |
| color              | string                                                  | **Optional** | v1.0.0    | YAML   | Color of object                                                                                                                                                                                                                       |
| show               | boolean                                                 | **Optional** | v1.0.0    | YAML   | Show object                                                                                                                                                                                                                           |
| dynamic_style      | Array of [dynamic style objects](#dynamic-style-object) | **Optional** | v1.0.0    | YAML   | Change style on entity values                                                                                                                                                                                                         |

### Indicator Sensors object

| Name               | Type                                    | Requirement  | Supported | Config                                    | Description                                                                                                   |
| ------------------ | --------------------------------------- | ------------ | --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| sensor             | string                                  | **Required** | v1.0.0    | First visual, others YAML                 | Entity to read state from                                                                                     |
| attribute          | string                                  | **Optional** | v1.0.0    | YAML                                      | Attribute of sensor to read value from instead of entity state                                                |
| units              | string                                  | **Optional** | v1.0.0    | YAML                                      | Units of measurement to display, default for entity, units of measurement of entity, default for attribute '' |
| decimals           | number                                  | **Optional** | v1.0.0    | YAML                                      | Decimals to show the value in, default 0                                                                      |
| indicator          | [indicator object](#indicator-object)   | **Optional** | v1.0.0    | See [indicator object](#indicator-object) | Settings for displaying the state as indicator                                                                |
| state_abbreviation | [properties object](#properties-object) | **Optional** | v1.0.0    | YAML                                      | Settings for displaying the state abbreviation                                                                |
| state_value        | [properties object](#properties-object) | **Optional** | v1.0.0    | YAML                                      | Settings for displaying the state value                                                                       |
| state_units        | [properties object](#properties-object) | **Optional** | v1.0.0    | YAML                                      | Settings for displaying the state units                                                                       |

### Value Sensors object

| Name        | Type                                    | Requirement  | Supported | Config                    | Description                                                                                                   |
| ----------- | --------------------------------------- | ------------ | --------- | ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| sensor      | string                                  | **Required** | v1.0.0    | First visual, others YAML | Entity to read state from                                                                                     |
| attribute   | string                                  | **Optional** | v1.0.0    | YAML                      | Attribute of sensor to read value from instead of entity state                                                |
| units       | string                                  | **Optional** | v1.0.0    | YAML                      | Units of measurement to display, default for entity, units of measurement of entity, default for attribute '' |
| decimals    | number                                  | **Optional** | v1.0.0    | YAML                      | Decimals to show the value in, default 0                                                                      |
| state_value | [properties object](#properties-object) | **Optional** | v1.0.0    | YAML                      | Settings for displaying the state value                                                                       |
| state_units | [properties object](#properties-object) | **Optional** | v1.0.0    | YAML                      | Settings for displaying the state units                                                                       |

### Indicator object

| Name | Type   | Requirement  | Supported | Config                    | Description                                                                            |
| ---- | ------ | ------------ | --------- | ------------------------- | -------------------------------------------------------------------------------------- |
| type | string | **Optional** | v1.0.0    | First visual, others YAML | One of `arrow_outward` (default), `arrow_inward`, `circle`, the shape of the indicator |

### Properties object

| Name          | Type                                                    | Requirement  | Supported | Config | Description                   |
| ------------- | ------------------------------------------------------- | ------------ | --------- | ------ | ----------------------------- |
| color         | string                                                  | **Optional** | v1.0.0    | YAML   | Color of object               |
| show          | boolean                                                 | **Optional** | v1.0.0    | YAML   | Show object                   |
| dynamic_style | Array of [dynamic style objects](#dynamic-style-object) | **Optional** | v1.0.0    | YAML   | Change style on entity values |

### Dynamic Style object

| Name      | Type                                              | Requirement  | Supported | Config | Description                                                                                                                                               |
| --------- | ------------------------------------------------- | ------------ | --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sensor    | string                                            | **Optional** | v1.0.0    | YAML   | Entity to listen to read value from style                                                                                                                 |
| attribute | string                                            | **Optional** | v1.0.0    | YAML   | Attribute of sensor to read value from to change style                                                                                                    |
| bands     | Array of [style band objects](#style-band-object) | **Required** | v1.0.0    | YAML   | Styles to use from a certain value (values below the lowest configured value will display as the parent [properties object](#properties-object) settings) |

### Style band object

| Name       | Type    | Requirement  | Supported | Config | Description                                                                            |
| ---------- | ------- | ------------ | --------- | ------ | -------------------------------------------------------------------------------------- |
| from_value | string  | **Required** | v1.0.0    | YAML   | Value from which upward this bands settings are used to display the parent object with |
| color      | string  | **Optional** | v1.0.0    | YAML   | Color of object                                                                        |
| show       | boolean | **Optional** | v1.0.0    | YAML   | Show object                                                                            |

#### Dynamic Style & Style band example

For a card that

- Displays indicator for the suns azimuth
- Changes color of the icon, compass and north indicator depending on the current UV Index
- Hide sun indicator when elevation is below horizon

Use the following configuration

```yaml
type: 'custom:compass-card'
header:
  title:
    value: Sun
  icon:
    color: green # default color (for state is less than the lowest dynamic_style.bands.from_value)
    dynamic_style:
      sensor: sensor.uvi
      bands:
        - from_value: 3
          color: yellow
        - from_value: 6
          color: orange
        - from_value: 8
          color: red
        - from_value: 11
          color: purple
indicator_sensors:
  - sensor: sun.sun
    attribute: azimuth
    indicator:
      type: circle
      color: orange
      show: false # default visibility (for state is less than the lowest dynamic_style.bands.from_value)
      dynamic_style:
        sensor: sun.sun
        attribute: elevation
        bands:
          - from_value: 0
            show: true
value_sensors:
  - sensor: sun.sun
    attribute: elevation
    decimals: 1
compass:
  north:
    show: true
    color: green # default color (for state is less than the lowest dynamic_style.bands.from_value)
    dynamic_style:
      sensor: sensor.uvi
      bands:
        - from_value: 3
          color: yellow
        - from_value: 6
          color: orange
        - from_value: 8
          color: red
        - from_value: 11
          color: purple
  circle:
    color: green # default color (for state is less than the lowest dynamic_style.bands.from_value)
    dynamic_style:
      sensor: sensor.uvi
      bands:
        - from_value: 3
          color: yellow
        - from_value: 6
          color: orange
        - from_value: 8
          color: red
        - from_value: 11
          color: purple
```

### Action Config object

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
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
tap_action:
  entity: person.friend
```

##### Navigate

Open the Home Assistant map page when clicking/touching the card

```yaml
type: custom:compass-card
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
tap_action:
  action: navigate
  navigation_path: /map
```

##### Url

Open Google Maps when clicking/touching the card

```yaml
type: custom:compass-card
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
tap_action:
  action: url
  url: https://www.google.nl/maps
```

##### Call Service

Send notification when clicking/touching the card

```yaml
type: custom:compass-card
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
tap_action:
  action: call-service
  service: notify.notify
  service_data: '{"message": "Hey Im watching you.", "title": "Message from your best friend"}'
```

### Language

The following languages are supported:

| Language    | Yaml value | Supported  | Translated by                                                                           |
| ----------- | ---------- | ---------- | --------------------------------------------------------------------------------------- |
| Bulgarian   | `bg`       | v1.4.0     | [@Saentist](https://github.com/Saentist)                                                |
| Catalan     | `ca`       | v1.6.0     | [@joan-mb](https://github.com/joan-mb)                                                  |
| Czech       | `cz`       | v0.4.0     | [@woodcat64](https://github.com/Woodcat64)                                              |
| Danish      | `da`       | v1.3.0     | [@DurgNomis-drol](https://github.com/DurgNomis-drol)                                    |
| Dutch       | `nl`       | v0.3.0     | [@tomvanswam](https://github.com/tomvanswam)                                            |
| English     | `en`       | v0.3.0     | [@tomvanswam](https://github.com/tomvanswam)                                            |
| French      | `fr`       | v0.3.1     | [@andilge](https://github.com/andilge)                                                  |
| German      | `de`       | v0.3.0     | [@rainer-geiger](https://github.com/rainer-geiger)                                      |
| Hungarian   | `hu`       | v1.0.0     | [@bboti86](https://github.com/bboti86)                                                  |
| Icelandic   | `is`       | v1.5.0     | [@halliiav](https://github.com/halliiav)                                                |
| Italian     | `it`       | v0.3.0     | [@matteofranceschini](https://github.com/matteofranceschini)                            |
| Norwegian   | `no`       | v0.3.1     | [@hwikene](https://github.com/hwikene)                                                  |
| Portugese   | `pt`       | v0.3.1     | [@andilge](https://github.com/andilge)                                                  |
| Polish      | `pl`       | v0.3.2     | [@porebas](https://github.com/porebas)                                                  |
| Slovenian   | `sl`       | v1.2.0     | [@thehijacker](https://github.com/thehijacker)                                          |
| Russian     | `ru`       | v0.4.0     | [@artemyevav](https://github.com/artemyevav)                                            |
| Slovak      | `sk`       | v2.0.2     | [@misa1515 ](https://github.com/misa1515)                                               |
| Spanish     | `es`       | v0.3.1     | [@andilge](https://github.com/andilge)                                                  |
| ~~Swedish~~ | ~~`se`~~   | ~~v1.5.0~~ | ~~[@Boris65](https://github.com/Boris65) and [@nickrout](https://github.com/nickrout)~~ |
| Swedish     | `sv`       | v2.0.0     | [@Boris65](https://github.com/Boris65) and [@nickrout](https://github.com/nickrout)     |

Pick the language in the visual editor, or add it to yaml config.

Example for Portugese abbreviations (regardless of Home Assistant language setting):

```yaml
type: custom:compass-card
indicator_sensors:
  - sensor: sensor.friends_direction
value_sensors:
  - sensor: sensor.friends_distance
compass:
  language: pt
```

### More YAML examples

See the [issues with the `config how-to` label](https://github.com/tomvanswam/compass-card/issues?q=label%3A%22config+how-to%22) for more configuration examples.

## Upgrade from version v0.x.x to v1.0.0 +

v1.0.0 has breaking changes, meaning the card wil not work as expected after updating.

### Semi-automatic update procedure

To upgrade your v0.x.x card, just open the card in the editor, and save it.
No changes needed to the card.
The configuration will update to the correct version, and your card is v1.0.0 ready.

If the compass-card is inside another card (horizontal/vertical-stack), use the visual editor menu to navigate to the compass-card. It will update to the new config.

### Manual update procedure

See following YAML examples of a full v0.x.x config and its v1.0.0 equivalent
_Note: the tap_action object does not change and you can keep the v0.x.x version._

v0.x.x

```yaml
type: custom:compass-card
name: title
entity: sensor.friends_direction
secondary_entity: sensor.friends_distance
direction_offset: 15
compass:
  language: pt
  indicator: arrow_outward
  show_north: true
```

v1.0.0 +

```yaml
type: custom:compass-card
header:
  title:
    value: title
indicator_sensors:
  - sensor: sensor.friends_direction
    indicator:
      type: arrow_outward
value_sensors:
  - sensor: sensor.friends_distance
compass:
  north:
    show: true
    offset: 15
language: pt
```

## Wish/Todo list

- Background image ([#12](https://github.com/tomvanswam/compass-card/issues/12))
- Resizing compass on smaller cards ([#44](https://github.com/tomvanswam/compass-card/issues/44))

## Contact

You can find me on the [Home Assistant Community Site](https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909)<br />
And occasionally on the [HACS](https://discord.gg/apgchf8) and [Home Assistant](https://www.home-assistant.io/join-chat) Discord

## Thanks to

- [@rsnodgrass](https://github.com/rsnodgrass) for the idea to make this
- [@iantrich](https://www.github.com/iantrich) for the [boiler-plate card](https://github.com/custom-cards/boilerplate-card), which got me started
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
[hacs-link]: https://github.com/hacs/integration
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
[maintenance-shield]: https://img.shields.io/maintenance/yes/2025.svg?style=flat-square
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=flat-square
[forum-link]: https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909
[coffee-shield]: https://img.shields.io/badge/donate-buymeacoffe-sienna?style=flat-square
[coffee-link]: https://www.buymeacoffee.com/tomvanswam
