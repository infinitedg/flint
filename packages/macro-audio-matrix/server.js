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
		if (args.volume > 1)
			args.volume = 1;
		if (args.volume < 0)
			args.volume = 0;
		console.log(intersection,args.volume);
		Flint.collection('AudioMatrixSend').update({_id:intersection._id}, {$set: {volume:args.volume}});
	}
);

Flint.registerMacro('audioMatrixInputVolume',
	'Changes the activated state of an audio matrix send',
	{
		'mixId':'The id of the mix (input)',
		'volume':'Float - the volume level from 0 to 1'
	},
	function(args) {
		console.log(args);
		var intersection = Flint.collection('AudioMatrixMix').findOne({
			_id:args.mixId,
		})
		if (args.volume > 1)
			args.volume = 1;
		if (args.volume < 0)
			args.volume = 0;
		console.log(intersection,args.volume);
		var matrix = intersection.matrix;
		matrix.fader = args.volume;
		Flint.collection('AudioMatrixMix').update({_id:intersection._id}, {$set: {matrix:matrix}});
	}
);