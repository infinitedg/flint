Meteor.startup(function() {
    Meteor.publish('cards.chatMessages', function(simulatorId) {
        return Flint.collection('ChatMessages').find({simId: simulatorId}, { sort: { time: -1 }});
    });
});