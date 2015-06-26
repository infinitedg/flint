Meteor.publish('flint-macroSets', function(){
	return Flint.collection('flintMacroSets').find();
});
Meteor.publish('flint-macroKeys', function(){
	return Flint.collection('flintMacroKeys').find();
});
Meteor.publish('flint-macroPresets',function(){
	return Flint.collection('flintMacroPresets').find();
})