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

Template.macro_addVideoInput.helpers({
	templates:function(){
		return Object.keys(Template);
	},
	currentMacro:function(){
		return Session.get('flint-macros-currentMacro');
	},
});

Template.macro_addVideoInput.events({
	'change input:not([name="context"])':function(e){
		var value = e.target.value;
		var name = e.target.name;
		updateMacro(name,value);
	},
	"change select":function(e){
		var macro = Session.get('flint-macros-currentMacro');
		var value = e.target.value;
		var template = macro.arguments.template || {};
		template.name = value;
		updateMacro('template',template);
	},
	'change input[name="context"]':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		var value = e.target.value;
		var template = macro.arguments.template || {};
		template.context = JSON.parse(value);
		updateMacro('template',template);
	}
});

Template.macro_removeVideoInput.helpers({
	currentMacro:function(){
		return Session.get('flint-macros-currentMacro');
	},
});

Template.macro_removeVideoInput.events({
	'change input':function(e){
		var value = e.target.value;
		var name = e.target.name;
		updateMacro(name,value);
	},
});
