(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var fs;

if (typeof window !== "undefined" && window !== null) {
  window.EventEmitter = require("events").EventEmitter;
}



SupAPI.addPlugin('typescript', 'fLang', {
  code: "\r\n/**\r\n* @private\r\n*/\r\ndeclare var EventEmitter;\r\n\r\n/**\r\n* A module for simple and easy localization.\r\n*/\r\nmodule fLang {\r\n  \r\n  /**\r\n  * Interface for the `fLang.config` dictionary.\r\n  */\r\n  export interface Config {\r\n    /**\r\n    * The array that contains all of the locale (languages) names. Names must not contains dot and should be kept short, like \"en\" or \"fr\" for instance.<br>\r\n    * Default value is `[\"en\"]`.\r\n    */\r\n    locales: string[];\r\n    \r\n    /**\r\n    * The default locale name. <br>\r\n    * The default value is `\"en\"`.\r\n    */\r\n    defaultLocale: string;\r\n\r\n    /**\r\n    * The current locale name. <br>\r\n    * The default value is `\"en\"`.\r\n    */\r\n    currentLocale: string;\r\n    \r\n    /**\r\n    * Tell whether to search in the default locale when a key is not found in the current locale. <br>\r\n    * The default value is `true`.\r\n    */\r\n    searchInDefaultLocale: boolean;\r\n\r\n    /**\r\n    * The pattern (plain text, not regex) to recognize the placeholder texts to be replaced with values set in the `replacements` argument of `get()`. <br>\r\n    * The pattern must contain `\"placeholder\"` that is replaced by the keys set in the `replacements` argument. <br>\r\n    * The default value is `\"{{placeholder}}\"`.\r\n    */\r\n    replacementPattern: string;\r\n    \r\n    /**\r\n    * Tell whether to cache the keys searched for in the `fLang.cache` dictionary. <br>\r\n    * The default value is `true`.\r\n    */\r\n    cache: boolean;\r\n  }\r\n\r\n  /**\r\n  * The module's configuration. <br>\r\n  * See the `Config` interface for a description of each properties and their default values.\r\n  */\r\n  export var config: Config; // this two-step function is need for typedoc to consider config as a variable instead of an object literals\r\n  config = {\r\n    locales: [\"en\"],\r\n    defaultLocale: \"en\",\r\n    currentLocale: \"en\",\r\n    searchInDefaultLocale: true,\r\n    replacementPattern: \"{{placeholder}}\",\r\n    cache: true\r\n  };\r\n\r\n  /**\r\n  * The module's event emitter (an instance of node's `events.EventEmitter`).\r\n  */\r\n  export var emitter = new EventEmitter();\r\n\r\n  /**\r\n  * A cache for the keys and their values. All keys contains the locale name as their first chunk. <br>\r\n  * The content is of type `{ [key:string]: string }`.\r\n  */\r\n  export var cache: any = {};\r\n\r\n  /**\r\n  * The container for the locale dictionaries. <br>\r\n  * The keys are the locale names as defined in the `fLang.config.locales` array. <br>\r\n  * The values are single or multilevel dictionaries in which all keys and values should be strings. <br>\r\n  * The content must be of type `{ [key:string]: Object }` and the default value is `{ en: {} }`.\r\n  */\r\n  export var dictionariesByLocale: any;\r\n  dictionariesByLocale = { en: {} };\r\n\r\n  /**\r\n  * Retrieve a localized string from its key in the current locale or the locale specified as first chunk of the key. <br>\r\n  * Optionally pass an object containing placeholders/replacements to replace in the retrieved string.\r\n  * @param key The key that identifies the localized string to retrieve. You may specify a locale as first chunk of it, the string will then be retrieved in this locale instead of the current locale.\r\n  * @param replacements The placeholders and their replacements.\r\n  * @returns The localized string in the current locale\r\n  */\r\n  export function get( key: string, replacements?: { [key:string]: any } ): string {\r\n    var cacheLine = config.cache;\r\n    var locale = config.currentLocale;\r\n    var locKey = locale + \".\" + key;\r\n    var line = cache[ key ] || cache[ locKey ] || \"\";\r\n\r\n    if ( line === \"\" ) { \r\n      // the line wasn't found in the cache\r\n\r\n      var keyChunks = key.split( \".\" );\r\n      var noLocKey = key; // key without locale at the beginning\r\n\r\n      // override the current locale if the first part of the key is a locale ?\r\n      if ( config.locales.indexOf( keyChunks[ 0 ] ) !== -1 ) {\r\n        locale = keyChunks.splice( 0, 1 )[ 0 ];\r\n        noLocKey = keyChunks.join( \".\" );\r\n      }\r\n\r\n      locKey = locale + \".\" + noLocKey;\r\n      line = cache[ locKey ] || \"\";\r\n      \r\n      if ( line === \"\" ) {\r\n        // now we really need to retrieve a line from a dictionnary\r\n\r\n        // check if dictionary exists\r\n        var dico: any = dictionariesByLocale[ locale ]; // speicying the type any makes the compiler happy when writing \"line = dico;\" below\r\n        if ( dico === undefined ) {\r\n          var error = \"fLang.get(): Dictionary not found for locale '\"+locale+\"'.\";\r\n          console.error( error, \"  Key:\", key, \"  Dictionaries:\", dictionariesByLocale );\r\n          return error;\r\n        }\r\n\r\n        for ( var i = 0; i < keyChunks.length; i++ ) {\r\n          var _key = keyChunks[ i ];\r\n\r\n          if ( dico[ _key ] === undefined ) {\r\n            // _key was not found in this locale\r\n            // search for it in the default locale (maybe)\r\n            if ( config.searchInDefaultLocale === true && locale !== config.defaultLocale ) {\r\n              dico = get( config.defaultLocale + \".\" + noLocKey ); // do not pass replacements here\r\n            }\r\n            else {\r\n              // don't want to search in default locale, or already the default locale\r\n              cacheLine = false;\r\n              dico = \"Lang.get(): Key not found: '\" + key + \"'.\";\r\n              console.warn( dico );\r\n            }\r\n\r\n            break;\r\n          }\r\n\r\n          dico = dico[ _key ];\r\n          // dico is now a nested table in the dictionary, or the searched string (or the keynotfound string)\r\n        }\r\n\r\n        line = dico;\r\n      }\r\n      else\r\n        cacheLine = false;\r\n    }\r\n    else\r\n      cacheLine = false; // no need to cache if the line already comes from it\r\n\r\n    var type = typeof( line )\r\n    if ( type !== \"string\" ) {\r\n      // test the type here to get a unified error message\r\n      // otherwise, caching, replacing and returning the non-string value should all throw a different error message\r\n      var error = \"fLang.get(): Provided key '\" + key + \"' does not lead to a string but to a value of type '\" + type + \"'.\"\r\n      console.error( error, \"  Value:\", line, \"  Dictionary:\", fLang.dictionariesByLocale[ locale ] );\r\n      return error;\r\n    }\r\n\r\n    if ( cacheLine === true ) {\r\n      cache[ locKey ] = line;\r\n    }\r\n\r\n    // finally process replacements\r\n    if ( replacements !== undefined ) {\r\n      // ie: replacements = { theKeyToSearchFor: \"my new value\" }\r\n      for ( var replKey in replacements ) { // can't use var key, nor _key\r\n        line = line.replace(\r\n          config.replacementPattern.replace( \"placeholder\", replKey ), // ie: replace \"{{placeholder}}\" by \"{{theKeyToSearchFor}}\"\r\n          replacements[ replKey ] \r\n        ); // replace \"{{theKeyToSearchFor}}\" by \"my new value\" in the line\r\n      }\r\n    }\r\n\r\n    return line;\r\n  };\r\n\r\n  /**\r\n  * Sets the new current locale and emit the `\"onUpdate\"` event, passing the new locale as first and only argument.\r\n  * @param newCurrentLocale The new current locale name (as set in the `fLang.config.locales` array).\r\n  */\r\n  export function update( newCurrentLocale: string ) {\r\n    if ( config.locales.indexOf( newCurrentLocale ) === -1 ) {\r\n      console.error( \"fLang.update(): Provided new current locale '\"+newCurrentLocale+\"' is not one of the registered locales.\", config.locales );\r\n      return;\r\n    }\r\n    config.currentLocale = newCurrentLocale;\r\n    emitter.emit( \"onUpdate\", newCurrentLocale );\r\n  }\r\n\r\n  /**\r\n  * Add or remove listeners functions for the `\"onUpdate\"` event.\r\n  * @param listener The listener function for the `\"onUpdate\"` event. The function receive the new current locale as its first and only argument.\r\n  * @param removeListener Tell whether you want to remove the provided listener from the listeners of the `\"onUpdate\"` event.\r\n  */\r\n  export function onUpdate( listener: (locale: string)=>void, removeListener: boolean = false ) {\r\n    if ( removeListener === true )\r\n      emitter.removeListener( \"onUpdate\", listener );\r\n    else\r\n      emitter.addListener( \"onUpdate\", listener );\r\n  }\r\n}\r\n",
  defs: "\r\n// full documentation:\r\n// http://florentpoujol.github.io/superpowers-flang-plugin\r\n// <a href=\"http://florentpoujol.github.io/superpowers-flang-plugin\">http://florentpoujol.github.io/superpowers-flang-plugin</a>\r\n\r\ndeclare module fLang {\r\n  interface Config {\r\n    locales: string[];\r\n    defaultLocale: string;\r\n    currentLocale: string;\r\n    searchInDefaultLocale: boolean;\r\n    replacementPattern: string;\r\n    cache: boolean;\r\n  }\r\n  \r\n  var config: Config;\r\n  var emitter: any; // node's EventEmitter\r\n  var cache: any; // { [key:string]: string }\r\n  var dictionariesByLocale: any; // { [key:string]: Object }\r\n  \r\n  function get(key: string, replacements?: { [key:string]: string }): string;\r\n  function update(newCurrentLocale: string);\r\n  function onUpdate(listener: (locale: string)=>void, removeListener?: boolean); // default = false\r\n}\r\n"
});



},{"events":2}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1]);
