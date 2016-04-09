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

Template.macro_setVocoderPitch.helpers({
	pitch: function(){
		return Session.get('flint-macros-currentMacro').arguments.pitch;
	}
})
Template.macro_setVocoderPitch.events({
	'change #pitch':function(e){
		updateMacro('pitch',e.target.value);
	},
})