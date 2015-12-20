// fLang plugin
// https://github.com/florentpoujol/superpowers-flang-plugin
// Easy localization of any in-game strings.

// Documentation:
// http://florentpoujol.github.io/superpowers-flang-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins documentation" tool provided by the "Plugins documentation" plugin: https://github.com/florentpoujol/superpowers-pluginsdocumentation-plugin

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
  var cache: any; // { [key:string]: string }
  var dictionariesByLocale: any; // { [key:string]: Object }
  
  function get(key: string, replacements?: { [key:string]: string }): string;
  function update(newCurrentLocale: string);
  function setDictionary(language: string, dictionary: Object|string)
}
