(function () {
	'use strict';
	
    Template.coreController.events({
		'click button.simulator': function(event) {
			App.beep();
			Session.set('selectedSimulator', this);
		},
		'click button.station': function(event) {
			Session.set('selectedStation', this);
			Cookie.set('station', this._id);
			Meteor.Router.to('/');
			window.location.reload();
		},
    });
	
	Template.coreController.stationPicked = function() {
		var s = Cookie.get('station');
		if (s === undefined || s.length == 0) {
			return false;
		} else {
			return true;
		}
	};
	
	Template.stationPicker.simulators = function() {
		return Simulators.find({});
	}
	
	Template.stationPicker.stations = function() {
		var id = Session.get('selectedSimulator')['_id'];
		return Stations.find({simulator: id});
	}
	
	Template.stationPicker.selectedSimulator = function() {
		return Session.get('selectedSimulator');
	}
	
}());