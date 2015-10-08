Template.macro_flint_ambiance.created = function(){
	this.subscription = Tracker.autorun(function(){
		Meteor.subscribe('flint-audiomatrix-bus');
		Meteor.subscribe('flint-ambiance');
	});
};

Template.macro_flint_ambiance.destroyed = function(){
	this.subscription.stop();
};

Template.macro_flint_ambiance.helpers({
	ambianceTrack:function(){
		return Flint.collection('flintambiance').find();
	},
	ambianceSounds:function(){
		var folder = Flint.Asset.listFolder('/Sounds/Ambiance');
		return folder.containers;
	},
	audioGroup:function(){
		return Flint.collection('AudioMatrixBus').find();
	},
	soundSelected:function(id){
		if (id === this.fullPath){
			return true;
		}
		return false;
	},
	audioChecked:function(audioGroups){
		if (audioGroups.indexOf(this._id) >= 0){
			return true;
		}
		return false;
	}
});

Template.macro_flint_ambiance.events({
	'click .removeAmbiance':function(){
		Flint.collection('flintambiance').remove({_id:this._id});
	},
	'click .addAmbiance':function(){
		var obj = {
			name:null,
			sound:null,
			volume:100,
			audioGroups:[],
		};
		Flint.collection('flintambiance').insert(obj);
	},
	'change [data-key]':function(e){
		var obj = {};
		obj[e.target.dataset.key] = e.target.value;
		Flint.collection('flintambiance').update({_id:this._id},
			{$set:obj});
	},
	'click [type="checkbox"]':function(e){
		var ambTrack = Flint.collection('flintambiance').findOne({_id:e.target.dataset.ambid});
		if (ambTrack){
			var audioGroups = ambTrack.audioGroups;
			if (!e.target.checked){
				audioGroups.splice(1, audioGroups.indexOf(this._id));
			} else {
				audioGroups.push(this._id);
			}
			Flint.collection('flintambiance').update({_id:ambTrack._id}, {$set:{audioGroups:audioGroups}});
		}
	}
});
