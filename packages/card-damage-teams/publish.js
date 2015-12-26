Meteor.publish('damageControl.workOrders', function(simulatorId){
	return Flint.collection('workOrders').find({simulatorId:simulatorId});
});
Meteor.publish('damageControl.pings', function(simulatorId){
	return Flint.collection('damagePings').find({simulatorId:simulatorId});
});
Sortable.collections = ['workorders'];
/*workOrder schema:

{
	"_id": "pAuvb6Y4CjHAoK4EX",
	"simulatorId": "voyager",
	"system": "Phasers",
	"system_id": "systems-voyager-phasers",
	"elapsed": 0,
	"time": 60,
	"order": 100,
	"state": "idle"
}

ping schema:
{
	"simulatorId": "voyager",
	"system_id": "systems-voyager-phasers",
	"content": //HTML Content//
	"image": //Image Source//
	"messages": [
	{from: ('station' or 'teams'),
	 message: 'Message content'}
	]
}


*/
