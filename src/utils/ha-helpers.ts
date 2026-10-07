/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HassEntities } from 'home-assistant-js-websocket';

export interface HomeAssistant {
    auth: any;
    connection: any;
    connected: boolean;
    states: HassEntities;
    services: any;
    config: any;
    themes: any;
    selectedTheme: string | null;
    panels: any;
    panelUrl: string;
    language: string;
    resources: any;
    localize: (key: string, ...args: any[]) => string;
    translationMetadata: any;
    dockedSidebar: boolean;
    vibrate: boolean;
    suspendWhenHidden: boolean;
    enableShortcuts: boolean;
    callService: (domain: string, service: string, serviceData?: any, target?: any) => Promise<any>;
    callApi: (method: string, path: string, parameters?: any) => Promise<any>;
    fetchWithAuth: (path: string, init?: any) => Promise<any>;
    sendWS: (msg: any) => Promise<any>;
    callWS: (msg: any) => Promise<any>;
}

export interface LovelaceCardConfig {
    index?: number;
    view_index?: number;
    type: string;
    [key: string]: any;
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

export const fireEvent = (
    node: HTMLElement,
    type: string,
    detail?: any,
    options?: any
) => {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
        bubbles: options.bubbles === undefined ? true : options.bubbles,
        cancelable: Boolean(options.cancelable),
        composed: options.composed === undefined ? true : options.composed,
    });
    (event as any).detail = detail;
    node.dispatchEvent(event);
    return event;
};
