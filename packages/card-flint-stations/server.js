Meteor.publish('core.flintstations.stations', function(simulatorId) {
	return Flint.collection('stations').find({simulatorId: simulatorId});
});