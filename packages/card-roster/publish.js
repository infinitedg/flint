Meteor.publish('simulator.crew', function(simulatorId) {
	return Flint.collection('crew').find({ simulatorId: simulatorId});
}); 