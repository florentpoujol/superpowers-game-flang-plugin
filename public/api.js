(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


SupCore.system.api.registerPlugin("typescript", "fLang", {
  code: "/// <reference path=\"../gitignore/EventEmitter.d.ts\" />\n\n/**\n* A module for simple and easy localization.\n*/\nmodule fLang {\n  \n  /**\n  * Interface for the `fLang.config` dictionary.\n  */\n  export interface Config {\n    /**\n    * The array that contains all of the locale (languages) names. Names must not contains dot and should be kept short, like \"en\" or \"fr\" for instance.<br>\n    * Default value is `[\"en\"]`.\n    */\n    locales: string[];\n    \n    /**\n    * The default locale name. <br>\n    * The default value is `\"en\"`.\n    */\n    defaultLocale: string;\n\n    /**\n    * The current locale name. <br>\n    * The default value is `\"en\"`.\n    */\n    currentLocale: string;\n    \n    /**\n    * Tell whether to search in the default locale when a key is not found in the current locale. <br>\n    * The default value is `true`.\n    */\n    searchInDefaultLocale: boolean;\n\n    /**\n    * The pattern (plain text, not regex) to recognize the placeholder texts to be replaced with values set in the `replacements` argument of `get()`. <br>\n    * The pattern must contain `\"placeholder\"` that is replaced by the keys set in the `replacements` argument. <br>\n    * The default value is `\"{{placeholder}}\"`.\n    */\n    replacementPattern: string;\n    \n    /**\n    * Tell whether to cache the keys searched for in the `fLang.cache` dictionary. <br>\n    * The default value is `true`.\n    */\n    cache: boolean;\n  }\n\n  /**\n  * The module's configuration. <br>\n  * See the `Config` interface for a description of each properties and their default values.\n  */\n  export var config: Config; // this two-step function is need for typedoc to consider config as a variable instead of an object literals\n  config = {\n    locales: [\"en\"],\n    defaultLocale: \"en\",\n    currentLocale: \"en\",\n    searchInDefaultLocale: true,\n    replacementPattern: \"{{placeholder}}\",\n    cache: true\n  };\n\n  /**\n  * The module's event emitter.\n  */\n  export var emitter = new (<any>window).EventEmitter(); // provided by Sparklinlabs' eventEmitter plugin\n\n  /**\n  * A cache for the keys and their values. All keys contains the locale name as their first chunk. <br>\n  * The content is of type `{ [key:string]: string }`.\n  */\n  export var cache: any = {};\n\n  /**\n  * The container for the locale dictionaries. <br>\n  * The keys are the locale names as defined in the `fLang.config.locales` array. <br>\n  * The values are single or multilevel dictionaries in which all keys and values should be strings. <br>\n  * The content must be of type `{ [key:string]: Object }` and the default value is `{ en: {} }`.\n  */\n  export var dictionariesByLocale: any;\n  dictionariesByLocale = { en: {} };\n\n  /**\n  * Retrieve a localized string from its key in the current locale or the locale specified as first chunk of the key. <br>\n  * Optionally pass an object containing placeholders/replacements to replace in the retrieved string.\n  * @param key The key that identifies the localized string to retrieve. You may specify a locale as first chunk of it, the string will then be retrieved in this locale instead of the current locale.\n  * @param replacements The placeholders and their replacements.\n  * @returns The localized string in the current locale\n  */\n  export function get( key: string, replacements?: { [key:string]: any } ): string {\n    var cacheLine = config.cache;\n    var locale = config.currentLocale;\n    var locKey = locale + \".\" + key;\n    var line = cache[ key ] || cache[ locKey ] || \"\";\n\n    if ( line === \"\" ) { \n      // the line wasn't found in the cache\n\n      var keyChunks = key.split( \".\" );\n      var noLocKey = key; // key without locale at the beginning\n\n      // override the current locale if the first part of the key is a locale ?\n      if ( config.locales.indexOf( keyChunks[ 0 ] ) !== -1 ) {\n        locale = keyChunks.splice( 0, 1 )[ 0 ];\n        noLocKey = keyChunks.join( \".\" );\n      }\n\n      locKey = locale + \".\" + noLocKey;\n      line = cache[ locKey ] || \"\";\n      \n      if ( line === \"\" ) {\n        // now we really need to retrieve a line from a dictionnary\n\n        // check if dictionary exists\n        var dico: any = dictionariesByLocale[ locale ]; // speicying the type any makes the compiler happy when writing \"line = dico;\" below\n        if ( dico === undefined ) {\n          var error = \"fLang.get(): Dictionary not found for locale '\"+locale+\"'.\";\n          console.error( error, \"  Key:\", key, \"  Dictionaries:\", dictionariesByLocale );\n          return error;\n        }\n\n        for ( var i = 0; i < keyChunks.length; i++ ) {\n          var _key = keyChunks[ i ];\n\n          if ( dico[ _key ] === undefined ) {\n            // _key was not found in this locale\n            // search for it in the default locale (maybe)\n            if ( config.searchInDefaultLocale === true && locale !== config.defaultLocale ) {\n              dico = get( config.defaultLocale + \".\" + noLocKey ); // do not pass replacements here\n            }\n            else {\n              // don't want to search in default locale, or already the default locale\n              cacheLine = false;\n              dico = \"Lang.get(): Key not found: '\" + key + \"'.\";\n              console.warn( dico );\n            }\n\n            break;\n          }\n\n          dico = dico[ _key ];\n          // dico is now a nested table in the dictionary, or the searched string (or the keynotfound string)\n        }\n\n        line = dico;\n      }\n      else\n        cacheLine = false;\n    }\n    else\n      cacheLine = false; // no need to cache if the line already comes from it\n\n    var type = typeof( line )\n    if ( type !== \"string\" ) {\n      // test the type here to get a unified error message\n      // otherwise, caching, replacing and returning the non-string value should all throw a different error message\n      var error = \"fLang.get(): Provided key '\" + key + \"' does not lead to a string but to a value of type '\" + type + \"'.\"\n      console.error( error, \"  Value:\", line, \"  Dictionary:\", fLang.dictionariesByLocale[ locale ] );\n      return error;\n    }\n\n    if ( cacheLine === true ) {\n      cache[ locKey ] = line;\n    }\n\n    // finally process replacements\n    if ( replacements !== undefined ) {\n      // ie: replacements = { theKeyToSearchFor: \"my new value\" }\n      for ( var replKey in replacements ) { // can't use var key, nor _key\n        line = line.replace(\n          config.replacementPattern.replace( \"placeholder\", replKey ), // ie: replace \"{{placeholder}}\" by \"{{theKeyToSearchFor}}\"\n          replacements[ replKey ] \n        ); // replace \"{{theKeyToSearchFor}}\" by \"my new value\" in the line\n      }\n    }\n\n    return line;\n  };\n\n  /**\n  * Sets the new current locale and emit the `\"onUpdate\"` event, passing the new locale as first and only argument.\n  * @param newCurrentLocale The new current locale name (as set in the `fLang.config.locales` array).\n  */\n  export function update( newCurrentLocale: string ) {\n    if ( config.locales.indexOf( newCurrentLocale ) === -1 ) {\n      console.error( \"fLang.update(): Provided new current locale '\"+newCurrentLocale+\"' is not one of the registered locales.\", config.locales );\n      return;\n    }\n    config.currentLocale = newCurrentLocale;\n    emitter.emit( \"onUpdate\", newCurrentLocale );\n  }\n\n  /**\n  * Add or remove listeners functions for the `\"onUpdate\"` event.\n  * @param listener The listener function for the `\"onUpdate\"` event. The function receive the new current locale as its first and only argument.\n  * @param removeListener Tell whether you want to remove the provided listener from the listeners of the `\"onUpdate\"` event.\n  */\n  export function onUpdate( listener: (locale: string)=>void, removeListener: boolean = false ) {\n    if ( removeListener === true )\n      emitter.removeListener( \"onUpdate\", listener );\n    else\n      emitter.addListener( \"onUpdate\", listener );\n  }\n}\n\n// expose to the runtime\n(<any>window).fLang = fLang;\n".replace("reference path", "_reference path"),
  defs: "// fLang plugin\n// https://github.com/florentpoujol/superpowers-flang-plugin\n// Easy localization of any in-game strings.\n\n// Documentation:\n// http://florentpoujol.github.io/superpowers-flang-plugin\n\n// You can also access the documentation offline in the plugin's \"public/docs\" folder \n// or via the \"Docs browser\" tool provided by the \"Docs browser\" plugin: https://github.com/florentpoujol/superpowers-docs-browser-plugin\n\ndeclare module fLang {\n  interface Config {\n    locales: string[];\n    defaultLocale: string;\n    currentLocale: string;\n    searchInDefaultLocale: boolean;\n    replacementPattern: string;\n    cache: boolean;\n  }\n  \n  var config: Config;\n  var emitter: EventEmitter;\n  var cache: any; // { [key:string]: string }\n  var dictionariesByLocale: any; // { [key:string]: Object }\n  \n  function get(key: string, replacements?: { [key:string]: string }): string;\n  function update(newCurrentLocale: string);\n  function onUpdate(listener: (locale: string)=>void, removeListener?: boolean); // default = false\n}\n"
});

},{}]},{},[1]);
