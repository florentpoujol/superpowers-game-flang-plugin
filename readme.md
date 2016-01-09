# Superpowers Game fLang plugin

Ths plugin allows for easy localization of any in-game strings in the `Superpowers Game` system for [Superpowers, the extensible HTML5 2D+3D game engine](http://superpowers-html5.com).  

It expose the `fLang` namespace to the TypeScript API.


## Documentation

[http://florentpoujol.github.io/superpowers-game-flang-plugin](http://florentpoujol.github.io/superpowers-game-flang-plugin)

You can also access it offline in Superpowers' client with the [Plugins documentation](https://github.com/florentpoujol/superpowers-common-pluginsdocs-plugin) plugin, or find it directly in the plugin's `public/docs` folder.


## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-game-flang-plugin/releases), unzip it, rename the folder to `flang`, move it inside `app/systems/supGame/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:
        
    cd app/systems/supGame/plugins
    npm install superpowers-game-flang-plugin

The name of the vendors or plugins in the `app/systems/supGame/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/superpowers-game-flang-plugin`.


## Quick reference

Set the dictionaries with the `setDictionary(language: string, dictionary: Object|string)` function :
    
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


Retrieve a localized string in the current locale:
    
    var text = fLang.get( "localName" ); // returns "English"

Chain keys with a dot notation :

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

Specify a locale at the begining of the key to override the current locale:

    var text = fLang.get( "fr.greetings.welcome" ); // Bienvenu {{player_name}}!

Keys not found in a locale may still return a value if they exists in the default locale :

    var text = fLang.get( "fr.localName" ); // English

Pass a dictionary of placeholders/replacements as second argument to personalize elements in the localized strings:
    
    var text = fLang.get( "greetings.welcome", { player_name: "Florent" } );
    // Welcome Florent!

Update the current locale with the `update()` function.

    var text = fLang.get( "greetings.welcome" ); // Welcome {{player_name}}!

    fLang.udpate("fr");

    var text = fLang.get( "greetings.welcome" ); // Bienvenu {{player_name}} !
    
The `update()` function makes the module's event emitter (`fLang.emitter`) emit the `"fLangUpdate"` event.  

    fLang.emitter.on("fLangUpdate", (locale: string) => {
      console.log("The new current locale is "+locale);
    });

    fLang.udpate( "fr" ); // prints "The new current locale is fr"

The listeners receive the new current locale as their first and only arguments.  
You can use this to automaticaly update texts when the user changes the locale.  


## Test project

The `project` folder contains a test project.  

To run it, put the project folder `fLang` in Superpowers' projects folder, start the server, access the project then run it and open the console.

On Window, Superpowers' projects folder is typically in `C:\Users\[Your user name]\AppData\Roaming\Superpowers`.

Note that this project depends on [the `fText` asset plugin](https://github.com/florentpoujol/superpowers-game-ftext-plugin), as well as this plugin (obviously).
