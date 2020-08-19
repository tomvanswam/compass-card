import * as de from './languages/de.json';
import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as it from './languages/it.json';
import * as nl from './languages/nl.json';
import * as no from './languages/no.json';
import * as pl from './languages/pl.json';
import * as pt from './languages/pt.json';

export const languages: any = {
  de: de,
  en: en,
  es: es,
  fr: fr,
  it: it,
  nl: nl,
  no: no,
  pl: pl,
  pt: pt,
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
