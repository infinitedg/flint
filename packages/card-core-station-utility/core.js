/**
@module Templates
@submodule Core
*/

/**
Core card for triggering various events, performing maintenance & utility functions as appropriate.
@class core_stationUtility
*/

/**
Subscribe to necessary information when created
@method created
*/
Template.core_stationUtility.created = function() {
  this.stationSub = Meteor.subscribe("core.stationUtility.stations", Flint.simulatorId());
  this.clientSub = Meteor.subscribe("core.stationUtility.clients", Flint.simulatorId());
};

/**
Tear down subscriptions triggered with `created`
@method created
*/
Template.core_stationUtility.destroyed = function() {
  this.stationSub.stop();
  this.clientSub.stop();
};

/**
The list of stations for this simulator.
@property stations
@type Meteor.Collection
*/
Template.core_stationUtility.helpers({
  stations: function() {
    return Flint.stations.find({simulatorId: Flint.simulatorId()});
  },
  clients: Utils.memoize(function() {
    return _.flatten(
      Flint.stations.find().map(function(station) {
        return Flint.clients.find({ stationId: station._id, _id: { $ne: Flint.clientId() } }, { transform: function(doc) {
          delete doc.heartbeat;
          return doc;
        }}).map(function(client) { 
          client.stationName = station.name;
          return client;
        });
      }), true);
  }),

});

/**
The list of clients in this simulator. Memoized.
@property clients
@type Meteor.Collection
*/

Template.core_stationUtility.events = {
  /**
  Trigger whatever the currently selected event is
  @method click button
  */
  'click button': function(e, t) {
    var target = t.find('select.target').value;
    var action = t.find('select.action').value;
    var opts = {}; // Unused, reserved for future applications
    
    var searchParams = {stationId: target};

    if ($(t.find('select.target option:selected')).hasClass('participant')) {
      searchParams = {_id: target};
    }

    Flint.clients.find(searchParams).forEach(function(client, i){
      Flint.clients.update(client._id, {$set: {remoteAction: action, remoteActionSeed: Math.random(), remoteActionOptions: opts}});
    }), 

    e.preventDefault();
    return false;
  }
};
