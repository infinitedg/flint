Meteor.startup(function(){
	Tracker.autorun(function() {
		Meteor.subscribe("flint.localization", Flint.locale());
	});
	UI.registerHelper('t', function(sourceString) {
		return Flint.t(sourceString);
	});
});