var cleanupInterval = 10 * 1000,  // How frequently do we clean up old clients?
    cleanupThreshold = 20 * 1000; // How old can a client be before we clean it up?
Meteor.startup(function(){
  Meteor.setInterval(function(){
    var d = new Date();
    // Remove clients that vanish for longer than 10 minutes
  //   Flint.collection('clients').remove({
  //   	$or: [
  //   		{heartbeat: {$lt: (d.getTime() - cleanupThreshold)}}, // 
  //   		{heartbeat: {$exists: false}}
  //   	]});
  }, cleanupInterval);
});

Meteor.publish("flint.clientId", function(clientId) {
    Meteor.Error(500, "flint.clientId subscribed - deprecated");
  return Flint.collection("clients").find(clientId, {fields: { heartbeat: false, createdOn: false, updatedOn: false }});
});

Meteor.methods({
	"flint.getClient": function(existingId) {
        Meteor.Error(500, "flint.getClient called - deprecated");
		var client = Flint.collection('clients').findOne(existingId);
		if (!client) {
			var d = new Date();
			var newId = Flint.collection('clients').insert({createdOn: d.getTime(), heartbeat: d.getTime()});
			client = Flint.collection('clients').findOne(newId);
		}
		return client._id;
	},
  "flint.resetClient": function(clientId) {
    Meteor.Error(500, "flint.resetClient called - deprecated");
    Flint.collection('clients').remove(clientId);
  },
  "flint.heartbeat": function(clientId, simulatorId, stationId) {
    Meteor.Error(500, "flint.heartbeat called - deprecated");
    var d = new Date();
    var setObj = {heartbeat: d.getTime()};
    var unsetObj = {};
    if (stationId) {
      setObj['stationId'] = stationId;
    } else {
      unsetObj['stationId'] = true;
    }

    if (simulatorId) {
      setObj['simulatorId'] = simulatorId;
    } else {
      unsetObj['simulatorId'] = true;
    }
    
    Flint.collection('clients').update(clientId, {$set: setObj, $unset: unsetObj});
  }
});