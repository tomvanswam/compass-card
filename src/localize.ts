import { HomeAssistant } from "./ha";

import * as bg from "./translations/bg.json";
import * as ca from "./translations/ca.json";
import * as cz from "./translations/cz.json";
import * as da from "./translations/da.json";
import * as de from "./translations/de.json";
import * as en from "./translations/en.json";
import * as es from "./translations/es.json";
import * as fr from "./translations/fr.json";
import * as hu from "./translations/hu.json";
import * as is from "./translations/is.json";
import * as it from "./translations/it.json";
import * as nl from "./translations/nl.json";
import * as no from "./translations/no.json";
import * as pl from "./translations/pl.json";
import * as pt from "./translations/pt.json";
import * as sv from "./translations/sv.json";
import * as sl from "./translations/sl.json";
import * as ru from "./translations/ru.json";

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
export const COMPASS_LANGUAGES = [...Object.keys(languages), ""].sort();

const DEFAULT_LANG = "en";

function getTranslatedString(key: string, lang: string): string | undefined {
  try {
    return key
      .split(".")
      .reduce(
        (o, i) => (o as Record<string, unknown>)[i],
        languages[lang]
      ) as string;
  } catch (_) {
    return undefined;
  }
}

export default function setupCustomlocalize(hass?: HomeAssistant) {
  return function (key: string) {
    const lang = hass?.locale.language ?? DEFAULT_LANG;

    let translated = getTranslatedString(key, lang);
    if (!translated) translated = getTranslatedString(key, DEFAULT_LANG);
    return translated ?? key;
  };
}
