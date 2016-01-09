
Sup.log("fLang");
Sup.log(fLang);


var en: any = Sup.get( "en.cson", fText ).parse();
// Sup.log(en);
// fLang.dictionariesByLocale.en = en;
fLang.setDictionary("en", en);

// fLang.config.locales.push("fr");
// var fr: any = (<fText>Sup.get( "fr.json" )).parse();
// Sup.log(fr);
// fLang.dictionariesByLocale.fr = fr
fLang.setDictionary("fr", "fr.json");


var fn = function(locale) {
  Sup.log("========= flangUpdate ===========");
  Sup.log("new locale");
  Sup.log(locale);
  Sup.log("========= flangUpdate ===========");
}

fLang.emitter.on("fLangUpdate", fn);



Sup.log("----------------------------");
Sup.log("Expected: " + en.localeName);
Sup.log( fLang.get( "localeName" ) );


Sup.log("----------------------------");
Sup.log("Expected: " + en.greetings.welcome);
Sup.log( fLang.get( "greetings.welcome" ) );


Sup.log("----------------------------");
Sup.log("Expected: " + fLang.dictionariesByLocale.fr.greetings.welcome);
Sup.log( fLang.get( "fr.greetings.welcome" ) );


Sup.log("----------------------------");
fLang.config.searchInDefaultLocale = false;
Sup.log("Expected printed twice in the console: Lang.get(): Key not found:");
Sup.log( fLang.get( "fr.localeName" ) );
fLang.config.searchInDefaultLocale = true;


Sup.log("----------------------------");
Sup.log("Expected: " + en.localeName);
Sup.log( fLang.get( "fr.localeName" ) );


Sup.log("----------------------------");
Sup.log("Expected: Welcome Florent!");
Sup.log( fLang.get( "greetings.welcome", { player_name: "Florent" } ) );

Sup.log("----------------------------");

fLang.config.replacementPattern = ":placeholder";
fLang.dictionariesByLocale.fr.greetings.welcome = "Bienvenu :player_name!"
delete fLang.cache["fr.greetings.welcome"];
fLang.update("fr");

Sup.log("Expected: Bienvenu Florent !");
Sup.log( fLang.get( "greetings.welcome", { player_name: "Florent" } ) );


Sup.log("----------------------------");
fLang.config.locales.push("de");
Sup.log("Expected: dictionary not found error printed in the console + returned");
Sup.log( fLang.get( "de.localeName" ) );


Sup.log("----------------------------");
fLang.dictionariesByLocale.de = { localeName: 123 }; // wrong value type
Sup.log("Expected: wrong type error printed in the console + returned");
Sup.log( fLang.get( "de.localeName" ) );

