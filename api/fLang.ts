module fLang {
  
  interface Config {
    locales: string[];
    defaultLocale: string;
    currentLocale: string;
    searchInDefault: boolean;
    replacementPattern: string;
    cache: boolean;
  }

  var config: Config = {
    locales: ["en"],
    defaultLocale: "en",
    currentLocale: "en",
    searchInDefault: true,
    replacementPattern: "{{text}}",
    cache: true
  };

  var cache: { [key:string]: string } = {}; // the keys always begins by a locale name

  var dictionariesByLocales: { [key:string]: Object } = { "en": {} };

  function get( key: string, replacements?: { [key:string]: any } ): string {
    var config = config;
    var cacheLine = config.cache;
    var locale = config.currentLocale;
    var locKey = locale + "." + key;
    var line = cache[ key ] || cache[ locKey ] || "";

    if ( line === "" ) { 
      // the line wasn't found in the cache

      var keyChunks = key.split( "." );
      var noLocKey = key; // key without locale at the beginning

      // override the current locale if the first part of the key is a locale ?
      if ( config.locales.indexOf( keyChunks[0] ) !== -1 ) {
        locale = keyChunks.splice( 0, 1 );
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
            if ( config.searchInDefault === true && locale !== config.defaultLocale ) {
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
