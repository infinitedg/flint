var coolantAdjust = 0.4;

Template.coolantTank.helpers({
	coolantHeight: function() {
		return Flint.simulator('coolant');
	},
	coolantDestinations:function(){
		return Flint.systems.find({coolant:{$exists: true}});
	},
	running:function(){
		if (Session.get('coolantMoving')){
			return 'running';
		}
	}
});

Template.coolantTank.events({
	'mousedown .decreaseCoolant':function(){
		var self = this;
		Meteor.clearInterval(Template.instance().coolantInterval);
		Session.set('coolantMoving',true);
		Template.instance().coolantInterval = Meteor.setInterval(function(){
			var maxTank = Flint.simulator('maxCoolant') || 100;
			var tank = Flint.simulator('coolant') || maxTank;
			var maxCoolant = Flint.systems.findOne({_id:self._id}).maxCoolant || 100;
			var coolant = Flint.systems.findOne({_id:self._id}).coolant || maxCoolant;
			if (tank + coolantAdjust <= maxTank
				&& coolant - coolantAdjust >= 0){
				Flint.simulator('coolant',tank + coolantAdjust);
			Flint.systems.update({_id:self._id},{$set:{coolant:coolant - coolantAdjust}});
		} else {
			Meteor.clearInterval(Template.instance().coolantInterval);
			Session.set('coolantMoving',false);
		}
	},40);
	},
	'mousedown .increaseCoolant':function(){
		var self = this;
		Meteor.clearInterval(Template.instance().coolantInterval);
		Session.set('coolantMoving',true);
		Template.instance().coolantInterval = Meteor.setInterval(function(){
			var maxTank = Flint.simulator('maxCoolant') || 100;
			var tank = Flint.simulator('coolant') || maxTank;
			var maxCoolant = Flint.systems.findOne({_id:self._id}).maxCoolant || 100;
			var coolant = Flint.systems.findOne({_id:self._id}).coolant || maxCoolant;
			if (tank - coolantAdjust >= 0
				&& coolant + coolantAdjust <= maxCoolant){
				Flint.simulator('coolant',tank - coolantAdjust);
			Flint.systems.update({_id:self._id},{$set:{coolant:coolant + coolantAdjust}});
		} else {
			Meteor.clearInterval(Template.instance().coolantInterval);
			Session.set('coolantMoving',false);
		}
	},40);
	},
	'mouseup .btn':function(){
		Meteor.clearInterval(Template.instance().coolantInterval);
		Session.set('coolantMoving',false);
	},
});
