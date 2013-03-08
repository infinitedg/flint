(function () {
	'use strict';
	
    Template.stationPicker.events({
		'click button.simulator': function(event) {
			Flint.beep();
			Session.set('selectedSimulator', this);
		},
		'click button.station': function(event) {
			Session.set('selectedStation', this);
			Cookie.set('station', this._id);
			window.location.reload();
		}
    });
	
	Template.stationPicker.simulators = function() {
		return Simulators.find({});
	};
	
	Template.stationPicker.stations = function() {
		var id = Session.get('selectedSimulator')._id;
		return Stations.find({simulator: id});
	};
	
	Template.stationPicker.selectedSimulator = function() {
		return Session.get('selectedSimulator');
	};
	
	Template.stationCore.simulator = function() {
		var station = Stations.findOne({_id: Cookie.get('station')});
		if (station) {
			var simulator = Simulators.findOne({_id: station.simulator});
			return simulator;
		} else {
			return {};
		}
	};
	
	Template.stationCore.station = function() {
		return Stations.findOne({_id: Cookie.get('station')});
	};
	
	Template.stationCore.currentCard = function() {
		var t1 = this.cardId;
		Session.setDefault('currentCard', Template.stationCore.cards()[0].cardId);
		var t2 = Session.get('currentCard');
		if (t1 !== undefined && t2 !== undefined) {
			return (t1 == t2);
		} else {
			return true;
		}
	};
	
	Template.stationCore.currentUser = function() {
		return Session.get('username');
	};
	
	Template.stationCore.loggedIn = function() {
		return Session.equals('loggedIn', true);
	};
	
	Template.cardList.cards = function() {
		var station = Stations.findOne({_id: Cookie.get('station')});
		if (station) {
			return station.cards;
		} else {
			return [];
		}
	};
	
	Template.cardList.isCurrentCard = function(cardId) {
		return Session.equals('currentCard', cardId);
	};
	
	Template.cardList.stationName = function() {
		return Session.get('currentStation');
	};
	
	Template.cardList.events = {
		'click a': function(e) {
			Flint.beep();
			Session.set('currentCard', this.cardId);
		}
	};
	
	Template.stationCore.cards = Template.cardList.cards;
	
	Template.programming_tools.programmingEnabled = function() {
		return Session.get('_programming');
	};
	
}());