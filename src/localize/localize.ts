import * as bg from './languages/bg.json' with { type: 'json' };
import * as ca from './languages/ca.json' with { type: 'json' };
import * as cz from './languages/cz.json' with { type: 'json' };
import * as da from './languages/da.json' with { type: 'json' };
import * as de from './languages/de.json' with { type: 'json' };
import * as en from './languages/en.json' with { type: 'json' };
import * as es from './languages/es.json' with { type: 'json' };
import * as fr from './languages/fr.json' with { type: 'json' };
import * as hu from './languages/hu.json' with { type: 'json' };
import * as is from './languages/is.json' with { type: 'json' };
import * as it from './languages/it.json' with { type: 'json' };
import * as nl from './languages/nl.json' with { type: 'json' };
import * as no from './languages/no.json' with { type: 'json' };
import * as pl from './languages/pl.json' with { type: 'json' };
import * as pt from './languages/pt.json' with { type: 'json' };
import * as ru from './languages/ru.json' with { type: 'json' };
import * as sk from './languages/sk.json' with { type: 'json' };
import * as sl from './languages/sl.json' with { type: 'json' };
import * as sv from './languages/sv.json' with { type: 'json' };
import * as tw from './languages/tw.json' with { type: 'json' };
import * as uk from './languages/uk.json' with { type: 'json' };

// Translation tables per language (the json modules)
export const languages: Record<string, Record<string, unknown>> = {
  bg: bg,
  ca: ca,
  cz: cz,
  da: da,
  de: de,
  en: en,
  es: es,
  fr: fr,
  hu: hu,
  is: is,
  it: it,
  nl: nl,
  no: no,
  pl: pl,
  pt: pt,
  ru: ru,
  sk: sk,
  sl: sl,
  sv: sv,
  tw: tw,
  uk: uk,
};
export const COMPASS_LANGUAGES = [...Object.keys(languages), ''].sort();

// Home Assistant language codes that have a translation under another name
const LANGUAGE_ALIASES: Record<string, string> = { cs: 'cz', nb: 'no', nn: 'no', zh_hant: 'tw', zh_tw: 'tw' };

// The language of the Home Assistant user, set by the card and the editor from hass
let hassLanguage: string | undefined;

export function setHassLanguage(language: string | undefined): void {
  hassLanguage = language;
}

// Translation for a language code like 'nl', 'pt-BR' or 'zh-Hant', or undefined when there is none
export function resolveLanguage(code: string | null | undefined): string | undefined {
  if (!code) return undefined;
  const normalized = code.replace(/['"]+/g, '').replace('-', '_').toLowerCase();
  const [base] = normalized.split('_');
  return [normalized, LANGUAGE_ALIASES[normalized], base, LANGUAGE_ALIASES[base]].find((candidate) => candidate && languages[candidate]);
}

// Language of the Home Assistant user (hass.locale), then the browser's stored HA language, then English
export function getLocalLanguage(): string {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('selectedLanguage') : undefined;
  return resolveLanguage(hassLanguage) ?? resolveLanguage(stored) ?? 'en';
}

function lookup(string: string, language: string): string | undefined {
  const value = string.split('.').reduce<unknown>((o, i) => (o as Record<string, unknown> | undefined)?.[i], languages[language]);
  return typeof value === 'string' ? value : undefined;
}

export function localize(string: string, search = '', replace = '', language = ''): string {
  let translated: string;
  let translateTo: string;

  if (language === '') {
    translateTo = getLocalLanguage();
  } else {
    translateTo = language;
  }
  // Empty or missing translations (also for unknown languages or missing parent keys) fall back to English
  translated = lookup(string, translateTo) || lookup(string, 'en') || '';

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
