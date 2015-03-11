declare module fLang {
  interface Congig {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    searchInDefault: boolean;
    replacementPattern: string;
    cache: boolean;
  }
  
  var config: Config;
  var dictionariesByLocales: { [key:string]: Object };

  function get(key: string, replacements?: { [key:string]: string }): string;
}
