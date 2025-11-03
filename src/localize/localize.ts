import * as bg from './languages/bg.json';
import * as ca from './languages/ca.json';
import * as cz from './languages/cz.json';
import * as da from './languages/da.json';
import * as de from './languages/de.json';
import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as hu from './languages/hu.json';
import * as is from './languages/is.json';
import * as it from './languages/it.json';
import * as nl from './languages/nl.json';
import * as no from './languages/no.json';
import * as pl from './languages/pl.json';
import * as pt from './languages/pt.json';
import * as sv from './languages/sv.json';
import * as sk from './languages/sk.json';
import * as sl from './languages/sl.json';
import * as tw from './languages/tw.json';
import * as ru from './languages/ru.json';
import * as uk from './languages/uk.json';

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
  sk: sk,
  sl: sl,
  tw: tw,
  ru: ru,
  uk: uk,
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
  } catch {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
