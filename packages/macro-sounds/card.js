function updateMacro(argumentName, value){
	var macro = Session.get('flint-macros-currentMacro');
	if (macro.arguments == undefined)
		macro.arguments = {};
	macro.arguments[argumentName] = value;
	Session.set('flint-macros-currentMacro',macro);
	Flint.collection('flintMacroPresets').update({'_id':macro._id},macro);
}
Template.macro_playSound.helpers({
	'soundList':function(){
		var folder = Flint.Asset.listFolder('/Sounds');
		return folder.containers;
	},
	'soundSelected':function(){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			if  (macro.arguments != undefined){
				if (macro.arguments.assetKey == '/Sounds/' + this.name){
					return 'selected';
				}
			}
		}

	},
	'soundGroups':function(){

	}
})
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

Template.macro_playRandomSound.helpers({
	'soundList':function(){
		var folder = Flint.Asset.listFolder('/Sounds');
		return folder.containers;
	},
	'soundSelected':function(e,t){

	},
	'randomSounds':function(){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			if (typeof macro.arguments.randomSounds != "object"){
				macro.arguments.randomSounds = [];
				updateMacro('randomSounds',macro.arguments.randomSounds);
			}
			return Session.get('flint-macros-currentMacro').arguments.randomSounds;
		}
	}
})
Template.macro_playRandomSound.events({
	'click .removeSound':function(e,t){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			if (typeof macro.arguments.randomSounds == "object"){
				for (i = macro.arguments.randomSounds.length-1; i >= 0; i--){
					if (macro.arguments.randomSounds[i].id == this.id){
						macro.arguments.randomSounds.splice(i,1);
					}
				}
				updateMacro('randomSounds',macro.arguments.randomSounds);
			}
		}

	},
	'change #soundName':function(e,t){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro != undefined){
			if (typeof macro.arguments.randomSounds == "object"){
				macro.arguments.randomSounds.push({id:Random.id(),name: e.target.value,assetKey:'/Sounds/' + e.target.value});
				updateMacro('randomSounds',macro.arguments.randomSounds);
			}
		}
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