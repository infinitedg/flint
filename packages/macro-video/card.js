function updateMacro(argumentName, value){
	var macro = Session.get('flint-macros-currentMacro');
	var id;
	if (macro.arguments === undefined){
		macro.arguments = {};
	}
	macro.arguments[argumentName] = value;
	Session.set('flint-macros-currentMacro',macro);
	id = macro._id;
	delete macro._id;
	Flint.collection('flintMacroPresets').update({'_id':id},{$set:macro});
}

Template.macro_addVideoInput.created = function(){
	Meteor.subscribe('card.viewscreen.viewscreens',Flint.simulatorId());
};

Template.macro_addVideoInput.helpers({
	templates:function(){
		return Object.keys(Template).filter(function(e){
			return e.substring(0,10) === 'viewscreen';
		});
	},
	viewscreens:function(){
		return Flint.collection('viewscreens').find();
	},
	selectedViewscreen:function(){
		debugger;
		if (this._id === Session.get('flint-macros-currentMacro').arguments.viewscreenId){
			return 'selected';
		}
	},
	currentMacro:function(){
		return Session.get('flint-macros-currentMacro').arguments;
	},
	context:function(){
		return JSON.stringify(Session.get('flint-macros-currentMacro').arguments.template.context);
	},
	inputName:function(){
		return Session.get('flint-macros-currentMacro').arguments.name;
	},
	weight:function(){
		return Session.get('flint-macros-currentMacro').arguments.weight;
	},
	priorityChecked:function(priority){
		if (priority){
			if (Session.get('flint-macros-currentMacro').arguments.priority){
				return 'checked';
			}
		} else {
			if (!Session.get('flint-macros-currentMacro').arguments.priority){
				return 'checked';
			}
		}
	},
	selectedTemplate:function(){
		if (this.toString() === Session.get('flint-macros-currentMacro').arguments.template.name){
			return 'selected';
		}
	}
});

Template.macro_addVideoInput.events({
	'change input:not([name="context"])':function(e){
		var value = e.target.value;
		var name = e.target.name;
		if (value === 'false') value = false;
		updateMacro(name,value);
	},
	"change select[name='template']":function(e){
		var macro = Session.get('flint-macros-currentMacro');
		var value = e.target.value;
		var template = macro.arguments.template || {};
		template.name = value;
		updateMacro('template',template);
	},
	"change select[name='viewscreenId']":function(e){
		updateMacro('viewscreenId',e.target.value);
	},
	'change input[name="context"]':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		var value = e.target.value;
		var template = macro.arguments.template || {};
		template.context = JSON.parse(value);
		updateMacro('template',template);
	}
});

Template.macro_removeVideoInput.created = function(){
	Meteor.subscribe('card.viewscreen.viewscreens',Flint.simulatorId());
};

Template.macro_removeVideoInput.helpers({
	currentMacro:function(){
		return Session.get('flint-macros-currentMacro');
	},
	viewscreens:function(){
		return Flint.collection('viewscreens').find();
	},
	selectedViewscreen:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.viewscreenId){
			return 'selected';
		}
	},
});

Template.macro_removeVideoInput.events({
	'change input':function(e){
		var value = e.target.value;
		var name = e.target.name;
		updateMacro(name,value);
	},
	"change select[name='viewscreenId']":function(e){
		updateMacro('viewscreenId',e.target.value);
	},
});

Template.macro_pauseVideoInput.created = function(){
	Meteor.subscribe('card.viewscreen.viewscreens',Flint.simulatorId());
};

Template.macro_pauseVideoInput.helpers({
	currentMacro:function(){
		return Session.get('flint-macros-currentMacro');
	},
	viewscreens:function(){
		return Flint.collection('viewscreens').find();
	},
	selectedViewscreen:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.viewscreenId){
			return 'selected';
		}
	},
});

Template.macro_pauseVideoInput.events({
	'change input':function(e){
		var value = e.target.value;
		var name = e.target.name;
		updateMacro(name,value);
	},
	"change select[name='viewscreenId']":function(e){
		updateMacro('viewscreenId',e.target.value);
	},
});

Template.macro_removeAllVideoInput.created = function(){
	Meteor.subscribe('card.viewscreen.viewscreens',Flint.simulatorId());
};

Template.macro_removeAllVideoInput.helpers({
	viewscreens:function(){
		return Flint.collection('viewscreens').find();
	},
	selectedViewscreen:function(){
		if (this._id === Session.get('flint-macros-currentMacro').arguments.viewscreenId){
			return 'selected';
		}
	},
});

Template.macro_removeAllVideoInput.events({
	"change select[name='viewscreenId']":function(e){
		updateMacro('viewscreenId',e.target.value);
	},
});
