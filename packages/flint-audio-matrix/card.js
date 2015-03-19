Template.card_audio_matrix.created = function(){
	this.subscription = Deps.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
		Meteor.subscribe('flint-audiomatrix-bus');
		Meteor.subscribe('flint-audiomatrix-send');
	});
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
	}
})