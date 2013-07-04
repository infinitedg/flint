/**
@module Templates
@submodule Core
*/
 
/**
Core card for viewing the list of currently logged-in clients
@class core_login
*/

/**
The list of clients currently attached to the simulator
@property clients
@type Meteor.Collection
*/
Template.core_login.clients = function() {
  return _.flatten(
    Flint.stations.find({ simulatorId: Flint.simulatorId() }).map(function(station) {
      return Flint.clients.find({ stationId: station._id, _id: { $ne: Flint.clientId() } }).map(function(client) { 
        client.stationName = station.name;
        return client;
      });
    }), true);
};