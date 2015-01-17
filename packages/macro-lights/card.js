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
			Session.set('currentColor',hex);
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
