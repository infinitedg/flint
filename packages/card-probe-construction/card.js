Template.card_probeConstruction.helpers({
	normalProbes: function () {
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var selector = {};
			selector['metadata.type'] = "probe";
			selector['roomCount.' + probeRoom] = {$gt:0};
			selector['metadata.science'] = {$exists:false};
			selector['metadata.defense'] = {$exists:false};
			return Flint.collection('inventoryItems').find(selector);
		}
	},
	specialProbes: function () {
		if (Flint.collection('rooms').findOne({probeControl:true})){

			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var selector = {};
			selector['metadata.type'] = "probe";
			selector['roomCount.' + probeRoom] = {$gt:0};
			selector['$or'] = [{'metadata.science':{$exists:true}},{'metadata.defense':{$exists:true}}]
			return Flint.collection('inventoryItems').find(selector);
		}
	},
	normalProbeWidth: function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){

			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var selector = {};
			selector['metadata.type'] = "probe";
			selector['roomCount.' + probeRoom] = {$gt:0};
			selector['metadata.science'] = {$exists:false};
			selector['metadata.defense'] = {$exists:false};
			return Math.ceil(12/Flint.collection('inventoryItems').find(selector).count());
		}
	},
	specialProbeWidth: function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){

			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var selector = {};
			selector['metadata.type'] = "probe";
			selector['roomCount.' + probeRoom] = {$gt:0};
			selector['$or'] = [{'metadata.science':{$exists:true}},{'metadata.defense':{$exists:true}}]
			return Math.ceil(12/Flint.collection('inventoryItems').find(selector).count());
		}
	},
	launchingProbe: function(){

	},
	spaceUsed: function(){
		var equipment = this.metadata.equipment;
		var equipmentCount = 0;
		equipment.forEach(function(e){
			equipmentCount += e.metadata.size;
		})
		return equipmentCount;
	},
	spaceLeft: function(){
		var equipment = this.metadata.equipment;
		var equipmentCount = 0;
		equipment.forEach(function(e){
			equipmentCount += e.metadata.size;
		})
		return this.metadata.size - equipmentCount;
	},
	probeEquipment: function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var selector = {};
			selector['metadata.type'] = "probeEquipment";
			selector['roomCount.' + probeRoom] = {$gt:0};
			if (!Session.get('probeConstruction_currentProbe').metadata.science){
				selector['metadata.science'] = {$exists:false};
			}
			if (!Session.get('probeConstruction_currentProbe').metadata.defense){
				selector['metadata.defense'] = {$exists:false};
			}
			return Flint.collection('inventoryItems').find(selector);
		}
	},
	equipmentCount:function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			return this.roomCount[probeRoom];
		}
	},
	currentProbe: function(){
		return Session.get('probeConstruction_currentProbe');
	},
	equipmentDescription: function(){
		return Session.get('equipmentDescription');
	},
	loadedEquipment: function(){
		var probe = Session.get('probeConstruction_currentProbe');
		if (probe)
			return probe.metadata.equipment;
	},
	probeDescription: function(){
		return Session.get('probeDescription');
	}
});


Template.card_probeConstruction.events({
	'click .probeTemplate': function () {
		Session.set('probeConstruction_currentProbe',this);
	},
	'click .probeEquipment': function(){
		var probe = Session.get('probeConstruction_currentProbe');
		if (probe){
			if (!probe.metadata.equipment)
				probe.metadata.equipment = [];
			var equipment = probe.metadata.equipment;
			var equipmentCount = 0;
			equipment.forEach(function(e){
				equipmentCount += e.metadata.size;
			})
			var spaceLeft = probe.metadata.size - equipmentCount;
			if (spaceLeft - this.metadata.size >= 0){
				probe.metadata.equipment.push(this)
				Session.set('probeConstruction_currentProbe',probe);
			}
		}
	},
	'click .loadedEquipment': function(){
		var self = this;
		var probe = Session.get('probeConstruction_currentProbe');
		if (probe){
			if (probe.metadata.equipment){
				for (var i = probe.metadata.equipment.length - 1; i>=0; i--){
					if (self.name == probe.metadata.equipment[i].name){
						probe.metadata.equipment.splice(i,1);
						i=-1;
					}
				}
			}
			Session.set('probeConstruction_currentProbe',probe);
		}
	},
	'click .cancelProbe': function(){
		Session.set('probeConstruction_currentProbe',null);
	},
	'click .finishProbe': function(){

	},
	'click .launchProbe': function(){

	},
	'click .reconfig': function(){

	},
	'mouseenter .probeTemplate':function(e,t){
		Session.set('probeDescription',this.metadata.description);
	},
	'mouseleave .probeTemplate':function(){
		Session.set('probeDescription',null);
	},
	'mouseenter .probeEquipment':function(){
		Session.set('equipmentDescription',this.metadata.description);
	},
	'mouseleave .probeEquipment':function(){
		Session.set('equipmentDescription',null);
	}
});

Template.card_probeConstruction.created = function () {
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
		Meteor.subscribe('simulator.inventoryItems', Flint.simulatorId());
	});
};