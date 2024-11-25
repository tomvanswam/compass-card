import { css } from "lit";

export const themeVariables = css`
  --spacing: var(--cc-spacing, 10px);

  /* Title */
  --title-padding: var(--cc-title-padding, 24px 12px 8px);
  --title-spacing: var(--cc-title-spacing, 8px);
  --title-font-size: var(--cc-title-font-size, 24px);
  --title-font-weight: var(--cc-title-font-weight, normal);
  --title-line-height: var(--cc-title-line-height, 32px);
  --title-color: var(--cc-title-color, var(--primary-text-color));
  --title-letter-spacing: var(--cc-title-letter-spacing, -0.288px);
  --subtitle-font-size: var(--cc-subtitle-font-size, 16px);
  --subtitle-font-weight: var(--cc-subtitle-font-weight, normal);
  --subtitle-line-height: var(--cc-subtitle-line-height, 24px);
  --subtitle-color: var(--cc-subtitle-color, var(--secondary-text-color));
  --subtitle-letter-spacing: var(--cc-subtitle-letter-spacing, 0px);

  /* Card */
  --card-primary-font-size: var(--cc-card-primary-font-size, 14px);
  --card-secondary-font-size: var(--cc-card-secondary-font-size, 12px);
  --card-primary-font-weight: var(--cc-card-primary-font-weight, 500);
  --card-secondary-font-weight: var(--cc-card-secondary-font-weight, 400);
  --card-primary-line-height: var(--cc-card-primary-line-height, 20px);
  --card-secondary-line-height: var(--cc-card-secondary-line-height, 16px);
  --card-primary-color: var(--cc-card-primary-color, var(--primary-text-color));
  --card-secondary-color: var(
    --cc-card-secondary-color,
    var(--primary-text-color)
  );
  --card-primary-letter-spacing: var(--cc-card-primary-letter-spacing, 0.1px);
  --card-secondary-letter-spacing: var(
    --cc-card-secondary-letter-spacing,
    0.4px
  );

  /* Chips */
  --chip-spacing: var(--cc-chip-spacing, 8px);
  --chip-padding: var(--cc-chip-padding, 0 0.25em);
  --chip-height: var(--cc-chip-height, 36px);
  --chip-border-radius: var(--cc-chip-border-radius, 19px);
  --chip-border-width: var(
    --cc-chip-border-width,
    var(--ha-card-border-width, 1px)
  );
  --chip-border-color: var(
    --cc-chip-border-color,
    var(--ha-card-border-color, var(--divider-color))
  );
  --chip-box-shadow: var(
    --cc-chip-box-shadow,
    var(--ha-card-box-shadow, "none")
  );
  --chip-font-size: var(--cc-chip-font-size, 0.3em);
  --chip-font-weight: var(--cc-chip-font-weight, bold);
  --chip-icon-size: var(--cc-chip-icon-size, 0.5em);
  --chip-avatar-padding: var(--cc-chip-avatar-padding, 0.1em);
  --chip-avatar-border-radius: var(--cc-chip-avatar-border-radius, 50%);
  --chip-background: var(
    --cc-chip-background,
    var(--ha-card-background, var(--card-background-color, white))
  );
  /* Controls */
  --control-border-radius: var(--cc-control-border-radius, 12px);
  --control-height: var(--cc-control-height, 42px);
  --control-button-ratio: var(--cc-control-button-ratio, 1);
  --control-icon-size: var(--cc-control-icon-size, 0.5em);
  --control-spacing: var(--cc-control-spacing, 12px);

  /* Slider */
  --slider-threshold: var(--cc-slider-threshold);

  /* Input Number */
  --input-number-debounce: var(--cc-input-number-debounce);

  /* Layout */
  --layout-align: var(--cc-layout-align, center);

  /* Badge */
  --badge-size: var(--cc-badge-size, 16px);
  --badge-icon-size: var(--cc-badge-icon-size, 0.75em);
  --badge-border-radius: var(--cc-badge-border-radius, 50%);

  /* Icon */
  --icon-border-radius: var(--cc-icon-border-radius, 50%);
  --icon-size: var(--cc-icon-size, 36px);
  --icon-symbol-size: var(--cc-icon-symbol-size, 0.6em);
`;

