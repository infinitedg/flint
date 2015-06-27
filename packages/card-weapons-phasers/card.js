Template.card_phasers.created = function(){
	this.subscription = Deps.autorun(function() {
		Meteor.subscribe('card-weapons-phasers', Flint.simulatorId());
	});
};

Template.card_phasers.rendered = function(){
	Session.set('currentPhaser','');
};

Template.card_phasers.helpers({
	phasers: function(){
		return Flint.collection('phasers').find();
	},
	phaserNumber:function(){
		if (typeof Session.get('currentPhaser') == "object"){
			return Session.get("currentPhaser").number;
		}
	},
	phaserEnergy:function(){
		return "width:" + this.charge + "%;";
	},
	selectedPhaser:function(){
		if ('_id' in Session.get('currentPhaser')){
			if (this._id == Session.get('currentPhaser')._id){
				return "selectedPhaser";
			}
		}
	}
});
Template.card_phasers.events({
	'click .phaserSelector':function(e,t){
		Session.set('currentPhaser',this);
	},
	'click .dischargeOne':function(e,t){
		if ('_id' in Session.get('currentPhaser')){
			Flint.tween('phasers',Session.get('currentPhaser')._id,0.5,{'charge':0, 'overwrite':'concurrent'});
		}
	},
	'click .chargeOne':function(e,t){
		if ('_id' in Session.get('currentPhaser')){
			Flint.tween('phasers',Session.get('currentPhaser')._id,2,{'charge':100, 'overwrite':'concurrent'});
		}
	},
	'click .dischargeAll':function(e,t){
		var counter = 0;
		Flint.collection('phasers').find().forEach(function(e){
			Flint.tween('phasers',e._id,0.5,{'charge':0, 'delay':counter, 'overwrite':'concurrent'});
			counter += 0.5;

		});

	},
	'click .chargeAll':function(e,t){
		var counter = 0;
		Flint.collection('phasers').find().forEach(function(e){
			Flint.tween('phasers',e._id,2,{'charge':100, 'delay':counter, 'overwrite':'concurrent'});
			counter += 1;
		});
	}
});
