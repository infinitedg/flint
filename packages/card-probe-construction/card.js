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
	probeName:function(){
		return this.name.replace(' Probe','');
	},
	probeCount:function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			return Flint.collection('inventoryItems').findOne(this._id).roomCount[probeRoom];
		}
	},
	probeSelected:function(){
		if (Session.get('probeConstruction_currentProbe')){
			if (typeof this._id == 'undefined')
				return 'probeSelected';
			if (this._id == Session.get('probeConstruction_currentProbe')._id)
				return 'probeSelected';
		}
	},
	launchingProbe: function(){
		return Session.get('probeConstruction_finishProbe')
	},
	spaceUsed: function(){
		var equipment = this.metadata.equipment;
		var equipmentCount = 0;
		if (typeof equipment == "undefined")
			return 0;
		equipment.forEach(function(e){
			equipmentCount += e.metadata.size;
		})
		return equipmentCount;
	},
	spaceLeft: function(){
		var equipment = this.metadata.equipment;
		var equipmentCount = 0;
		if (typeof equipment == "undefined")
			return this.metadata.size;
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
	'click .probeRow div': function () {
		if (!Session.get('probeConstruction_currentProbe'))
			Session.set('probeConstruction_currentProbe',this);
	},
	'click .probeEquipment': function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
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
				//We'll strip out the unecessary cruft
				var addingEquipment = {
					name:this.name,
					id:this._id,
					metadata:this.metadata
				}

				if (spaceLeft - this.metadata.size >= 0){
					probe.metadata.equipment.push(addingEquipment);
					Session.set('probeConstruction_currentProbe',probe);
					//Remove the equipment from the inventory list, since it is now inside of a probe
					equipment = Flint.collection('inventoryItems').findOne(this._id);
					equipment.roomCount[probeRoom] -= 1;
					var roomCount = equipment.roomCount;
					Flint.collection('inventoryItems').update({_id:this._id},{$set:{roomCount:roomCount}});
				}
			}
		}
	},
	'click .loadedEquipment': function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var self = this;
			var probe = Session.get('probeConstruction_currentProbe');
			if (probe){
				if (probe.metadata.equipment){
					for (var i = probe.metadata.equipment.length - 1; i>=0; i--){
						if (self.name == probe.metadata.equipment[i].name){
							probe.metadata.equipment.splice(i,1);
							//Make sure you add it back to the inventory
							equipment = Flint.collection('inventoryItems').findOne(self.id);
							equipment.roomCount[probeRoom] += 1;
							var roomCount = equipment.roomCount;
							Flint.collection('inventoryItems').update({_id:self.id},{$set:{roomCount:roomCount}});
							i=-1;
						}
					}
				}
				Session.set('probeConstruction_currentProbe',probe);

			}
		}
	},
	'click .cancelProbe': function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var self = this;
			var probe = Session.get('probeConstruction_currentProbe');
			if (probe){
				//Put all the equipment back
				probeEquipment = probe.metadata.equipment;
				if (typeof probeEquipment == 'object'){
					probeEquipment.forEach(function(e){
						equipment = Flint.collection('inventoryItems').findOne(e.id);
						equipment.roomCount[probeRoom] += 1;
						var roomCount = equipment.roomCount;
						Flint.collection('inventoryItems').update({_id:e.id},{$set:{roomCount:roomCount}});
					})
				}
			}

		}
		Session.set('probeConstruction_currentProbe',null);
		Session.set('probeConstruction_finishProbe',null);
	},
	'click .finishProbe': function(){
		Session.set('probeConstruction_finishProbe',Session.get('probeConstruction_currentProbe'));
	},
	'click .launchProbe': function(){
		if (Flint.collection('rooms').findOne({probeControl:true})){
			var probeRoom = Flint.collection('rooms').findOne({probeControl:true})._id;
			var probe = Session.get('probeConstruction_finishProbe');
			//Create the object we are inserting into the Probes collection
			var probeObj = {
				type: probe.name,
				equipment: probe.metadata.equipment,
				image: probe.metadata.image,
				simulatorId: Flint.simulatorId()
			}
			//Add an identifier and insert it
			bootbox.prompt("What will the identification of this probe be?",function(a){
				if (!a)
					return false;
				probeObj.name = a;
				Flint.collection('probes').insert(probeObj);
				//Now remove the item from inventory and reset the card.
				Session.set('probeConstruction_currentProbe',null);
				Session.set('probeConstruction_finishProbe',null);
				var probeInv = Flint.collection('inventoryItems').findOne({_id:probe._id});
				var roomCount = probeInv.roomCount;
				roomCount[probeRoom] -= 1;
				Flint.collection('inventoryItems').update({_id:probe._id},{$set:{roomCount:roomCount}});
			});
			
		}
	},
	'click .reconfig': function(){
		Session.set('probeConstruction_finishProbe',null);
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
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('simulator.rooms', Flint.simulatorId());
		Meteor.subscribe('simulator.inventoryItems', Flint.simulatorId());
		Meteor.subscribe('cards.probes', Flint.simulatorId());
	});
};