Meteor.publish('damageControl.workOrders', function(simulatorId){
	return Flint.collection('workOrders').find({simulatorId:simulatorId});
});
Meteor.publish('damageControl.pings', function(simulatorId){
	return Flint.collection('damagePings').find({simulatorId:simulatorId});
});
Sortable.collections = ['workorders'];
