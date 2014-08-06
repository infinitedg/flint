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
    Flint.collection('stations').find({ simulatorId: Flint.simulatorId() }).map(function(station) {
      return Flint.collection('clients').find({ stationId: station._id, _id: { $ne: Flint.clientId() } }).map(function(client) { 
        client.stationName = station.name;
        client.name = client.name || '-';
        return client;
      });
    }), true);
};

Template.core_login.created = function() {
	this.clientSub = Meteor.subscribe("core.login.clients", Flint.simulatorId());
	this.stationSub = Meteor.subscribe("core.login.stations", Flint.simulatorId());
};

Template.core_login.destroyed = function() {
	this.clientSub.stop();
	this.stationSub.stop();
};