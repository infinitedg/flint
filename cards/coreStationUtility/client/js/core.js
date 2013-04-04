(function () {
  'use strict';
  
  Template.core_stationUtility.stations = function() {
    return Stations.find({simulatorId: Flint.getSimulator()._id});
  };
  
  Template.core_stationUtility.participants = function() {
    return Participants.find({simulatorId: Flint.getSimulator()._id},
      {
        transform: function(doc) {
          var station = Stations.findOne(doc.stationId);
          doc.stationName = station.name;
          return doc;
        }
      });
  };
  
  Template.core_stationUtility.events = {
    'click button': function(e, t) {
      var target = t.find('select.target').value;
      var action = t.find('select.action').value;
      var opts = {};
      
      if ($(t.find('select.target option:selected')).hasClass('participant')) {
        opts.participantId = target;
        target = Participants.findOne(target).stationId;
      }
      
      Stations.update(target, {$set: {remoteAction: action, remoteActionSeed: Math.random(), remoteActionOptions: opts}});
      e.preventDefault();
    }
  };
  
}());
