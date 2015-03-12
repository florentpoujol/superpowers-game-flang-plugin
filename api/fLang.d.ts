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
  var cache: any; // { [key:string]: string }
  var dictionariesByLocales: any; // { [key:string]: Object }
  
  function get(key: string, replacements?: { [key:string]: string }): string;
}
