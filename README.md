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
1. Force refresh the Home Assistant page (<kbd>Ctrl</kbd> + <kbd>R</kbd>)
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
- Or add the card manually and [configure it with YAML](https://github.com/tomvanswam/compass-card/wiki/YAML-configuration):

## Wish/Todo list

- See [open enhancements](https://github.com/tomvanswam/compass-card/issues?q=state%3Aopen%20label%3Aenhancement)

## Contact

You can find me on the [Home Assistant Community Site](https://community.home-assistant.io/t/compass-card-points-you-in-the-right-direction/217909)<br />
And occasionally on the [HACS](https://discord.gg/apgchf8) and [Home Assistant](https://www.home-assistant.io/join-chat) Discord

## Thanks to

- [@rsnodgrass](https://github.com/rsnodgrass) for the idea to make this
- [@iantrich](https://www.github.com/iantrich) for the [boiler-plate card](https://github.com/custom-cards/boilerplate-card), which got me started
- [@vingerha]https://github.com/vingerha for creating the dynamic background image, mdi icon support and much more
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
