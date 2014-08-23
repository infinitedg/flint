// Setup Flint methods
Flint.connectionId = function() {
	return Session.get('flint.connectionId');
};

Flint.client = function(key, val) {
	var client = Flint.collection('flintClients').findOne({connectionId: Flint.connectionId()}) || {};
	if (key !== undefined && val !== undefined) {
		var updateObj = {};
		updateObj[key] = val;
		Flint.collection('flintClients').update({_id: client._id}, {$set: updateObj});
	} else if (key !== undefined && val === undefined) {
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
	// Reactively update the client document based on the current simulator
	Deps.autorun(function() {
		Flint.collection('flintClients').update({_id: Flint.clientId()},
			{$set: {
				simulatorId: Flint.simulatorId()
			}
		});
	});

	// Reactively update the client document based on the current simulator
	Deps.autorun(function() {
		Flint.collection('flintClients').update({_id: Flint.clientId()},
			{$set: {
				stationId: Flint.stationId()
			}
		});
	});

	// Reactively reset the connectionId
	Deps.autorun(function() {
		if (Meteor.status().connected) {
			Meteor.call('flint.connectionId', function(err, res) {
				if (res) {
					Session.set('flint.connectionId', res);
				}
			});
		}
	});

	// Reset client heartbeat periodically
	// Helps keep things clean if there's a bad server shutdown, other events
	// Corresponding server functions increment heartbeat signals,
	// removing objects with exceedingly high values
	Meteor.setInterval(function() {
		Flint.client('heartbeatCounter', 0);
	}, 1000);

	// Track this client
	Meteor.subscribe('flint.clientSelf');
});