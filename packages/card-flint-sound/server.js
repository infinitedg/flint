Meteor.publish('core.flint-sound.sounds', function(simulatorId) {
	return Flint.collection('flintSounds').find({simulatorId: simulatorId});
});
Meteor.methods({
	cancelSounds: function(simulatorId){
		Flint.collection('flintSounds').remove({'simulatorId' : simulatorId,'type' : {$ne:'ambiance'}});
	}
})