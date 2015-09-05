Meteor.publish('simulator.inventoryItems', function(simulatorId){
	return Flint.collection('inventoryItems').find({simulatorId:simulatorId});
});