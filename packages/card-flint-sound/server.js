Meteor.methods({
	cancelSounds: function(simulatorId){
		Flint.collection('flintSounds').remove({'simulatorId' : simulatorId,'type' : {$ne:'ambiance'}});
	},
	runMacroHIDKey:function (key,mods,simulator){
		var modifiers = {meta: mods.l_meta || mods.r_meta, alt: mods.l_alt || mods.r_alt, shift: mods.l_shift || mods.r_shift, control: mods.l_control || mods.r_control,};// caps:Session.get('soundKeyboard-capsKey')};
		Flint.collection('flintMacroKeys').find({'hidkey':key, 'set':Flint.simulators.findOne({_id:simulator}).macroSet}).forEach(function(macroKey){
			if (JSON.stringify(macroKey.modifiers) == JSON.stringify(modifiers)){
				Flint.collection('flintMacroPresets').find({'key':macroKey._id}).forEach(function(doc){
					doc.arguments.soundGroups = ['preview'];
					var keyPressed = false;
					var removeKeys = [];
					if (doc.arguments.looping){
						/*if (typeof Flint.station("savedKeys") == "object"){
							for (keysPressed in Flint.station("savedKeys")){
								var e = Flint.station("savedKeys")[keysPressed];
								if (e.key == macroKey.key && JSON.stringify(e.modifiers) == JSON.stringify(macroKey.modifiers))
									keyPressed = true;
								removeKeys.push(keysPressed);
							}
						}*/
						if (keyPressed){
							var savedKeys = Flint.station("savedKeys");
							removeKeys.forEach(function(e){
								savedKeys.splice(e,1);
							});
							Flint.station('savedKeys',savedKeys);
							doc.arguments.cancelMacro = true;
						}
						var savedKey = {key: macroKey.key, modifiers:macroKey.modifiers};
						doc.arguments.keyPressed = savedKey;
						if (!keyPressed){
							var keys = Flint.station("savedKeys") || [];
							keys.push(savedKey);
							Flint.station("savedKeys",keys);
						}
					}
					if (!doc.simulatorId) {
						doc.arguments.simulatorId = simulator;
					}
					//if (!doc.stationId){
					//	doc.arguments.stationId = Flint.station('_id');
					//}
					console.log(doc);
					Flint.macro(doc.name,doc.arguments);
				});
}
});
}
});

