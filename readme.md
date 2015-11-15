# Superpowers fLang plugin

Ths plugin expose the `fLang` module to the TypeScript API of the `Sup Game` system for [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com).  
It allows for easy localization of any in-game strings.


## Documentation

[http://florentpoujol.github.io/superpowers-flang-plugin](http://florentpoujol.github.io/superpowers-flang-plugin)

You can also access it offline in Superpowers' client with the [docs browser](https://github.com/florentpoujol/superpowers-docs-browser-plugin) plugin, or find it directly in the plugin's `public/docs` folder.


## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-flang-plugin/releases), unzip it, rename the folder to `flang`, move it inside `app/sustems/supGame/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:
        
    cd app/systems/supGame/plugins
    npm install sup-flang-plugin

The name of the vendors or plugins in the `app/systems/supGame/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/sup-flang-plugin`.


## Quick reference

Set the configuration in the `fLang.config` object.   
[Check the doc of the `Config` interface](http://florentpoujol.github.io/superpowers-flang-plugin/interfaces/flang.config.html) for a description of each properties.

    fLang.config.locales = ["en", "fr"]; // the default value is ["en"]
    fLang.config.defaultLocale = "en";
    fLang.config.currrentLocale = "en";
    fLang.config.searchInDefaultLocale = true;
    fLang.config.replacementPattern = "{{text}}";
    fLang.config.cache = true;

Set the dictionaries as values in the `fLang.dictionariesByLocale` object.  
The keys in `dictionariesByLocale` must be the locales set in the config.
    
    fLang.dictionariesByLocale.en = {
        localeName: "English",
 
        greetings: { // you may nest the keys
            welcome: "Welcome {{player_name}}!"
        }
    }

    fLang.dictionariesByLocale.fr = {
        greetings: {
            welcome: "Bienvenu {{player_name}}!"
        }
    }

Retrieve a localized string in the current locale:
    
    var text = fLang.get( "localName" ); // returns "English"

You can chain keys with a dot notation :

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

You can specify a locale at the begining of the key to override the current locale:

    var text = fLang.get( "fr.greetings.welcome" ); // Bienvenu {{player_name}}!

If `searchInDefaultLocale` is `true` in the config, keys not found in a locale may still return a value:

    var text = fLang.get( "fr.localName" ); // English

Pass a dictionary of placeholders/replacements as second argument to personalize elements in the localized strings:
    
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } );
    // Welcome Florent !

You can define another replacement pattern via the config:

    fLang.config.replacementPattern = ":text";
    fLang.dictionariesByLocale.fr.greetings.welcome = "Bienvenu :player_name!"

    fLang.config.currrentLocale = "fr";
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } ); 
    // Bienvenu Florent !

Update the current locale with the `update()` function.

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

You can use this to automaticaly update texts when the user changes the locale.  
Un-register listeners by passing them again to `onUpdate()` with the second argument set to `false`.


## Test project

The `project` folder contains a test project.  

To run it, put the project folder `fLang` in Superpowers' projects folder, start the server, access the project then run it and open the console.

On Window, Superpowers' projects folder is typically in `C:\Users\[Your user name]\AppData\Roaming\Superpowers`.

Note that this project depends on [the `Text` asset plugin](https://github.com/florentpoujol/superpowers-text-asset-plugin), as well as this plugin (obviously).
