Meteor.startup(function(){

	Flint.registerMacro("setLightChannel",
		"Sets a specific light channel to a specific level",
		{
			channel: "The channel id you want to set",
			value: 'the value you want to set it to',
			delay: 'A delay before running the macro'
		}, function(macroArgs) {
			var delay = macroArgs.delay || 0;
			var obj = {
				value: macroArgs.value
			};
			Meteor.setTimeout(function(){
				Flint.collection('dmxChannel','light-server').update(macroArgs.channel, {$set: obj});
			},delay);
		});

	Flint.registerMacro("setLightChannelSet",
		"Sets an entire channel set to a specific color and intensity",
		{
			channelSet: "The channel set id you want to set",
			color: 'the color you want to set it to',
			intensity: 'the intensity you want to set the channel set to',
			delay: 'A delay before running the macro'
		}, function(macroArgs) {
			var delay = macroArgs.delay || 0;
			var obj = {
				color: macroArgs.color,
				intensity: macroArgs.intensity
			};
			Meteor.setTimeout(function(){
				Flint.collection('dmxChannelSet','light-server').update(macroArgs.channelSet, {$set: obj});
			},delay);
		});
	/*Flint.registerMacro("lightEffect",
		"Runs a light effect",
		{
			effectName: "The name of the effect. Options: Shake (flicker), Fade, Strobe",
			params: 'The parameters of the effect which you are running',
			channel: 'An object like this: {type:"channelSet",id:"theid"} or {type:"channel",id:"theid"}',
			delay: 'A delay before running the macro'
		}, function(macroArgs) {
			var delay = macroArgs.params.delay || 0;
			if (!macroArgs.effectName)
				throw new Meteor.Error('flint-no-effect-name', 'The macro does not have an effect name!');
			if (!macroArgs.channel || !macroArgs.channel.id || !macroArgs.channel.type)
				throw new Meteor.Error('flint-no-effect-name', 'The macro does not have a lighting channel!');
			Meteor.setTimeout(function(){
				var obj = macroArgs.params;
				obj.objectType = macroArgs.channel.type;
				obj._id = macroArgs.channel.id;
				Flint.remote('light-server').call('scheduleDMXEffect', macroArgs.effectName, [obj], {duration: parseInt(macroArgs.params.duration,10) || 5000});
			},delay);
		});*/
	Flint.registerMacro("runLightMacro",
		"Runs a light macro specified on the lighting server",
		{
			macro: "Which macro to run. Configure on the lighting server",
		}, function(macroArgs) {
			var delay = macroArgs.delay || 0;
			if (!macroArgs.macro)
				throw new Meteor.Error('flint-no-macro-name', 'The macro does not have an macro name!');
			console.log('runMacro',macroArgs.macro);
			Meteor.setTimeout(function(){
				Flint.remote('light-server').call('runMacro', macroArgs.macro);
			},delay); 		
		});
});

/*Effect params
fade:{start,stop,duration}
shake:{intensity,duration}
strobe:{duration}*/
