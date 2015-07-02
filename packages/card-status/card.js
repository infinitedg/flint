Template.card_status.listStatus = function(){
	return Flint.card().status;
};

Template.card_status.statusCounter = function(){
	var collection = Flint.collection(this.collection);
	var doc = collection.findOne(this.document);
	var returner = [];
	if (this.type == "bar"){
		var min;
		var max;
		if (typeof this.min == "string"){
			min = doc[this.min];
		} else {
			min = this.min;
		}
		if (typeof this.max == "string"){
			max = doc[this.max];
		} else {
			max = this.max;
		}
		var value = Math.round((doc[this.key] - min) / (max - min)*10);
		for (i = 0; i < value; i++){
			if (i < 2){
				returner.push('red');
			} else if (i < 8){
				returner.push('blue');
			} else {
				returner.push('green');
			}
		}
	}
	return returner;
};
/*
{
	"_id" : "voyager-operations",
	"cards" : [
		{
			"cardId" : "card_login",
			"name" : "LOGIN"
		},
		{
			"cardId" : "card_alertCondition",
			"name" : "ALERT CONDITION"
		},
		{
			"cardId" : "card_engineControl",
			"name" : "ENGINECONTROL"
		},
		{
			"cardId" : "card_status",
			"name" : "STATUS",
			"status" : [
			{
				"name" : "Engine Heat",
				"type" : "bar",
				"min" : 0,
				"max" : 100,
				"collection" : "systems",
				"document": {'name':'Engines','simulatorId':'voyager'},
				"key" : 'heat'
			},
			{
				"name" : "Warp Core Power",
				"type" : "bar",
				"min" : "minPower",
				"max" : "maxPower",
				"collection" : "systems",
				"document": {'name':'Warp Core','simulatorId':'voyager'},
				"key" : "power"
			}]
		},
		{
			"cardId" : "card_thrust",
			"name" : "THRUST"
		},
		{
			"cardId" : "card_wormhole",
			"name" : "WORMHOLE"
		}
	],
	"name" : "Operations",
	"simulatorId" : "voyager"
}
*/
