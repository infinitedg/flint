Meteor.publish('cards.core-targetingGrid.armies', function(simulatorId) {
	return Flint.collection('armyTarget').find({ simulatorId: simulatorId});
});
Meteor.publish('cards.core-targetingGrid.targets',function(simulatorId){
	return Flint.collection('targetContacts').find({simulatorId:simulatorId});
})

//this observer fixes a bug with falsey values
this.targetObserverFix = Flint.collection('armyTarget').find().observe({
	changed: function(doc){
		if (doc.count == 0){
			Flint.collection('armyTarget').update({_id:doc._id},{$set:{count:-1}});
		}
	}
})
this.targetObserver = Flint.collection('armyTarget').find().observeChanges({
	added: function(id, doc){
		if (doc.count < 0) doc.count = 0;
		var counter = Flint.collection('targetContacts').find({armyId:id}).count();
		if (counter > doc.count) {
			for (var i = counter; i > doc.count; i--){
				var _id = Flint.collection('targetContacts').findOne({armyId:id})._id;
				Flint.collection('targetContacts').remove({_id:_id});
			}
		}
		if (counter < doc.count) {
			var doc = Flint.collection('armyTarget').findOne({_id:id});
			for (var i = counter; i < doc.count; i++){
				Flint.collection('targetContacts').insert({
					armyId:id,
					targeted: false,
					icon:doc.icon,
					label:doc.label,
					color:doc.color,
					simulatorId: doc.simulatorId
				})
			}
		}
	},
	changed: function(id, fields){
		console.log(fields);
		if (fields.count){
			if (fields.count < 0) fields.count = 0;
			var counter = Flint.collection('targetContacts').find({armyId:id}).count();
			if (counter > fields.count) {
				for (var i = counter; i > fields.count; i--){
					var _id = Flint.collection('targetContacts').findOne({armyId:id})._id;
					Flint.collection('targetContacts').remove({_id:_id});
				}
			}
			if (counter < fields.count) {
				var doc = Flint.collection('armyTarget').findOne({_id:id});
				for (var i = counter; i < fields.count; i++){
					Flint.collection('targetContacts').insert({
						armyId:id,
						targeted: false,
						icon:doc.icon,
						label:doc.label,
						color:doc.color,
						simulatorId: doc.simulatorId
					})
				}
			}
		}
		if (fields.icon){
			Flint.collection('targetContacts').update({armyId:id},
				{$set:{icon:fields.icon}});
		}
		if (fields.label){
			Flint.collection('targetContacts').update({armyId:id},
				{$set:{label:fields.label}});
		}
		if (fields.color){
			Flint.collection('targetContacts').update({armyId:id},
				{$set:{color:fields.color}});
		}
	},
	removed: function(id){
		Flint.collection('targetContacts').remove({armyId:id});
	}
})

