# Superpowers fLang plugin

Ths plugin allows for easy localization of any in-game strings if the `Sup Game` system for [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com).  

It expose the `fLang` namespace to the TypeScript API.

[Go back to the GitHub repo.](https://github.com/florentpoujol/superpowers-flang-plugin)


## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-flang-plugin/releases), unzip it, rename the folder to `flang`, move it inside `app/systems/supGame/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:
        
    cd app/systems/supGame/plugins
    npm install sup-flang-plugin

The name of the vendors or plugins in the `app/systems/supGame/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/sup-flang-plugin`.


## Configuration

The `fLang.config` object contains the module's configuration properties.

[The `Config` interface describe in detail the expected properties](#flang.config) and their default value.


## Dictionaries

Each of the localized strings in your game are identified by a key, unique accross all locales.

The keys must not contains dot and the first-level keys must not be any of the locale name.

The key/string pairs for each locales must be set with the `setDictionary(language: string, dictionary: Object|string)` function :

    let en: any = {
      localeName: "English",

      greetings: { // you may nest the keys
        welcome: "Welcome {{player_name}}!"
      }
    };
    fLang.setDictionary("en", en);

    fLang.setDictionary("fr", {
      greetings: {
        welcome: "Bienvenu {{player_name}} !"
      }
    });

### Writting dictionaries in fText assets

For convenience and ease of use, you can [use a `fText` asset](https://github.com/florentpoujol/superpowers-ftext-plugin) to write your localization dictionaries, instead of writing a Javascript object directly in a script asset like in the example above.

Note that you can only use the extensions that are parsed to a Javascript object, like `json`, `cson`, and `yml`.

For instance, the english dictionary has been written in a `"en.cson"` asset :

    localeName: "English"
    greetings:
        welcome: "Welcome {{player_name}}!"

Then pass the asset's path to the  `setDictionary()` function:

    fLang.setDictionary("fr", "en.cson");


## Retrieve a string

Retrieve a localized string in the current locale:
    
    var text = fLang.get( "localName" ); // returns "English"

Access nested strings with classic "dot notation":

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

You can specify a locale at the begining of the key to override the current locale:

    var text = fLang.get( "fr.greetings.welcome" ); // Bienvenue {{player_name}} !

If `searchInDefaultLocale` is `true` in the config, keys not found in a locale may still return the value found in the default locale (if any):

    var text = fLang.get( "fr.localName" ); // English

## Placeholders and replacements

Your localized strings may contains placeholder texts that are meant to be replaced with other values before being displayed.  

Pass a dictionary of placeholders/replacements as second argument to personalize elements in the localized strings:
    
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } );
    // Welcome Florent!

You can define another replacement pattern via the config:

    fLang.config.replacementPattern = ":placeholder";
    fLang.dictionariesByLocales.en.greetings.welcome = "Welcome :player_name!"

    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } ); 
    // Welcome Florent!

## Updating the current locale

Use the `update()` function:

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

    fLang.udpate( "fr" );

    var text = fLang.get( "greetings.welcome" ); // Bienvenu {{player_name}} !
    
The `update()` function makes the event emitter (`fLang.emitter`) emit the `"fLangUpdate"` event.  

    fLang.emitter.on("fLangUpdate", (locale: string) => {
      console.log("The new current locale is "+locale);
    });

    fLang.udpate( "fr" ); // prints "The new current locale is fr"

The listeners receive the new current locale as their first and only arguments.  
You can use this to automaticaly update texts when the user changes the locale.
    
    // suppose the actor has a `TextRenderer` component that displays text on-screen.
    this.actor.textRenderer.setText( fLang.get( "ui.options.title" ) ;

    fLang.emitter.on("fLangUpdate", function(locale: string) {
        this.actor.textRenderer.setText( fLang.get( "ui.options.title" ) );
    });

For instance this could change the name of the option menu whenever the player changes the locale.

If you work with an actor, a component or anything that is destroyed at some point, you really need to make sure these objects exists before working on them in the listeners.  

You also need to make sure that the listeners are removed when they are not needed anymore, like when the scene changes and all the actors/components are destroyed.

    // for instance: remove all the listeners
    fLang.emitter.removeAllListeners();
