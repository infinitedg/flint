var dramaInterval = Meteor.setInterval(function() {
	Flint.collection('FlintActors').update({}, {$inc: {counter: 1}});
	Flint.collection('FlintActors').update({counter: {$gte: 5}}, {$set: {claimedBy: DramaInstanceID}});
}, 1000);
