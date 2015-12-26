Meteor.publish('card-vocoder-vocoders',function(simulatorId){
	return Flint.collection('vocoders').find({simulatorId:simulatorId});
});
