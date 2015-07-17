Meteor.publish('lightingModules',function(){
	return Flint.collection('flintLightingModules').find();
})

Meteor.publish('lightingModuleTypes',function(){
	return Flint.collection('flintLightingModuleTypes').find();
})