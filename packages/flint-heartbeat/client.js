// Subscribe to this client's connection ID
Meteor.subscribe('flint.clientConnectionId');

// Setup Flint methods
Flint.connectionId = function() {
	var connection = Flint.collection('flintConnections').findOne() || {};
	return connection.connectionId;
};

Flint.client = function(key, val) {
	var client = Flint.collection('flintClients').findOne({connectionId: Flint.connectionId()}) || {};
	if (key !== undefined && val !== undefined) {
		var updateObj = {};
		updateObj[key] = val;
		Flint.collection('flintClients').update({_id: client._id}, {$set: updateObj});
	} else if (key !== undefined && val == undefined) {
		return client[key];
	} else {
		return client;
	}
};

Flint.clientId = function() {
	var client = Flint.collection('flintClients').findOne({connectionId: Flint.connectionId()}) || {};
	return client._id;
};

Meteor.startup(function() {
	// Reactively update the client document based on the current simulator & station
	Deps.autorun(function() {
		Meteor.subscribe('flint.clientHeartbeat', Flint.simulatorId(), Flint.stationId());
	});

	// Reset connection & client heartbeat periodically
	// Helps keep the collections clean if there's a bad server shutdown
	// Corresponding server functions increment heartbeat signals,
	// removing objects with exceedingly high values
	Meteor.setInterval(function() {
		var connectionId = Flint.collection('flintConnections').findOne();
		Flint.collection('flintConnections').update({_id: connectionId._id}, {$set: {heartbeatCounter: 0}});
		Flint.client('heartbeatCounter', 0);
	}, 1000);
});