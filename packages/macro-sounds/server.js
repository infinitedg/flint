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

Flint.registerMacro('playRandomSound',
	'Issues the Flint.play method with options',
	{
		'soundName':'The Flint Asset key which references the sound',
		'options':'Object. Refer to Flint Audio Engine package for available options'
	},
	function(soundArgs) {
		if (!soundArgs.randomSounds) {
			Flint.Log.error("Attempted to play sound without an assetKey array", "flint-sound");
			return;
		}
		else {
			soundArgs.assetKey = soundArgs.randomSounds[Math.floor(Math.random() * soundArgs.randomSounds.length)].assetKey;
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
			console.log(soundArgs);
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
		Flint.collection('stations').update({_id:data.stationId, simulatorId:data.simulatorId},{$set:{savedKeys:[]}})
		console.log(data);
	}
	);
Flint.registerMacro('cancelAllSounds',
	'Cancels all sound effects',
	{
		'simulatorId':'The ID of the simulator issuing the call'
	},
	function(data){
		Flint.collection('flintSounds').remove({simulatorId:data.simulatorId});
		Flint.collection('stations').update({_id:data.stationId, simulatorId:data.simulatorId},{$set:{savedKeys:[]}})
		console.log("canceled all");
	}
	);
})
