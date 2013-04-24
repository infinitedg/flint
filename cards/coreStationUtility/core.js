(function () {
  'use strict';
  
  Template.core_stationUtility.stations = function() {
    return Flint.stations.find({simulatorId: Flint.simulatorId()});
  };
  
  Template.core_stationUtility.clients = Utils.memoize(function() {
    return _.flatten(
      Flint.stations.find({ simulatorId: Flint.simulatorId() }).map(function(station) {
        return Flint.clients.find({ stationId: station._id, _id: { $ne: Flint.clientId() } }).map(function(client) { 
          client.stationName = station.name;
          return client;
        });
      }), true);
  });
  
  Template.core_stationUtility.events = {
    'click button': function(e, t) {
      var target = t.find('select.target').value;
      var action = t.find('select.action').value;
      var opts = {};
      
      if ($(t.find('select.target option:selected')).hasClass('participant')) {
        opts.clientId = target;
        target = Flint.clients.findOne(target).stationId;
      }
      
      Flint.stations.update(target, {$set: {remoteAction: action, remoteActionSeed: Math.random(), remoteActionOptions: opts}});
      e.preventDefault();
    }
  };
  
}());
