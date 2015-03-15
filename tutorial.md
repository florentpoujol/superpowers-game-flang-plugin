# Superpowers fLang plugin

This plugin for [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com), exposes the `fLang` modules to the runtime, which allow for easy localization of any strings in your games.

[Go back to the GitHub repo.](https://github.com/florentpoujol/superpowers-flang-plugin)

## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-flang-plugin/releases) then unzip it.

Rename the folder if you want then move it inside `app/plugins/florentpoujol/`.

Finally restart your server.

__Advanced:__

The plugin is published as an npm package so you can get any version of it via `npm`:

    npm install sup-flang-plugin

The name of the vendors in the `app/plugins/` folder actually don't matter, but the plugin folders must be inside a vendor's folder.

So feel free to `npm install` plugins directly inside `app/plugins/` so that they are actually intalled in `app/plugins/node_modules/`.

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

    fLang.dictionariesByLocales.en = Sup.get("English", Sup.Text).parseCSON();


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

