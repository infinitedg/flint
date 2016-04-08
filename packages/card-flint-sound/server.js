_hidSavedKeys = [];
Meteor.methods({
	cancelSounds: function(simulatorId){
		Flint.collection('flintSounds').remove({'simulatorId' : simulatorId,'type' : {$ne:'ambiance'}});
	},
	runMacroHIDKey:function (key,mods,simulator){
		console.log(key,mods,simulator);
		console.log(this);
		var modifiers = {meta: mods.l_meta || mods.r_meta, alt: mods.l_alt || mods.r_alt, shift: mods.l_shift || mods.r_shift, control: mods.l_control || mods.r_control, caps: false};// caps:Session.get('soundKeyboard-capsKey')};
		Flint.collection('flintMacroKeys').find({'hidkey':key.toString(), 'set':Flint.simulators.findOne({_id:simulator}).macroSet}).forEach(function(macroKey){
			console.log(macroKey, JSON.stringify(macroKey.modifiers), JSON.stringify(modifiers));
			if (JSON.stringify(macroKey.modifiers) == JSON.stringify(modifiers)){
				Flint.collection('flintMacroPresets').find({'key':macroKey._id}).forEach(function(doc){
					doc.arguments.soundGroups = ['main'];
					doc.arguments.channel = [2,3];
					var keyPressed = false;
					var removeKeys = [];
					if (doc.arguments.looping){
						if (Flint.station){
							if (typeof Flint.station("savedKeys") == "object"){
								for (keysPressed in Flint.station("savedKeys")){
									var e = Flint.station("savedKeys")[keysPressed];
									if (e.key == macroKey.key && JSON.stringify(e.modifiers) == JSON.stringify(macroKey.modifiers))
										keyPressed = true;
									removeKeys.push(keysPressed);
								}
							}
						} else {
							for (var i = 0; i < _hidSavedKeys.length; i++){
								var e = _hidSavedKeys[i];
								if (e.key == macroKey.key && JSON.stringify(e.modifiers) == JSON.stringify(macroKey.modifiers)){
									keyPressed = true;
									removeKeys.push(i);
								}
							}
						}
						if (keyPressed){
							if (Flint.station){
								var savedKeys = Flint.station("savedKeys");
								removeKeys.forEach(function(e){
									savedKeys.splice(e,1);
								});
								Flint.station('savedKeys',savedKeys);
								doc.arguments.cancelMacro = true;
							} else {
								removeKeys.forEach(function(e){
									_hidSavedKeys.splice(e,1);
								});
								doc.arguments.cancelMacro = true;
							}
						}
						var savedKey = {key: macroKey.key, modifiers:macroKey.modifiers};
						doc.arguments.keyPressed = savedKey;
						if (!keyPressed){
							if (Flint.station){
								var keys = Flint.station("savedKeys") || [];
								keys.push(savedKey);
								Flint.station("savedKeys",keys);
							} else {
								_hidSavedKeys.push(savedKey);
							}
						}
					}
					if (!doc.simulatorId) {
						doc.arguments.simulatorId = simulator;
					}
					/*if (!doc.stationId){
						doc.arguments.stationId = 'hidDevice'
					}*/
					console.log(doc);
					Flint.Jobs.scheduleJob('macroQueue', 'macro', {}, {macroName: doc.name, args: doc.arguments});
				});
						}
					});
			}
		});

