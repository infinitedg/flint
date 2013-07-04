/**
 @class Meteor.subscriptions
*/

/**
List of simulator names
@method flintAdmin.simulators
*/
Meteor.publish("flintAdmin.simulators", function() {
  return Flint.simulators.find({}, { fields: { name: 1 }});
});

/**
List of stations, providing simulatorId, name, and a list of cards
@method flintAdmin.stations
@param {String} simulatorId
@example
    Meteor.subscribe("flintAdmin.stations", "voyager-id");
*/
Meteor.publish("flintAdmin.stations", function(simulatorId) {
  return Flint.stations.find(
    { simulatorId: simulatorId }, 
    { fields: { simulatorId: 1, name: 1, cards: 1 }});
});