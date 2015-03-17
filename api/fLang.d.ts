
// full documentation:
// http://florentpoujol.github.io/superpowers-flang-plugin

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
