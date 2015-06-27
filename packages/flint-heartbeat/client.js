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
