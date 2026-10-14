 
/* eslint-disable no-unused-vars */
import { HassEntities } from 'home-assistant-js-websocket';

export interface HomeAssistant {
    auth: unknown;
    connection: unknown;
    connected: boolean;
    states: HassEntities;
    services: unknown;
    config: unknown;
    themes: unknown;
    selectedTheme: string | null;
    panels: unknown;
    panelUrl: string;
    language: string;
    locale?: { language: string };
    resources: unknown;
    localize: (key: string, ...args: unknown[]) => string;
    translationMetadata: unknown;
    dockedSidebar: boolean;
    vibrate: boolean;
    suspendWhenHidden: boolean;
    enableShortcuts: boolean;
    callService: (domain: string, service: string, serviceData?: unknown, target?: unknown) => Promise<unknown>;
    callApi: (method: string, path: string, parameters?: unknown) => Promise<unknown>;
    fetchWithAuth: (path: string, init?: unknown) => Promise<unknown>;
    sendWS: (msg: unknown) => Promise<unknown>;
    callWS: (msg: unknown) => Promise<unknown>;
}

export interface LovelaceCardConfig {
    index?: number;
    view_index?: number;
    type: string;
    [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
    hass?: HomeAssistant;
    isPanel?: boolean;
    editMode?: boolean;
    getCardSize(): number | Promise<number>;
    setConfig(config: LovelaceCardConfig): void;
}

export interface LovelaceCardEditor extends HTMLElement {
    hass?: HomeAssistant;
    setConfig(config: LovelaceCardConfig): void;
}
