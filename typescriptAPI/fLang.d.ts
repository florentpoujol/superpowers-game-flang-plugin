// Superpowers Game fLang plugin
// https://github.com/florentpoujol/superpowers-game-flang-plugin
// Easy localization of any in-game strings in the Superpowers Game system.

// Documentation:
// http://florentpoujol.github.io/superpowers-game-flang-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins documentation" tool provided by the "Plugins documentation" plugin: https://github.com/florentpoujol/superpowers-common-pluginsdocs-plugin

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
  var emitter: EventEmitter; // "flangUpdate" is the only event ever emitted on it
  var cache: { [key:string]: string }; // { [key:string]: string }
  var dictionariesByLocale: any; // { [key:string]: Object }
  
  function get(key: string, replacements?: { [key:string]: string }): string;
  function update(newCurrentLocale: string);
  function setDictionary(language: string, dictionary: Object|string)
}
