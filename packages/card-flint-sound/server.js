Meteor.publish('flint-macroSets', function() {
	return Flint.collection('flintMacroSets').find();
});
Meteor.methods({
	cancelSounds: function(simulatorId){
		Flint.collection('flintSounds').remove({'simulatorId' : simulatorId,'type' : {$ne:'ambiance'}});
	}
});
/*
Flint.registerMacro('playSound',function(soundName, options){
	var looping = options.looping || 'false';
	Flint.play(soundName, looping, options);
});*/