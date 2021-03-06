function updateMacro(argumentName, value){
	var macro = Session.get('flint-macros-currentMacro');
	if (macro.arguments == undefined)
		macro.arguments = {};
	macro.arguments[argumentName] = value;
	Session.set('flint-macros-currentMacro',macro);
	var id = macro._id;
	delete macro._id;
	Flint.collection('flintMacroPresets').update({'_id':id},{$set:macro});
}

Template.macro_audioMatrixToggle.created = function(){
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
		Meteor.subscribe('flint-audiomatrix-bus');
		Meteor.subscribe('flint-audiomatrix-send');
	});
};
Template.macro_audioMatrixToggle.destroyed = function(){
	this.subscription.stop();
	Session.set('macro_audioMatrixToggle_matrix',null);
};

Template.macro_audioMatrixToggle.helpers({
	matrixList:function(){
		return Flint.collection('audioMatrix').find();
	},
	mixList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixMix').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	busList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixBus').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	matrixSelected:function(){
		if (this.matrixId === Session.get('flint-macros-currentMacro').arguments.matrixId || this._id === Session.get('flint-macros-currentMacro').arguments.matrixId)
			return 'selected';
	},
	mixSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.mixId)
			return 'selected';
	},
	busSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.busId)
			return 'selected';
	}
});

Template.macro_audioMatrixToggle.events({
	'change #matrix':function(e,t){
		Session.set('macro_audioMatrixToggle_matrix',e.target.value);
		updateMacro('matrixId',e.target.value);
	},
	'change #mix':function(e,t){
		updateMacro('mixId',e.target.value);
	},
	'change #bus':function(e,t){
		updateMacro('busId',e.target.value);
	}
});

Template.macro_audioMatrixState.created = function(){
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
		Meteor.subscribe('flint-audiomatrix-bus');
		Meteor.subscribe('flint-audiomatrix-send');
	});
};
Template.macro_audioMatrixState.destroyed = function(){
	this.subscription.stop();
	Session.set('macro_audioMatrixToggle_matrix',null);
};

Template.macro_audioMatrixState.helpers({
	matrixList:function(){
		return Flint.collection('audioMatrix').find();
	},
	mixList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixMix').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	busList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixBus').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	matrixSelected:function(){
		if (this.matrixId === Session.get('flint-macros-currentMacro').arguments.matrixId || this._id === Session.get('flint-macros-currentMacro').arguments.matrixId)
			return 'selected';
	},
	mixSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.mixId)
			return 'selected';
	},
	busSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.busId)
			return 'selected';
	}
});

Template.macro_audioMatrixState.events({
	'change #matrix':function(e){
		Session.set('macro_audioMatrixToggle_matrix',e.target.value);
		updateMacro('matrixId',e.target.value);
	},
	'change #mix':function(e){
		updateMacro('mixId',e.target.value);
	},
	'change #bus':function(e){
		updateMacro('busId',e.target.value);
	},
	'change #mute':function(e){
		updateMacro('state',e.target.checked);
	}
});

Template.macro_audioMatrixVolume.created = function(){
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
		Meteor.subscribe('flint-audiomatrix-bus');
	});
};
Template.macro_audioMatrixVolume.destroyed = function(){
	this.subscription.stop();
	Session.set('macro_audioMatrixToggle_matrix',null);
};

Template.macro_audioMatrixVolume.helpers({
	matrixList:function(){
		return Flint.collection('audioMatrix').find();
	},
	mixList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixMix').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	busList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixBus').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	matrixSelected:function(){
		if (this.matrixId === Session.get('flint-macros-currentMacro').arguments.matrixId || this._id === Session.get('flint-macros-currentMacro').arguments.matrixId)
			return 'selected';
	},
	mixSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.mixId)
			return 'selected';
	},
	busSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.busId)
			return 'selected';
	},
	volumeValue:function(){
		return Session.get('flint-macros-currentMacro').arguments.volume;
	}
});

Template.macro_audioMatrixVolume.events({
	'change #matrix':function(e,t){
		Session.set('macro_audioMatrixToggle_matrix',e.target.value);
		updateMacro('matrixId',e.target.value);
	},
	'change #mix':function(e,t){
		updateMacro('mixId',e.target.value);
	},
	'change #bus':function(e,t){
		updateMacro('busId',e.target.value);
	},
	'change #volume':function(e,t){
		updateMacro('volume',e.target.value);
	}
});

Template.macro_audioMatrixInputVolume.created = function(){
	this.subscription = Tracker.autorun(function () {
		Meteor.subscribe('flint-audiomatrix');
		Meteor.subscribe('flint-audiomatrix-mix');
	});
};
Template.macro_audioMatrixInputVolume.destroyed = function(){
	this.subscription.stop();
	Session.set('macro_audioMatrixToggle_matrix',null);
};

Template.macro_audioMatrixInputVolume.helpers({
	matrixList:function(){
		return Flint.collection('audioMatrix').find();
	},
	mixList:function(){
		if (Session.get('flint-macros-currentMacro').arguments.matrixId)
			return Flint.collection('audioMatrixMix').find({matrixId:Session.get('flint-macros-currentMacro').arguments.matrixId});
	},
	matrixSelected:function(){
		if (this.matrixId === Session.get('flint-macros-currentMacro').arguments.matrixId || this._id === Session.get('flint-macros-currentMacro').arguments.matrixId)
			return 'selected';
	},
	mixSelected:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.mixId)
			return 'selected';
	},
	volumeValue:function(){
		return Session.get('flint-macros-currentMacro').arguments.volume;
	}
});

Template.macro_audioMatrixInputVolume.events({
	'change #matrix':function(e,t){
		Session.set('macro_audioMatrixToggle_matrix',e.target.value);
		updateMacro('matrixId',e.target.value);
	},
	'change #mix':function(e,t){
		updateMacro('mixId',e.target.value);
	},
	'change #volume':function(e,t){
		updateMacro('volume',e.target.value);
	}
});