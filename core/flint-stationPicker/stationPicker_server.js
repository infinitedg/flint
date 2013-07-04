/**
@class Subscriptions
*/

/**
List of all simulator names
@method stationPicker.simulators
*/
Meteor.publish("stationPicker.simulators", function() {
  return Flint.simulators.find({}, { fields: { name: 1 }});
});

/**
List of stations for a given simulatorId, providing simulatorId, name, and a list of cards
@method stationPicker.stations
@param {String} simulatorId
@example
    Meteor.subscribe("stationPicker.stations", Session.get("selectedSimulator"));
*/
Meteor.publish("stationPicker.stations", function(simulatorId) {
  return Flint.stations.find(
    { simulatorId: simulatorId }, 
    { fields: { simulatorId: 1, name: 1 }});
});