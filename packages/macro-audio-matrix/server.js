Flint.registerMacro('audioMatrixToggle',
	'Toggles the activated state of an audio matrix send',
	{
		'mixId':'The id of the mix (input)',
		'busId':'The id of the bus (output)'
	},
	function(args) {
		var intersection = Flint.collection('AudioMatrixSend').findOne({
			mixId:args.mixId,
			busId:args.busId
		})
		var mute;
		if (intersection.mute == 0){
			mute = 1;
		} else {
			mute = 0;
		}
		Flint.collection('AudioMatrixSend').update({_id:intersection._id}, {$set: {mute:mute}});
	}
);

Flint.registerMacro('audioMatrixState',
	'Changes the activated state of an audio matrix send',
	{
		'mixId':'The id of the mix (input)',
		'busId':'The id of the bus (output)',
		'state':'Boolean - the state of the bus (active = true)'
	},
	function(args) {
		var intersection = Flint.collection('AudioMatrixSend').findOne({
			mixId:args.mixId,
			busId:args.busId
		})
		var mute;
		if (args.state == false){
			mute = 1;
		} else {
			mute = 0;
		}
		Flint.collection('AudioMatrixSend').update({_id:intersection._id}, {$set: {mute:mute}});
	}
);

Flint.registerMacro('audioMatrixVolume',
	'Changes the activated state of an audio matrix send',
	{
		'mixId':'The id of the mix (input)',
		'busId':'The id of the bus (output)',
		'volume':'Float - the volume level from 0 to 1'
	},
	function(args) {
		var intersection = Flint.collection('AudioMatrixSend').findOne({
			mixId:args.mixId,
			busId:args.busId
		})
		if (volume > 1)
			volume = 1;
		if (volume < 0)
			volume = 0;
		Flint.collection('AudioMatrixSend').update({_id:intersection._id}, {$set: {volume:volume}});
	}
);

