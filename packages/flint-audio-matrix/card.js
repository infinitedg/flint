Template.card_audio_matrix.created = function(){
	this.subscription = Deps.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
		Meteor.subscribe('flint-audiomatrix-bus');
		Meteor.subscribe('flint-audiomatrix-send');
	});
	Session.setDefault('audiomatrix_selectedInput')
}
Template.card_audio_matrix.destroyed = function(){
	this.subscription.stop();
}
Template.card_audio_matrix.helpers({
	input:function(){
		return Flint.collection('AudioMatrixMix').find();
	},
	output: function(){
		return Flint.collection('AudioMatrixBus').find();
	},
	intersectActive:function(a){
		var intersection = Flint.collection('AudioMatrixSend').findOne({
			mixId:this._id,
			busId:a._id
		})
		if (typeof intersection != "undefined"){
			if (intersection.mute == 0){
				return 'selected';
			}
		}
	},
	uuid:function(){
		return Random.id();
	},
	selectedInput:function(){
		var input = Session.get('audiomatrix_selectedInput');
		return input;
	},
	equalizer:function(){
		if (Session.get('audiomatrix_selectedInput'))
			var output = Session.get('audiomatrix_selectedInput');
		else
			var output = Session.get('audiomatrix_selectedOutput');
		return output;
	},
	rotation: function(){
		return Session.get('dragLoc');
	}
})
Template.card_audio_matrix.events({
	"dblclick .intersection":function(e,t){
		var busId = e.target.dataset.busid;
		var intersection = Flint.collection('AudioMatrixSend').findOne({
			mixId:this._id,
			busId:busId
		})
		var mute;
		if (intersection.mute == 0){
			mute = 1;
		} else {
			mute = 0;
		}
		Flint.collection('AudioMatrixSend').update({_id:intersection._id}, {$set: {mute:mute}});
	},
	"click .intersection":function(e,t){
		var id = e.target.id;
		$('.intersection').popover('hide');
		$('#' + id).popover('show');
	},
	'click .inputLabel':function(){
		Session.set('audiomatrix_selectedInput',this);
		Session.set('audiomatrix_selectedOutput',null)
	},
	'click .outputLabel':function(){
		Session.set('audiomatrix_selectedOutput',this)
		Session.set('audiomatrix_selectedInput',null);
	}

})

function rangeConvert(value,min,max){
	//This function converts the db value to the rotation value of the rotary dial
	//First, normalize the value
	value = (value - min)/(max - min);
	//Convert it to a 280 scale
	value = value*280;
	//Subtract 140
	value = value-140;

	return value
}
function valueConvert(value,min,max){
	//This function converts the rotation value to the db value
	//Add 140
	value = value + 140;
	//Normalize the value;
	value = value/280;
	//Convert it out based on the min and max values;
	value = (value*(max-min)) + min;

	return value;
}
Template.rotary_dial.rendered = function(){
	var self = this;
	Draggable.create("#" + this.data.fx + "_" + this.data.param, {
		type:"rotation",
		bounds:{
			minRotation:-140, 
			maxRotation:140
		},
		onDrag:function(){
			Session.set('dragLoc',valueConvert(this.rotation,self.data.min,self.data.max));
		}
	});
	TweenMax.set("#" + this.data.fx + "_" + this.data.param,{rotation:rangeConvert(self.data.value,self.data.min,self.data.max)});
	Draggable.get("#" + this.data.fx + "_" + this.data.param).update();
}
Template.enable_btn.helpers({
	active:function(){
		debugger;
		if (this.data.enable == 1){
			return 'active';
		}
	}
})
Template.enable_btn.events({
	'click .btn':function(e){
		debugger;
		if (Session.get('audiomatrix_selectedInput')){
			var output = Session.get('audiomatrix_selectedInput');
			if (output){
				var updateKey = this.fx;
				var update = output[this.fx];
				if(update.enable == "1")
					update.enable = "0";
				else
					update.enable = "1";
				Flint.collection('audiomatrixmix').update({_id:output._id},{$set:{updateKey:update}});
			}
		} else {
			var output = Session.get('audiomatrix_selectedOutput');
			if (output){
				var updateKey = this.fx;
				var update = output[this.fx] || {};
				if(update.enable == "1")
					update.enable = "0";
				else
					update.enable = "1";
				Flint.collection('audiomatrixbus').update({_id:output._id},{$set:{updateKey:update}});
			}
		}
	}
})