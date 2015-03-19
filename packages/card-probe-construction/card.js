var normalProbes;
var specialProbes;

Template.card_probeConstruction.helpers({
	normalProbes: function () {
		
	},
	specialProbes: function () {
		
	},
	probeWidth: function(){

	},
	launchingProbe: function(){

	},
	probeEquipment: function(){

	},
	currentProbe: function(){

	},
	equipmentDescription: function(){

	},
	loadedEquipment: function(){

	},
	probeDescription: function(){

	}
});


Template.card_probeConstruction.events({
	'click .probeTemplate': function () {

	},
	'click .probeEquipment': function(){

	},
	'click .loadedEquipment': function(){

	},
	'click .cancelProbe': function(){

	},
	'click .finishProbe': function(){

	},
	'click .launchProbe': function(){

	},
	'click .reconfig': function(){

	},
	'mousemove .normalProbes':function(){

	},
	'mousemove .specialProbes':function(){

	},
	'mousemove .probeEquipment':function(){

	},
});

Template.card_probeConstruction.created = function () {
	//I want these to be collections, but not necessarily
	//Stored collections. This will give scalability in the
	//Future. 
	normalProbes = new Mongo.Collection();
	specialProbes = new Mongo.Collection();

};