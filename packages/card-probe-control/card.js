Template.card_probeControl.created = function(){
	this.subscription = Deps.autorun(function(){
		Meteor.subscribe('cards.probes',Flint.simulatorId());
	})
	Session.setDefault('probeControl_currentTab','navigation')
}
Template.card_probeControl.helpers({
	probes:function(){
		return Flint.collection('probes').find();
	},
	selectedProbe:function(){
		return Flint.collection('probes').findOne({_id:Session.get('probeControl_currentProbe')});
	},
	activeTab:function(a){
		if (Session.get('probeControl_currentTab') == a)
			return 'active';
	},
	activeTabTemplate:function(){
		return 'probeTab_' + Session.get('probeControl_currentTab');
	}
})

Template.card_probeControl.events({
	'click .probe':function(){
		Session.set('probeControl_currentProbe',this._id);
	},
	'click .tabBtn':function(e,t){
		Session.set('probeControl_currentTab',e.target.dataset.tab);
	}
})

Template.probeTab_navigation.helpers({
	currentSpeed:function(){

	},
	desiredCoordinates:function(){

	},
	currentCoordinates:function(){

	}
})

Template.probeTab_actions.helpers({
	probeEquipment:function(){
		if (Flint.collection('probes').findOne({_id:Session.get('probeControl_currentProbe')}))
			return Flint.collection('probes').findOne({_id:Session.get('probeControl_currentProbe')}).equipment;
	},
})