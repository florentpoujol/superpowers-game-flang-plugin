declare module fLang {
  interface Congig {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    searchInDefaultLocale: boolean;
    replacementPattern: string;
    cache: boolean;
  }
  
  var config: Config;
  var cache: { [key:string]: string };
  var dictionariesByLocales: { [key:string]: Object };
  
  function get(key: string, replacements?: { [key:string]: string }): string;
}
