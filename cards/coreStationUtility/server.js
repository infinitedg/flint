Meteor.publish("core.stationUtility.stations", function(simId) {
  return Flint.stations.find({simulatorId: simId});
});

Meteor.publish("core.stationUtility.clients", function(simId) {
  return Flint.clients.find();
  // @TODO: Attach simulatorID to client table
});