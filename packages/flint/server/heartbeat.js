var cleanupInterval = 10 * 1000,  // How frequently do we clean up old clients?
    cleanupThreshold = 20 * 1000; // How old can a client be before we clean it up?
Meteor.startup(function(){
  Meteor.setInterval(function(){
    var d = new Date();
    // Remove clients that vanish for longer than 10 minutes
    Flint.collection('clients').remove({
    	$or: [
    		{heartbeat: {$lt: (d.getTime() - cleanupThreshold)}}, // 
    		{heartbeat: {$exists: false}}
    	]});
  }, cleanupInterval);
});

Meteor.publish("flint.clientId", function(clientId) {
  return Flint.collection("clients").find(clientId, {fields: { heartbeat: false, createdOn: false, updatedOn: false }});
});

Meteor.methods({
	"flint.getClient": function(existingId) {
		var client = Flint.collection('clients').findOne(existingId);
		if (!client) {
			var d = new Date();
			var newId = Flint.collection('clients').insert({createdOn: d.getTime(), heartbeat: d.getTime()});
			client = Flint.collection('clients').findOne(newId);
		}
		return client._id;
	},
  "flint.heartbeat": function(clientId) {
    var d = new Date();
    Flint.collection('clients').update(clientId, {$set: {heartbeat: d.getTime()}});
  }
});