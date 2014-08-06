Meteor.publish('core.login.clients', function(simulatorId) {
	return Flint.collection('clients').find({simulatorId: simulatorId});
});

Meteor.publish('core.login.stations', function(simulatorId) {
	return Flint.collection('stations').find({simulatorId: simulatorId});
});