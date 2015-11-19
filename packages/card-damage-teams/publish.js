Meteor.publish('damageControl.workOrders', function(simulatorId){
	return Flint.collection('workOrders').find({simulatorId:simulatorId});
});
