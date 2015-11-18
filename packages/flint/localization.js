var _locale = "en-us",
	localeDep;

// Wrapped to prevent errors when starting up
Meteor.startup(function(){
	localeDep = new Tracker.Dependency();
});

Flint.locale = function(l) {
	if (l === undefined) { // Getter
		localeDep.depend();
		return _locale;
	} else { // Setter
		_locale = l;
		localeDep.changed();
	}
};

Flint._defaultLocale = "en-us";

Flint.t = function(sourceString) {
	var s = Flint.collection('FlintLocalizations').findOne({source: sourceString, locale: Flint.locale()});
	if (s === undefined) {
		s = Flint.collection('FlintLocalizations').findOne({source: sourceString, locale: Flint._defaultLocale});
		Flint.Log.verbose("Unknown localization string " + sourceString + " for locale " + Flint.locale(), "localization");
	}
	if (s === undefined) {
		s = {string: sourceString};
		Flint.Log.verbose("Localization string " + sourceString + " not found", "localization");
	}
	return s.string;
};
