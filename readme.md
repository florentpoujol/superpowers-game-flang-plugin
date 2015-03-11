# Superpowers fLang plugin

This plugin for [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com), exposes the `fLang` modules to the runtime, which allow for easy localization of any strings in your games.

## Documentation

http://florentpoujol.github.io/superpowers-flang-plugin

## Quick reference

Set the configuration in the `fLang.config` object.   
[Check the doc of the `Config` interface](http://florentpoujol.github.io/superpowers-flang-plugin/interfaces/flang.config.html) for a description of each properties.

    fLang.config.locales = ["en", "fr"]; // the default value is ["en"]
    fLang.config.defaultLocale = "en";
    fLang.config.currrentLocale = "en";
    fLang.config.searchInDefaultLocale = true;
    fLang.config.replacementPattern = "{{text}}";
    fLang.config.cache = true;

Set the dictionaries as values in the `fLang.dictionariesByLocales` object.  
The keys in `dictionariesByLocales` must be the locales set in the config.
    
    fLang.dictionariesByLocales.en = {
        localeName: "English",
 
        greetings: { // you may nest the keys
            welcome: "Welcome {{player_name}}!"
        }
    }

    fLang.dictionariesByLocales.fr = {
        greetings: {
            welcome: "Bienvenu {{player_name}}!"
        }
    }

Retrieve a localized string in the current locale:
    
    var text = fLang.get( "localName" ); // returns "English"

You can chain keys with a dot notation :

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

You can specify a locale at the begining of the key to override the current locale:

    var text = fLang.get( "fr.greetings.welcome" ); // Bienvenue {{player_name}}!

If `searchInDefaultLocale` is `true` in the config, keys not found in a locale may still return a value:

    var text = fLang.get( "fr.localName" ); // English

Pass a dictionary of placeholders/replacements as second argument to personalize elements in the localized strings:
    
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } );
    // Welcome Florent !

You can define another replacement pattern via the config:

    fLang.config.replacementPattern = ":text";
    fLang.dictionariesByLocales.fr.greetings.welcome = "Bienvenu :player_name!"

    fLang.config.currrentLocale = "fr";
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } ); 
    // Bienvenu Florent !
