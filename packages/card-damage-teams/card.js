Template.card_damageTeams.helpers({
	workOrders:function(){
		return Flint.collection('workOrders').find({},{sort:{order:1}});
	},
	workOrdersCount:function(){
		return Flint.collection('workOrders').find().count() > 0;
	},
	attributesOptions:{
		onEnd: function (evt) {
			Flint.collection('workOrders').update({_id:evt.data._id},{$set:{order:evt.newIndex}});
		},
	}
});

Template.card_damageTeams.onCreated(function(){
	this.subscribe('damageControl.workOrders',Flint.simulatorId());
});

Template.workOrder_item.helpers({
	progress:function(){
		var output = Math.round(100 * this.elapsed / this.time);
		if (isNaN(output)){
			output = 0;
		}
		if (output > 100){
			output = 100;
		}
		return output;
	},
	progressStyle:function(){
		return this.state;
	}
});
