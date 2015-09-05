Flint.themes = function() {
	if (Flint.card() && Flint.client() && Flint.station() && Flint.simulator()) {
	
		// Start with Clients
		var appliedThemes = Flint.client('themes') || [],
		restrictedThemes = Flint.client('restrictedThemes') || [];

		// Cards
		restrictedThemes = _.union(restrictedThemes, Flint.card().restrictedThemes || []);
		appliedThemes = _.union(appliedThemes, _.difference(Flint.card().themes || [], restrictedThemes));

		// Stations
		restrictedThemes = _.union(restrictedThemes, Flint.station('restrictedThemes') || []);
		appliedThemes = _.union(appliedThemes, _.difference(Flint.station('themes') || [], restrictedThemes));

		// Simulators
		restrictedThemes = _.union(restrictedThemes, Flint.simulator('restrictedThemes') || []);
		appliedThemes = _.union(appliedThemes, _.difference(Flint.simulator('themes') || [], restrictedThemes));

		return appliedThemes;
	} else {
		return [];
	}
};

Template.flint_theme_engine.helpers({
	themes: function() {
		return Flint.themes();
	}
});

Meteor.startup(function() {
	Flint.addComponent('flint_theme_engine');
});
