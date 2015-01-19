function updateMacro(argumentName, value){
	var macro = Session.get('flint-macros-currentMacro');
	if (macro.arguments == undefined)
		macro.arguments = {};
	macro.arguments[argumentName] = value;
	Session.set('flint-macros-currentMacro',macro);
	Flint.collection('flintMacroPresets').update({'_id':macro._id},macro);
}

Template.macro_setLightChannelSet.rendered = function(){
	ColorPicker(
		document.getElementById('flexieSmall'),
		function(hex, hsv, rgb) {
			console.log(hex);
			updateMacro('color',hex);
		});
}

Template.macro_setLightChannel.helpers({
	channelList:function(){

	},
	channelSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel == this._id){
				return 'selected';
			}
		}
	}

})

Template.macro_setLightChannelSet.helpers({
	channelSetList: function(){

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
		return ['fade','shake','strobe'];
	},
	effectSelected: function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.effect == this){
				return 'selected';
			}
		}
	},
	channelTypeIsChannel:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel.type == 'channel'){
				return true;
			}
		}
	}
	channelList:function(){

	},
	channelSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel.id == this._id){
				return 'selected';
			}
		}
	},
	channelSetList: function(){

	},
	channelSetSelected:function(){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.channel.id == this._id){
				return 'selected';
			}
		}
	},
	effectType: function(name){
		var macro = Session.get('flint-macros-currentMacro');
		if  (macro.arguments != undefined){
			if (macro.arguments.effect == name){
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
		updateMacro('channel', e.target.value);
	},
	'change #intensity':function(e){
		updateMacro('intensity',e.target.value);
	},
	//Color is set with the colorpicker plugin.
	'change #delay':function(e){
		updateMacro('delay',e.target.value);
	}
})

Template.macro_setLightChannel.events({
	'change #effectName':function(e,t){
		updateMacro('effectName', e.target.value);
	},
	'change #channelType':function(e){
		updateMacro('value',e.target.value);
	},
	'change #channelName':function(e){
		updateMacro('delay',e.target.value);
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
			params.stop = e.target.value;
			updateMacro('params',params);
		}
	},
	'change #intensity':function(e){
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
	}
})