export const themeColorCss = css`
  /* RGB */
  /* Standard colors */
  --rgb-red: var(--cc-rgb-red, var(--default-red));
  --rgb-pink: var(--cc-rgb-pink, var(--default-pink));
  --rgb-purple: var(--cc-rgb-purple, var(--default-purple));
  --rgb-deep-purple: var(--cc-rgb-deep-purple, var(--default-deep-purple));
  --rgb-indigo: var(--cc-rgb-indigo, var(--default-indigo));
  --rgb-blue: var(--cc-rgb-blue, var(--default-blue));
  --rgb-light-blue: var(--cc-rgb-light-blue, var(--default-light-blue));
  --rgb-cyan: var(--cc-rgb-cyan, var(--default-cyan));
  --rgb-teal: var(--cc-rgb-teal, var(--default-teal));
  --rgb-green: var(--cc-rgb-green, var(--default-green));
  --rgb-light-green: var(--cc-rgb-light-green, var(--default-light-green));
  --rgb-lime: var(--cc-rgb-lime, var(--default-lime));
  --rgb-yellow: var(--cc-rgb-yellow, var(--default-yellow));
  --rgb-amber: var(--cc-rgb-amber, var(--default-amber));
  --rgb-orange: var(--cc-rgb-orange, var(--default-orange));
  --rgb-deep-orange: var(--cc-rgb-deep-orange, var(--default-deep-orange));
  --rgb-brown: var(--cc-rgb-brown, var(--default-brown));
  --rgb-light-grey: var(--cc-rgb-light-grey, var(--default-light-grey));
  --rgb-grey: var(--cc-rgb-grey, var(--default-grey));
  --rgb-dark-grey: var(--cc-rgb-dark-grey, var(--default-dark-grey));
  --rgb-blue-grey: var(--cc-rgb-blue-grey, var(--default-blue-grey));
  --rgb-black: var(--cc-rgb-black, var(--default-black));
  --rgb-white: var(--cc-rgb-white, var(--default-white));
  --rgb-disabled: var(--cc-rgb-disabled, var(--default-disabled));

  /* Action colors */
  --rgb-info: var(--cc-rgb-info, var(--rgb-blue));
  --rgb-success: var(--cc-rgb-success, var(--rgb-green));
  --rgb-warning: var(--cc-rgb-warning, var(--rgb-orange));
  --rgb-danger: var(--cc-rgb-danger, var(--rgb-red));

  /* State colors */
  --rgb-state-vacuum: var(--cc-rgb-state-vacuum, var(--rgb-teal));
  --rgb-state-fan: var(--cc-rgb-state-fan, var(--rgb-green));
  --rgb-state-light: var(--cc-rgb-state-light, var(--rgb-orange));
  --rgb-state-entity: var(--cc-rgb-state-entity, var(--rgb-blue));
  --rgb-state-media-player: var(--cc-rgb-state-media-player, var(--rgb-indigo));
  --rgb-state-lock: var(--cc-rgb-state-lock, var(--rgb-blue));
  --rgb-state-number: var(--cc-rgb-state-number, var(--rgb-blue));
  --rgb-state-humidifier: var(--cc-rgb-state-humidifier, var(--rgb-purple));

  /* State alarm colors */
  --rgb-state-alarm-disarmed: var(
    --cc-rgb-state-alarm-disarmed,
    var(--rgb-info)
  );
  --rgb-state-alarm-armed: var(--cc-rgb-state-alarm-armed, var(--rgb-success));
  --rgb-state-alarm-triggered: var(
    --cc-rgb-state-alarm-triggered,
    var(--rgb-danger)
  );

  /* State person colors */
  --rgb-state-person-home: var(--cc-rgb-state-person-home, var(--rgb-success));
  --rgb-state-person-not-home: var(
    --cc-rgb-state-person-not-home,
    var(--rgb-danger)
  );
  --rgb-state-person-zone: var(--cc-rgb-state-person-zone, var(--rgb-info));
  --rgb-state-person-unknown: var(
    --cc-rgb-state-person-unknown,
    var(--rgb-grey)
  );

  /* State update colors */
  --rgb-state-update-on: var(--cc-rgb-state-update-on, var(--rgb-orange));
  --rgb-state-update-off: var(--cc-rgb-update-off, var(--rgb-green));
  --rgb-state-update-installing: var(
    --cc-rgb-update-installing,
    var(--rgb-blue)
  );

  /* State lock colors */
  --rgb-state-lock-locked: var(--cc-rgb-state-lock-locked, var(--rgb-green));
  --rgb-state-lock-unlocked: var(--cc-rgb-state-lock-unlocked, var(--rgb-red));
  --rgb-state-lock-pending: var(--cc-rgb-state-lock-pending, var(--rgb-orange));

  /* State cover colors */
  --rgb-state-cover-open: var(--cc-rgb-state-cover-open, var(--rgb-blue));
  --rgb-state-cover-closed: var(
    --cc-rgb-state-cover-closed,
    var(--rgb-disabled)
  );

  /* State climate colors */
  --rgb-state-climate-auto: var(--cc-rgb-state-climate-auto, var(--rgb-green));
  --rgb-state-climate-cool: var(--cc-rgb-state-climate-cool, var(--rgb-blue));
  --rgb-state-climate-dry: var(--cc-rgb-state-climate-dry, var(--rgb-orange));
  --rgb-state-climate-fan-only: var(
    --cc-rgb-state-climate-fan-only,
    var(--rgb-teal)
  );
  --rgb-state-climate-heat: var(
    --cc-rgb-state-climate-heat,
    var(--rgb-deep-orange)
  );
  --rgb-state-climate-heat-cool: var(
    --cc-rgb-state-climate-heat-cool,
    var(--rgb-green)
  );
  --rgb-state-climate-idle: var(
    --cc-rgb-state-climate-idle,
    var(--rgb-disabled)
  );
  --rgb-state-climate-off: var(--cc-rgb-state-climate-off, var(--rgb-disabled));
`;
