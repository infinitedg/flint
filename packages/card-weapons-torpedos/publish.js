Meteor.publish('card-weapons-torpedos', function(simulatorId) {
	return Flint.collection('torpedos').find({ simulatorId: simulatorId});
});