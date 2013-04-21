Meteor.publish("stationPicker.simulators", function() {
  return Flint.simulators.find({}, { fields: { name: 1 }});
});

Meteor.publish("stationPicker.stations", function(simulatorId) {
  return Flint.stations.find(
    { simulatorId: simulatorId }, 
    { fields: { simulatorId: 1, name: 1 }});
});