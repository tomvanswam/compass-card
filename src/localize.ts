import * as bg from './translations/bg.json';
import * as ca from './translations/ca.json';
import * as cz from './translations/cz.json';
import * as da from './translations/da.json';
import * as de from './translations/de.json';
import * as en from './translations/en.json';
import * as es from './translations/es.json';
import * as fr from './translations/fr.json';
import * as hu from './translations/hu.json';
import * as is from './translations/is.json';
import * as it from './translations/it.json';
import * as nl from './translations/nl.json';
import * as no from './translations/no.json';
import * as pl from './translations/pl.json';
import * as pt from './translations/pt.json';
import * as sv from './translations/sv.json';
import * as sl from './translations/sl.json';
import * as ru from './translations/ru.json';

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
  sv: sv,
  sl: sl,
  ru: ru,
};
export const COMPASS_LANGUAGES = [...Object.keys(languages), ''].sort();

export function getLocalLanguage(): string {
  return (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
}

export function localize(string: string, search = '', replace = '', language = ''): string {
  let translated: string;
  if (language === '') {
    language = getLocalLanguage();
  }
  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[language]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
