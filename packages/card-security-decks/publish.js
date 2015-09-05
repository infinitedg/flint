Meteor.publish('cards.security-decks.allDecks', function(simulatorId) {
	return Flint.collection('decks').find({simulatorId: simulatorId});
});

Meteor.publish('cards.security-decks.oneDeck', function(simulatorId, floor) {
	return Flint.collection('decks').find({simulatorId: simulatorId, number: floor});
});

Meteor.publish('simulator.hallways', function(simulatorId){
	return Flint.collection('hallways').find({simulatorId:simulatorId});
});