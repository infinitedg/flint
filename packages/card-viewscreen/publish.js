Meteor.publish("card.viewscreen.inputs", function(simulatorId) {
	return Flint.collection('viewscreenInputs').find({'simulatorId': simulatorId});
});

Meteor.publish("card.viewscreen.viewscreens",function(simulatorId) {
	return Flint.collection('viewscreens').find({'simulatorId': simulatorId});
});
