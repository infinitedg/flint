Meteor.startup(function(){
	if (!Flint.collections.dmxMacro)
		Flint.collections.dmxMacro = new Mongo.Collection('dmxMacro',{connection:Flint.remote('light-server')});
})

Template.macro_runLightMacro.helpers({
	dmxMacro:function(){
		return Flint.collections.dmxMacro.find();
	},
	isSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if (macro.arguments.macro === this._id) return 'selected';
	}
})

Template.macro_runLightMacro.events({
	'change #macroSelect':function(e,t){
		updateMacro('macro', e.target.value);
	},
	'change #delay':function(e,t){
		updateMacro('delay', e.target.value);
	}
})
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

Template.macro_setLightChannelSet.rendered = function(){
	ColorPicker(
		document.getElementById('flexieSmall'),
		function(hex, hsv, rgb) {
			updateMacro('color',hex.substring(1));
		});
}

Template.macro_setLightChannel.helpers({
	channelList:function(){
		return Flint.collection('dmxchannel','light-server').find();
	},
	channelSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if  (macro.arguments != undefined){
				if (macro.arguments.channel == this._id){
					return 'selected';
				}
			}
		}
	}

})

Template.macro_setLightChannelSet.helpers({
	channelSetList: function(){
		return Flint.collection('dmxchannelset','light-server').find();
	},
	channelSetSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channelSet == this._id){
				return 'selected';
			}
		}
	}
})

Template.macro_lightEffect.helpers({
	effectList: function(){
		return [{name:'fade'},{name:'shake'},{name:'strobe'}];
	},
	effectSelected: function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.effect == this.name){
				return 'selected';
			}
		}
	},
	channelTypeIsChannel:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel.type == 'DMXChannel'){
				return true;
			}
		}
	},
	channelList:function(){
		return Flint.collection('dmxchannel','light-server').find();
	},
	channelSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel != undefined){
				if (macro.arguments.channel.id == this._id){
					return 'selected';
				}
			}
		}
	},
	channelSetList: function(){
		return Flint.collection('dmxchannelset','light-server').find();
	},
	channelSetSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel != undefined){
				if (macro.arguments.channel.id == this._id){
					return 'selected';
				}
			}
		}
	},
	effectType: function(name){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.effectName == name){
				return true;
			}
		}
	}

})

Template.macro_setLightChannel.events({
	'change #channelName':function(e,t){
		updateMacro('channel', e.target.value);
	},
	'change #value':function(e){
		updateMacro('value',e.target.value);
	},
	'change #delay':function(e){
		updateMacro('delay',e.target.value);
	}
})

Template.macro_setLightChannelSet.events({
	'change #channelName':function(e,t){
		updateMacro('channelSet', e.target.value);
	},
	'change #intensity':function(e){
		updateMacro('intensity',e.target.value);
	},
	'change #color':function(e){
		updateMacro('color',e.target.value);
	},
	'change #delay':function(e){
		updateMacro('delay',e.target.value);
	}
})

Template.macro_lightEffect.events({
	'change #effectName':function(e,t){
		updateMacro('effectName', e.target.value);
	},
	'change #channelType':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var channel = macro.arguments.channel || {};
			channel.type = e.target.value;
			updateMacro('channel',channel);
		}
	},
	'change #channelName':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var channel = macro.arguments.channel || {};
			channel.id = e.target.value;
			updateMacro('channel',channel);
		}
	},
	'change #start':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var params = macro.arguments.params || {};
			params.start = e.target.value;
			updateMacro('params',params);
		}
	},
	'change #stop':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var params = macro.arguments.params || {};
			params.end = e.target.value;
			updateMacro('params',params);
		}
	},
	'change #shakeIntensity':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var params = macro.arguments.params || {};
			params.intensity = e.target.value;
			updateMacro('params',params);
		}
	},
	'change #duration':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var params = macro.arguments.params || {};
			params.duration = e.target.value;
			updateMacro('params',params);
		}
	},
	'change #delay':function(e){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			var params = macro.arguments.params || {};
			params.delay = e.target.value;
			updateMacro('params',params);
		}
		updateMacro('delay',e.target.value);

	}
})