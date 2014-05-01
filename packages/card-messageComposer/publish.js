Meteor.publish('cards.messageComposer.lrmessages', function(simulatorId) {
  return Flint.collection('lrmessages').find(
    { simulatorId: simulatorId });
});