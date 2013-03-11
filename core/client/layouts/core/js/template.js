(function() {
	Template.layout_core.created = function() {
		var context = this;
		Meteor.defer(function() {
			$(context.find('.masonryBox')).masonry({
				itemSelector: '.coreCard',
				columnWidth: function(containerWidth) {
					return containerWidth / 5;
				}
			});
		});
	};
	
	Template.layout_core.simulator = function() {
		var station = Stations.findOne({_id: Session.get('station')});
		if (station) {
			var simulator = Simulators.findOne({_id: station.simulatorId});
			return simulator;
		} else {
			return {};
		}
	};
	
	Template.layout_core.station = function() {
		return Stations.findOne({_id: Session.get('station')});
	};
	
	Template.layout_core.currentCard = function() {
		var t1 = this.cardId;
		Session.setDefault('currentCard', Template.layout_core.cards()[0].cardId);
		var t2 = Session.get('currentCard');
		if (t1 !== undefined && t2 !== undefined) {
			return (t1 == t2);
		} else {
			return true;
		}
	};
	
	Template.layout_core.currentUser = function() {
		return Session.get('username');
	};
	
	Template.layout_core.loggedIn = function() {
		return Session.equals('loggedIn', true);
	};
	
	Template.layout_core.cards = function() {
		var station = Stations.findOne({_id: Session.get('station')});
		if (station) {
			return station.cards;
		} else {
			return [];
		}
	};
}());