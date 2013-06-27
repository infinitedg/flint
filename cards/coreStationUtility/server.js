Meteor.publish("core.stationUtility.stations", function(simId) {
  return Flint.stations.find({simulatorId: simId});
});