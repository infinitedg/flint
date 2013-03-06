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
		Meteor.Router.to('/');
		window.location.reload();
	}
});
