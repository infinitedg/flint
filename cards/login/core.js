(function (){
  'use strict';
  
  Template.core_login.clients = function() {
    return _.flatten(
      Flint.stations.find({ simulatorId: Flint.simulatorId() }).map(function(station) {
        return Flint.clients.find({ stationId: station._id, _id: { $ne: Flint.clientId() } }).map(function(client) { 
          client.stationName = station.name;
          return client;
        });
      }), true);
  };
}());