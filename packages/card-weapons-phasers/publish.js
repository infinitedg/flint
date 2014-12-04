Meteor.publish('card-weapons-phasers', function(simulatorId) {
	return Flint.collection('phasers').find({ simulatorId: simulatorId});
});