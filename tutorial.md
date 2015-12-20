# Superpowers fLang plugin

Ths plugin allows for easy localization of any in-game strings if the `Sup Game` system for [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com).  

It expose the `fLang` module to the TypeScript API.

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

[The `Config` interface describe in detail the expected properties](http://florentpoujol.github.io/superpowers-flang-plugin/interfaces/flang.config.html) and their default value.

    // Set two locales, english and french.
    fLang.config.locales = ["en", "fr"]; 


## Dictionaries

Each of the localized strings in your game are identified by a key, unique accross all locales.

The keys must not contains dot and the first-level keys must not be any of the locale name.

The key/string pairs for each locales must be set in an object as value of the locale name in the `fLang.dictionariesByLocales` object.

    
    fLang.dictionariesByLocales.en = {
        localeName: "English",
 
        greetings: { // you may nest the keys
            welcome: "Welcome {{player_name}}!"
        }
    }

    fLang.dictionariesByLocales.fr = {
        greetings: {
            welcome: "Bienvenu {{player_name}} !"
        }
    }

### Writting dictionaries in specialized text assets

For convenience and ease of use, you can [use a `text` asset](https://github.com/florentpoujol/superpowers-text-asset-plugin) to write your localization dictionaries, instead of writing a Javascript object directlyin a `script` asset like in the example above.

For instance, the english dictionary has been written in a `"English"` text asset with a `CSON` syntax, then has been retrieved and set in the `dictionariesByLocales` object from a script.

    # codemirror-mode:cson

    localeName: "English"
    greetings:
        welcome: "Welcome {{player_name}}!"

Then from a script:

    fLang.config.locales = ["en", "fr"];

    fLang.dictionariesByLocales.en = Sup.get("English", Sup.Text).parse();


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
    fLang.dictionariesByLocales.fr.greetings.welcome = "Bienvenu :player_name!"

    fLang.config.currrentLocale = "fr";
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } ); 
    // Bienvenu Florent !

## Updating the current locale

Use the `update()` function:

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

    fLang.udpate( "fr" );

    var text = fLang.get( "greetings.welcome" ); // Bienvenu {{player_name}}!
    
The `update()` function makes the module's event emitter (`fLang.emitter`) emit the `"onUpdate"` event.  
Register listeners functions via the `onUpdate()` function.

    var fn = function(locale: string) {
        console.log("The new current locale is "+locale);
    }
    fLang.onUpdate( fn );

    fLang.udpate( "fr" ); // prints "The new current locale is fr"

The listeners receive the new current locale as their first and only arguments

You can use this to automaticaly update texts when the user changes the locale.
    
    // suppose the actor has a `TextRenderer` component that displays text on-screen.
    this.actor.textRenderer.setText( fLang.get( "ui.options.title" ) ;

    fLang.onUpdate( function(locale: string) {
        this.actor.textRenderer.setText( fLang.get( "ui.options.title" ) );
    } );

For instance  this could change the name of the option menu whenever the player changes the locale.

Un-register listeners by passing them again to `onUpdate()` with the second argument set to `false`.

    var fn = function(locale: string) {
        console.log("The new current locale is "+locale);
    }

    // register the listener:
    fLang.onUpdate( fn ); // or fLang.onUpdate( fn, true );

    // un-register the listener:
    fLang.onUpdate( fn, false );

As the functions passed to `onUpdate()` are listeners and not callbacks, you can set several of them (if you need to update several texts, for instance).

If you work with an actor, a component or anything that is destroyed at some point, you really need to make sure these objects exists before working on them in the listeners.  
You also need to make sure that the listeners are removed when they are not needed anymore, like when the scene changes and all the actors/components are destroyed.

Remember that if needed, you can work on the emitter directly:

    // for instance: remove all the listeners
    fLang.emitter.removeAllListeners();
