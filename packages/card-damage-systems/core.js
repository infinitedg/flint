Template.core_workOrders.helpers({
	workOrder:function(){
		return Flint.collection('workOrders').find({},{sort:{order:1}});
	},
	systems:function(){
		return Flint.systems.find();
	},
	isDiagnostic:function(){
		return this.maintenance.diagnostic === 'progress' || this.maintenance.diagnostic === 'complete';
	},
	systemTime:function(){
		return this.time || '?';
	}
});

Template.core_workOrders.events({
	'click .time':function(){

	},
	'click .systemTime':function(){
		var system = Flint.systems.findOne({_id:this._id});
		var maintenance = system.maintenance || {};
		maintenance.diagnostic = 'complete';
		maintenance.report = '<h1>REPORT</h1>'
		maintenance.time = 300;
		Flint.systems.update({_id:this._id},{$set:{maintenance:maintenance}});
		//TODO: Bootbox which accepts seconds and minutes:seconds
	}
});

Template.core_workOrders.onCreated(function(){
	this.subscribe('damageControl.workOrders',Flint.simulatorId());
});
