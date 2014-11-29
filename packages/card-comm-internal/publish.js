Meteor.publish('simulator.decks', function(simulatorId) {
	return Flint.collection('decks').find({ simulatorId: simulatorId});
});
Meteor.publish('simulator.rooms', function(simulatorId) {
	return Flint.collection('rooms').find({ simulatorId: simulatorId});
});