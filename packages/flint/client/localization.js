Meteor.startup(function(){
	Deps.autorun(function() {
		Meteor.subscribe("flint.localization", Flint.locale());
	});
	UI.registerHelper('t', function(sourceString) {
		return Flint.t(sourceString);
	});
});