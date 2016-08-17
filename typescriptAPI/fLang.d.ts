// Superpowers Game fLang plugin
// https://github.com/florentpoujol/superpowers-game-flang-plugin
// Easy localization of any in-game strings in the Superpowers Game system.

declare namespace fLang {
  interface Config {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    searchInDefaultLocale: boolean;
    replacementPattern: string;
    cache: boolean;
  }
 
  var config: Config;
  var emitter: EventEmitter;
  var cache: { [key: string]: string };
  var dictionariesByLocale: { [key: string]: any };
 
  function get(key: string, replacements?: { [key: string]: string }): string;
  function update(newCurrentLocale: string): void;
  function setDictionary(language: string, dictionary: any): void;
}
