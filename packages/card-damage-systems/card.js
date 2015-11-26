Template.card_damage_systems.helpers({
	system:function(){
		var which = Session.get('damage_systems-currentTab');
		return Flint.systems.find({category:which});
	},
});

Template.card_damage_systems_tab.events({
	'click .tab':function(){
		Session.set('damage_systems-currentTab', this.title);
	}
});

Template.card_damage_systems_tab.helpers({
	active:function(){
		if (this.title === Session.get('damage_systems-currentTab')){
			return 'active';
		}
	}
});
Template.card_damage_systems.created = function(){
	Session.set('damage_systems-currentTab', 'Primary');
};

Template.card_damage_systems_tile.events({
	'click .diagnose':function(){
		var system = Flint.systems.findOne({_id:this._id});
		var maintenance = system.maintenance || {};
		if (maintenance.diagnostic === 'idle' || !maintenance.diagnostic || maintenance.diagnostic === 'progress'){
			maintenance.diagnostic = 'progress';
			Flint.systems.update({_id:this._id},{$set:{maintenance:maintenance}});
		}
		if (maintenance.diagnostic === 'complete'){
			Session.set('damage_systems-currentReportSystem',this._id);
			//Flint.systems.update({_id:this._id},{$set:{diagnostic:'orderSent'}});
		}
	}
});
Template.card_damage_systems_tile.helpers({
	diagnosticState:function(){
		if (this.maintenance.diagnostic === 'idle' || !this.maintenance.diagnostic || this.maintenance.diagnostic === 'progress'){
			return 'btn-primary';
		} else {
			return 'btn-warning';
		}
	},
	disabled:function(){
		if (this.maintenance.diagnostic === 'progress' || this.maintenance.diagnostic === 'orderSent'){
			return 'disabled';
		}
	},
	diagnosticLabel:function(){
		if (this.maintenance.diagnostic === 'idle' || !this.maintenance.diagnostic){
			return 'Run Diagnostic';
		}
		if (this.maintenance.diagnostic === 'progress'){
			return 'In Progress...';
		}
		if (this.maintenance.diagnostic === 'orderSent'){
			return 'Order Sent';
		}
		if (this.maintenance.diagnostic === 'complete'){
			return 'View Work Order';
		}
	},
	systemImage:function(){
		return 'https://infinitedev-flint.s3.amazonaws.com/flintassets/xfNRX3Kb9Cp4pYi4t-flintassets-zckr6cCsbfzF5YFeH-flintassets-E2k4ewQA7RPJGhnGh-Vanguard.png'
	}
});

Template.card_damage_systems_diagnosticReport.helpers({
	currentReport:function(){
		var system = Flint.systems.findOne({_id:Session.get('damage_systems-currentReportSystem')}) || {};
		var maintenance = system.maintenance || {};
		if (maintenance){
			return maintenance.report;
		}
	}
});
Template.card_damage_systems_diagnosticReport.events({
	'click .createOrder':function(){
		var system = Flint.systems.findOne({_id:Session.get('damage_systems-currentReportSystem')});
		var maintenance = system.maintenance || {};
		var obj;
		maintenance.diagnostic = 'orderSent';
		Flint.systems.update({_id:Session.get('damage_systems-currentReportSystem')},{$set:{
			maintenance:maintenance,
		}
	});
		Session.set('damage_systems-currentReportSystem',null);
		obj = {
			simulatorId:Flint.simulatorId(),
			system:system.name,
			system_id:system._id,
			elapsed:0,
			time:maintenance.time,
			order:100,
			state:'idle'
		};
		Flint.collection('workOrders').insert(obj);
	},
	'click .resetDiagnostic':function(){
		var system = Flint.systems.findOne({_id:Session.get('damage_systems-currentReportSystem')});
		var maintenance = system.maintenance || {};
		maintenance.diagnostic = 'idle';
		maintenance.report = null;
		Session.set('damage_systems-currentReportSystem',null);
		Flint.systems.update({_id:Session.get('damage_systems-currentReportSystem')},system);
	}
});

