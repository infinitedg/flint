Meteor.Router.add({
	'/': function() {
	if (!Cookie.get('station')) {
			return 'stationPicker';
		} else {
			return 'stationCore';
		}
	},
	'/reset': function() {
		Cookie.remove('station');
		Meteor.defer(function() { // Fire away on next run loop
			Meteor.Router.to('/');
		});
	}
});
