Flint.registerMacro("testMacro",
	"This macro is intended to test the macro system as a whole",
	{
		arg1: "A sample argument",
		arg2: 'Yet another sample',
		arg3: 'Let\'s use the function for real'
	}, function(macroArgs) {
		Flint.Log.info("TestMacro! ", macroArgs.arg1, macroArgs.arg2, macroArgs.arg3);
		Flint.Log.info("Current number of servers: " + Flint.collection('flintServers').find({}).count());
	});

Meteor.startup(function(){
	Flint.registerMacro('playSound',
		'Issues the Flint.play method with options',
		{
			'soundName':'The Flint Asset key which references the sound',
			'options':'Object. Refer to Flint Audio Engine package for available options'
		},
		function(soundArgs) {
			if (!soundArgs.assetKey) {
				Flint.Log.error("Attempted to play sound without an assetKey", "flint-sound");
				return;
			}
			if (!soundArgs.soundGroups || !Array.isArray(soundArgs.soundGroups)) {
				soundArgs.soundGroups = [];
			}

			if (soundArgs.soundGroups.length === 0 && soundArgs.soundPlayers.length === 0){
				Flint.Log.error("Attempted to play sound without players or groups", "flint-sound");
				return;
			}
			if (!soundArgs.parentKey) {
				soundArgs.parentKey = Meteor.uuid();
			}
			if (soundArgs.cancelMacro){
				Flint.collection('flintSounds').update({simulatorId:soundArgs.simulatorId,keyPressed:soundArgs.keyPressed},{$set:{looping:false}});
			} else {
				Flint.collection('flintSounds').insert(soundArgs);
			}
		}
		);
Flint.registerMacro('cancelRepeating',
	'Cancels all repeating sound effects',
	{
		'simulatorId':'The ID of the simulator issuing the call'
	},
	function(data){
		Flint.collection('flintSounds').update({simulatorId:data.simulatorId},{$set:{looping:false}});
	}
	);
Flint.registerMacro('cancelAllSounds',
	'Cancels all sound effects',
	{
		'simulatorId':'The ID of the simulator issuing the call'
	},
	function(data){
		Flint.collection('flintSounds').remove({simulatorId:data.simulatorId});
	}
	);
})