
/**
* A module for simple and easy localization.
*/
module fLang {
  
  /**
  * Interface for the `fLang.config` dictionary.
  * See the the documentation of the `fLang.config` variable for a description of each properties and their default values.
  */
  interface Config {
    /**
    * The array that contains all of the locale (languages) names. <br>
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
    * The pattern must contain `"text"` that is replaced by the keys set in the `replacements` argument. <br>
    * The default value is `"{{text}}"`.
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
  var config: Config; // this two-step function is need for typedoc to consider config as a variable instead of an object literals
  config = {
    locales: ["en"],
    defaultLocale: "en",
    currentLocale: "en",
    searchInDefaultLocale: true,
    replacementPattern: "{{text}}",
    cache: true
  };

  /**
  * A cache for the keys and their values. All keys contains the locale name as their first chunk.
  */
  var cache: { [key:string]: string } = {};

  /**
  * The container for the locale dictionaries. <br>
  * The keys are the locale names as defined in the `fLang.config.locales` array. <br>
  * The values are single or multilevel dictionaries in which all keys and values should be strings. <br>
  * The default value is `{ en: {} }`.
  */
  var dictionariesByLocales: { [key:string]: Object };
  dictionariesByLocales = { en: {} };

  /**
  * Retrieve a localized string from its key in the current locale or the locale specified as first chunk of the key. <br>
  * Optionally pass an object containing placeholders/replacements to replace in the retrieved string.
  * @param key The key that identifies the localized string to retrieve. You may specify a locale as first chunk of it, the string will then be retrieved in this locale instead of the current locale.
  * @param replacements The placeholders and their replacements.
  * @returns The localized string in the current locale
  */
  function get( key: string, replacements?: { [key:string]: any } ): string {
    var cacheLine = config.cache;
    var locale = config.currentLocale;
    var locKey = locale + "." + key;
    var line = cache[ key ] || cache[ locKey ] || "";

    if ( line === "" ) { 
      // the line wasn't found in the cache

      var keyChunks = key.split( "." );
      var noLocKey = key; // key without locale at the beginning

      // override the current locale if the first part of the key is a locale ?
      if ( config.locales.indexOf( keyChunks[ 0 ] ) !== -1 ) {
        locale = keyChunks.splice( 0, 1 )[ 0 ];
        noLocKey = keyChunks.join( "." );
      }

      locKey = locale + noLocKey;
      line = cache[ locKey ] || "";
      
      if ( line === "" ) {
        // now we really need to retrieve a line from a dictionnary

        // check if dictionary exists
        var dico: any = dictionariesByLocales[ locale ]; // speicying the type any makes the compiler happy when writing "line = dico;" below
        if ( dico === undefined ) {
          var error = "fLang.get(): Dictionary not found for locale '"+locale+"'.";
          console.error( error, key, dictionariesByLocales );
          return error;
        }

        for ( var i = 0; i < keyChunks.length; i++ ) {
          var _key = keyChunks[ i ];

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
              console.log( dico );
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

    var type = typeof( line )
    if ( type !== "string" ) {
      // test the type here to get a unified error message
      // otherwise, caching, replacing and returning the non-string value should all throw a different error message
      var error = "fLang.get(): Provided key '" + key + "' does not lead to a string but to a value of type '" + type + "'."
      console.log( error, line );
      return error;
    }

    if ( cacheLine === true ) {
      cache[ locKey ] = line;
    }

    // finally process replacements
    if ( replacements !== undefined ) {
      // ie: replacements = { theKeyToSearchFor: "my new value" }
      for ( var replKey in replacements ) { // can't use var key, nor _key
        line.replace(
          config.replacementPattern.replace( "text", replKey ), // ie: replace "{{text}}" by "{{theKeyToSearchFor}}"
          replacements[ replKey ] 
        ); // replace "{{theKeyToSearchFor}}" by "my new value" in the line
      }
    }

    return line;
  };
}
