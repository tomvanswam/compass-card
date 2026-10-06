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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const languages: any = {
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

export function getLocalLanguage(): string {
  if (typeof localStorage !== 'undefined') {
    return (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
  }
  return 'en'; // fallback for non-browser environments
}

function lookup(string: string, language: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = string.split('.').reduce((o: any, i) => o?.[i], languages[language]);
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
