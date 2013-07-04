/**
 @class Meteor.subscriptions
*/

/**
List of stations for the requested simulator ID
@method core.stationUtility.stations
*/
Meteor.publish("core.stationUtility.stations", function(simId) {
  return Flint.stations.find({simulatorId: simId});
});

/**
List of clients for the requested simulator ID
@method core.stationUtility.clients
*/
Meteor.publish("core.stationUtility.clients", function(simId) {
  return Flint.clients.find();
  // @TODO: Attach simulatorID to client table
});