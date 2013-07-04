// Subscriptions for administrative purposes
Meteor.publish("flintAdmin.simulators", function() {
  return Flint.simulators.find({}, { fields: { name: 1 }});
});

Meteor.publish("flintAdmin.stations", function(simulatorId) {
  return Flint.stations.find(
    { simulatorId: simulatorId }, 
    { fields: { simulatorId: 1, name: 1, cards: 1 }});
});