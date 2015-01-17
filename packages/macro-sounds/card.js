Template.macro_playSound.helpers({
	'soundList':function(){
		var folder = Flint.Asset.listFolder('/Sounds');
		return folder.containers;
	},
	'soundSelected':function(){
			var macro = Session.get('flint-macros-currentMacro');
			if  (macro.arguments != undefined){
				if (macro.arguments.assetKey == '/Sounds/' + this.name){
					return 'selected';
				}
			}

	},
	'soundGroups':function(){

	}
})
function updateMacro(argumentName, value){
	var macro = Session.get('flint-macros-currentMacro');
	if (macro.arguments == undefined)
		macro.arguments = {};
	macro.arguments[argumentName] = value;
	Session.set('flint-macros-currentMacro',macro);
	Flint.collection('flintMacroPresets').update({'_id':macro._id},macro);
}
Template.macro_playSound.events({
	'change #soundName':function(e,t){
		updateMacro('assetKey','/Sounds/' + e.target.value);
	},
	'click #loop':function(e,t){
		updateMacro('looping',e.target.checked);
	},
	'change #volume':function(e){
		updateMacro('volume',e.target.value);
	},
	'change #delay':function(e){
		updateMacro('delay',e.target.value);
	}
})
