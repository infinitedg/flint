Meteor.publish("card.viewscreen.inputs", function(viewscreenId) {
	return Flint.collection('viewscreenInputs').find({'viewscreenId': viewscreenId});
});

Meteor.publish("card.viewscreen.viewscreens",function(simulatorId) {
	return Flint.collection('viewscreens').find({'simulatorId': simulatorId});
});
