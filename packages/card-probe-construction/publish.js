Meteor.publish('cards.probes', function(simulatorId) {
	return Flint.collection('probes').find({ simulatorId: simulatorId});
});