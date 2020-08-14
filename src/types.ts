import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CompassCardConfig extends LovelaceCardConfig {
  type: string;
  name: string;
  direction_offset: string;
  entity: string;
  secondary_entity?: string;
  compass?: CCCompass;
}


export interface CCCompass extends CCProperties {
  indicator?: string;
}
