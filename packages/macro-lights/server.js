Meteor.startup(function(){

Flint.registerMacro("setLightChannel",
	"Sets a specific light channel to a specific level",
	{
		channel: "The channel id you want to set",
		value: 'the value you want to set it to',
		delay: 'A delay before running the macro'
	}, function(macroArgs) {
		Flint.Log.info("TestMacro! ", macroArgs.arg1, macroArgs.arg2, macroArgs.arg3);
	});

Flint.registerMacro("setLightChannelSet",
	"Sets an entire channel set to a specific color and intensity",
	{
		channelSet: "The channel set id you want to set",
		color: 'the color you want to set it to',
		intensity: 'the intensity you want to set the channel set to'.
		delay: 'A delay before running the macro'
	}, function(macroArgs) {
		Flint.Log.info("TestMacro! ", macroArgs.arg1, macroArgs.arg2, macroArgs.arg3);
	});
Flint.registerMacro("lightEffect",
	"Runs a light effect",
	{
		effect: "The name of the effect. Options: Shake (flicker), Fade, Strobe",
		params: 'The parameters of the effect which you are running',
		channel: 'An object like this: {type:"channelSet",id:"theid"} or {type:"channel",id:"theid"}',
		delay: 'A delay before running the macro'
	}, function(macroArgs) {
		Flint.Log.info("TestMacro! ", macroArgs.arg1, macroArgs.arg2, macroArgs.arg3);
	});
})

/*Effect params
fade:{start,stop,duration}
shake:{intensity,duration}
strobe:{duration}