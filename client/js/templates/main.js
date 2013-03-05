(function () {
	'use strict';
	
    Template.stationPicker.events({
		'click button.simulator': function(event) {
			App.beep();
			Session.set('selectedSimulator', this);
		},
		'click button.station': function(event) {
			Session.set('selectedStation', this);
			Cookie.set('station', this._id);
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
	
	Template.stationCore.simulator = function() {
		var station = Stations.findOne({_id: Cookie.get('station')});
		if (station) {
			var simulator = Simulators.findOne({_id: station.simulator});
			return simulator;
		} else {
			return {};
		}
	}
	
	Template.stationCore.station = function() {
		return Stations.findOne({_id: Cookie.get('station')});
	}
	
	Template.cardList.cards = function() {
		var station = Stations.findOne({_id: Cookie.get('station')});
		if (station) {
			return station.cards;
		} else {
			return [];
		}
	}
	
}());