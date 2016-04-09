Meteor.startup(function(){
	Flint.registerMacro('setVocoderPitch',
		'Stub. Changes the vocoder pitch parameter for the primary engine.',
		{
			'value':'The pitch value to set',
		},
		function(arg) {
			Flint.collection('flintaudiounitnode').update({_id:'engine-1-node-1'},{$set:{kNewTimePitchParam_Pitch:parseInt(arg.pitch,10)}});
		}
		);
});