/**
* A namespace for simple and easy localization.
*/
namespace fLang {
  
  /**
  * Interface for the `fLang.config` dictionary.
  */
  export interface Config {
    /**
    * The array that contains all of the locale (languages) names. Names must not contains dot and should be kept short, like "en" or "fr" for instance.<br>
    * Default value is `["en"]`.
    */
    locales: string[];
    
    /**
    * The default locale name. <br>
    * The default value is `"en"`.
    */
    defaultLocale: string;

    /**
    * The current locale name. <br>
    * The default value is `"en"`.
    */
    currentLocale: string;
    
    /**
    * Tell whether to search in the default locale when a key is not found in the current locale. <br>
    * The default value is `true`.
    */
    searchInDefaultLocale: boolean;

    /**
    * The pattern (plain text, not regex) to recognize the placeholder texts to be replaced with values set in the `replacements` argument of `get()`. <br>
    * The pattern must contain `"placeholder"` that is replaced by the keys set in the `replacements` argument. <br>
    * The default value is `"{{placeholder}}"`.
    */
    replacementPattern: string;
    
    /**
    * Tell whether to cache the keys searched for in the `fLang.cache` dictionary. <br>
    * The default value is `true`.
    */
    cache: boolean;
  }

  /**
  * The module's configuration. <br>
  * See the `Config` interface for a description of each properties and their default values.
  */
  export const config: Config = {
    locales: ["en"],
    defaultLocale: "en",
    currentLocale: "en",
    searchInDefaultLocale: true,
    replacementPattern: "{{placeholder}}",
    cache: true
  };

  /**
  * The module's event emitter.
  * The only event ever emitted is "fLangUpdate".
  */
  export const emitter = new (window as any).EventEmitter(); // provided by Sparklinlabs' eventEmitter plugin

  /**
  * A cache for the keys and their values. All keys contains the locale name as their first chunk. <br>
  * The content is of type `{ [key: string]: string }`.
  */
  export const cache: { [key: string]: string } = {};

  /**
  * The container for the locale dictionaries. <br>
  * The keys are the locale names as defined in the `fLang.config.locales` array. <br>
  * The values are single or multilevel dictionaries in which all keys and values should be strings. <br>
  * The content must be of type `{ [key: string]: Object }` and the default value is `{ en: {} }`.
  */
  export const dictionariesByLocale: { [key: string]: any } = { en: {} };

  /**
  * Retrieve a localized string from its key in the current locale or the locale specified as first chunk of the key. <br>
  * Optionally pass an object containing placeholders/replacements to replace in the retrieved string.
  * @param key The key that identifies the localized string to retrieve. You may specify a locale as first chunk of it, the string will then be retrieved in this locale instead of the current locale.
  * @param replacements The placeholders and their replacements.
  * @returns The localized string in the current locale
  */
  export function get(key: string, replacements?: { [key: string]: string }): string {
    let cacheLine = config.cache;
    let locale = config.currentLocale;
    let locKey = locale + "." + key;
    let line = cache[ key ] || cache[ locKey ] || "";

    if ( line === "" ) { 
      // the line wasn't found in the cache

      const keyChunks = key.split( "." );
      let noLocKey = key; // key without locale at the beginning

      // override the current locale if the first part of the key is a locale ?
      if ( config.locales.indexOf( keyChunks[ 0 ] ) !== -1 ) {
        locale = keyChunks.splice( 0, 1 )[ 0 ];
        noLocKey = keyChunks.join( "." );
      }

      locKey = locale + "." + noLocKey;
      line = cache[ locKey ] || "";
      
      if ( line === "" ) {
        // now we really need to retrieve a line from a dictionnary

        // check if dictionary exists
        let dico: any = dictionariesByLocale[ locale ]; // speicying the type any makes the compiler happy when writing "line = dico;" below
        if ( dico === undefined ) {
          const error = "fLang.get(): Dictionary not found for locale '"+locale+"'.";
          console.error( error, "  Key:", key, "  Dictionaries:", dictionariesByLocale );
          return error;
        }

        for ( let i = 0; i < keyChunks.length; i++ ) {
          const _key = keyChunks[ i ];

          if ( dico[ _key ] === undefined ) {
            // _key was not found in this locale
            // search for it in the default locale (maybe)
            if ( config.searchInDefaultLocale === true && locale !== config.defaultLocale ) {
              dico = get( config.defaultLocale + "." + noLocKey ); // do not pass replacements here
            }
            else {
              // don't want to search in default locale, or already the default locale
              cacheLine = false;
              dico = "Lang.get(): Key not found: '" + key + "'.";
              console.warn( dico );
            }

            break;
          }

          dico = dico[ _key ];
          // dico is now a nested table in the dictionary, or the searched string (or the keynotfound string)
        }

        line = dico;
      }
      else
        cacheLine = false;
    }
    else
      cacheLine = false; // no need to cache if the line already comes from it

    const type = typeof( line );
    if ( type !== "string" ) {
      // test the type here to get a unified error message
      // otherwise, caching, replacing and returning the non-string value should all throw a different error message
      const error = "fLang.get(): Provided key '" + key + "' does not lead to a string but to a value of type '" + type + "'."
      console.error( error, "  Value:", line, "  Dictionary:", fLang.dictionariesByLocale[ locale ] );
      return error;
    }

    if ( cacheLine === true ) {
      cache[ locKey ] = line;
    }

    // finally process replacements
    if ( replacements !== undefined ) {
      // ie: replacements = { theKeyToSearchFor: "my new value" }
      for ( let replKey in replacements ) { // can't use var key, nor _key
        line = line.replace(
          config.replacementPattern.replace( "placeholder", replKey ), // ie: replace "{{placeholder}}" by "{{theKeyToSearchFor}}"
          replacements[ replKey ] 
        ); // replace "{{theKeyToSearchFor}}" by "my new value" in the line
      }
    }

    return line;
  };

  /**
  * Sets the new current locale and emit the `"fLangUpdate"` event, passing the new locale as first and only argument.
  * @param newCurrentLocale The new current locale name (as set in the `fLang.config.locales` array).
  */
  export function update( newCurrentLocale: string ): void {
    if ( config.locales.indexOf( newCurrentLocale ) === -1 ) {
      console.error( "fLang.update(): Provided new current locale '"+newCurrentLocale+"' is not one of the registered locales.", config.locales );
      return;
    }
    config.currentLocale = newCurrentLocale;
    emitter.emit( "fLangUpdate", newCurrentLocale );
  }

  /**
  * Sets the list of key/string for the specified locale.
  * @param locale The locale.
  * @param dictionary The object that contains the list of (maybe nested) keys and corresponding translations.
  */
  export function setDictionary(locale: string, dictionary: any): void {
    if (config.locales.indexOf(locale) === -1)
      config.locales.push(locale);

    dictionariesByLocale[locale] = dictionary;
  }
}

// expose to the runtime
(window as any).fLang = fLang;
