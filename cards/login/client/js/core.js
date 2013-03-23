(function (){
  'use strict';
  
  Template.core_login.participants = function() {
    var participants = Participants.find({simulatorId: Flint.getStation().simulatorId}, {
      transform: function(doc) {
        doc.station = Stations.findOne(doc.stationId);
        return doc;
      }
    });
    return participants;
  };
}());