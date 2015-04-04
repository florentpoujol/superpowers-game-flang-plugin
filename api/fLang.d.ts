// fLang plugin
// https://github.com/florentpoujol/superpowers-flang-plugin
// Easy localization of any in-game strings.

// Documentation:
// http://florentpoujol.github.io/superpowers-flang-plugin

// You can also access the documentation offline in the plugin's "public/docs" folder 
// or via the "Plugins docs browser" tool provided by the "Docs browser" plugin: https://github.com/florentpoujol/superpowers-docs-browser-plugin

declare module fLang {
  interface Config {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    searchInDefaultLocale: boolean;
    replacementPattern: string;
    cache: boolean;
  }
  
  var config: Config;
  var emitter: any; // node's EventEmitter
  var cache: any; // { [key:string]: string }
  var dictionariesByLocale: any; // { [key:string]: Object }
  
  function get(key: string, replacements?: { [key:string]: string }): string;
  function update(newCurrentLocale: string);
  function onUpdate(listener: (locale: string)=>void, removeListener?: boolean); // default = false
}
