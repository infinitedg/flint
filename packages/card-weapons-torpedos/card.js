Template.card_torpedos.created = function(){
	this.subscription = Tracker.autorun(function() {
		Meteor.subscribe('card-weapons-torpedos', Flint.simulatorId());
	});
}
Template.card_torpedos.rendered = function(){

}
Template.card_torpedos.helpers({
	photonCount: function(){
		var output = [];
		for (var i = 0; i < Flint.system('Torpedo Launchers','photonCount'); i++){
			output.push(i);
		}
		return output;
	},
	quantumCount: function(){
		var output = [];
		for (var i = 0; i < Flint.system('Torpedo Launchers','quantumCount'); i++){
			output.push(i);
		}
		return output;
	},
	probeCount: function(){
		var output = [];
		for (var i = 0; i < Flint.system('Torpedo Launchers','probeCount'); i++){
			output.push(i);
		}
		return output;
	},
	torpedoLaunchers:function(){
		return Flint.collection('torpedos').find();
	},
	selectedLauncher:function(){
		if (this._id == Session.get('selectedLauncher')){
			return 'selected';
		}
	},
	launcherPicked:function(){
		if (Session.get('selectedLauncher')){
			return 'true';
		}
	},
	prepDisabled:function(){
		if (Session.get('prepDisabled'))
			return 'disabled';
	},
	prepLabel: function(e,t){
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'unprepared')
				return 'Prepare Casing';
			else if (selectedTorpedo.state == 'prepared')
				return 'Return Torpedo';
			else if (selectedTorpedo.state == 'loaded')
				return 'Unload Torpedo';
			else return '--';
		}
	},
	fireDisabled:function(){
		if (Session.get('fireDisabled'))
			return 'disabled';
	},
	fireLabel: function(e,t){
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'unprepared')
				return '--';
			else if (selectedTorpedo.state == 'prepared')
				return 'Load Torpedo';
			else if (selectedTorpedo.state == 'loaded')
				return 'Fire Torpedo';
			else return '--';
		}
	},

	casingCount:function(){
		return Flint.system('Torpedo Launchers','casingCount');
	}
});

Template.card_torpedos.events({
	'click .prepareCasing':function(){
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'unprepared'){
				var casingCount = Flint.system('Torpedo Launchers','casingCount');
				Flint.system('Torpedo Launchers','casingCount',casingCount - 1);
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'prepared'}});
				Session.set('prepDisabled',true);
				Session.set('fireDisabled',true);
				Meteor.setTimeout(function(){
					Session.set('prepDisabled',false);
					Session.set('fireDisabled',false);
				},3000);
			}
			if (selectedTorpedo.state == 'prepared'){
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'unprepared'}});
				var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
				var payload = selectedTorpedo.payload;
				var payloadCount = Flint.system('Torpedo Launchers',(payload + "Count"));
				Flint.system('Torpedo Launchers',(payload + "Count"),payloadCount + 1)
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{payload:null}});
				var casingCount = Flint.system('Torpedo Launchers','casingCount');
				Flint.system('Torpedo Launchers','casingCount',casingCount + 1);
				Session.set('prepDisabled',true);
				Session.set('fireDisabled',true);
				Meteor.setTimeout(function(){
					Session.set('prepDisabled',false);
					Session.set('fireDisabled',false);
				},3000);
			}
			if (selectedTorpedo.state == 'loaded'){
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'prepared'}});
				Session.set('prepDisabled',true);
				Session.set('fireDisabled',true);
				Meteor.setTimeout(function(){
					Session.set('prepDisabled',false);
					Session.set('fireDisabled',false);
				},3000);
			}
		}
	},
	'click .fireTorpedo':function(){
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'prepared'){
				Session.set('prepDisabled',true);
				Session.set('fireDisabled',true);
				Meteor.setTimeout(function(){
					Session.set('prepDisabled',false);
					Session.set('fireDisabled',false);
				},3000);
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'loaded'}});
			}
			if (selectedTorpedo.state == 'loaded'){
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'fired'}});
				Meteor.setTimeout(function(){
					Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{payload:null}});
					Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'transition'}});
				},2000);
				Meteor.setTimeout(function(){
					Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{state:'unprepared'}});
				},3000);
				Session.set('prepDisabled',true);
				Session.set('fireDisabled',true);
				Meteor.setTimeout(function(){
					Session.set('prepDisabled',false);
					Session.set('fireDisabled',false);
				},3000);
			}
		}
	},
	'click .warhead':function(e,t){
		var type = e.currentTarget.dataset.type;
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'prepared'){
				var payloadCount = Flint.system('Torpedo Launchers',(type + "Count"));
				Flint.system('Torpedo Launchers',(type + "Count"),payloadCount - 1)
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{payload:type}});
			}
		}
	},
	'change #launcherSelect':function(e,t){
		Session.set('selectedLauncher',e.target.value);
	}
})

Template.casing.helpers({
	payload: function(){
		var selectedLauncher = Session.get('selectedLauncher');
		var selectedTorpedo = Flint.collection('torpedos').findOne(selectedLauncher);
		if (selectedTorpedo){
			return selectedTorpedo.payload + "Payload";
		}
	},
	casingState:function(){
		var selectedLauncher = Session.get('selectedLauncher');
		var selectedTorpedo = Flint.collection('torpedos').findOne(selectedLauncher);
		if (selectedTorpedo){
			return selectedTorpedo.state;
		}
	}
})

Template.casing.events({
	'click .warheadLg': function(){
		var selectedTorpedo = Flint.collection('torpedos').findOne(Session.get('selectedLauncher'));
		if (selectedTorpedo){
			if (selectedTorpedo.state == 'prepared'){
				var payload = selectedTorpedo.payload;
				var payloadCount = Flint.system('Torpedo Launchers',(payload + "Count"));
				Flint.system('Torpedo Launchers',(payload + "Count"),payloadCount + 1)
				Flint.collection('torpedos').update({_id:selectedTorpedo._id},{$set:{payload:null}});
			}
		}
	}
})