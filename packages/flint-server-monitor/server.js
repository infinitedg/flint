var _serverId
, globalObserver
, selfObserver
, maxBeats = 3; // Up to 3 seconds before the server gets removed and must be reset
// , _serverDep = new Deps.Dependency


function generateObservers() {
	// Self-watching mechanisms
	selfObserver = Flint.collection('flintServers').find({serverId: Flint.serverId()}).observeChanges({
		added: function(id, fields) {
			Flint.Log.info('Joining server pool as ' + fields.serverId, 'server-monitor');
		},
		changed: function(id, fields) {
			
		},
		removed: function(id) {
			Flint.Log.info('Ouch! Kicked out of server pool for lagging. Regenerating...', 'server-monitor');
			Flint.serverId(true);
		}
	});

	// Global watching mechanisms
	globalObserver = Flint.collection('flintServers').find().observe({
		added: function(doc) {
			if (doc.serverId !== Flint.serverId()) {
				Flint.Log.info('New server ' + doc.serverId + ' just arrived', 'server-monitor');
			}
		},
		changed: function(newDoc, oldDoc) {
			var totalServers = Flint.collection('flintServers').find().count();
			if (newDoc.heartbeatCounter > (totalServers - 1) * maxBeats) {
				Flint.Log.info('Server ' + newDoc.serverId + ' passed max beats (' + maxBeats + ')', 'server-monitor');
				Flint.collection('flintServers').remove({_id: newDoc._id});
			}
		},
		removed: function(doc) {
			if (doc.serverId !== Flint.serverId()) {
				Flint.Log.info('Server ' + doc.serverId + ' removed from pool', 'server-monitor');
			}
		}
	});
};

function stopObservers() {
	if (globalObserver && globalObserver.stop) {
		globalObserver.stop();
	}
	if (selfObserver && selfObserver.stop) {
		selfObserver.stop();
	}
};

// Pass true value in newId to trigger an ID refresh
Flint.serverId = function(newId) {
	if (newId === undefined) {
		return _serverId;
	} else {
		stopObservers();
		_serverId = new Meteor.Collection.ObjectID()._str;
		
		// Insert new server instance
		Flint.collection('flintServers').insert({
			'serverId': _serverId
		});

		generateObservers();
	}
};



Meteor.startup(function() {
	// Setup this server instance in the flint servers pool
	Flint.serverId(true);

	// Each second, reset this server's counter
	// Also increment the other servers at the same time
	Meteor.setInterval(function() {
		Flint.collection('flintServers').update({serverId: { $ne: Flint.serverId() }}, 
			{$inc: { heartbeatCounter: 1}}, { multi: true });
		Flint.collection('flintServers').update({serverId: Flint.serverId()}, 
			{$set: {heartbeatCounter: 0}});
	}, 1000);

});

Meteor.methods({
	/**
	Get server instance ID for assigning a distributed task
	*/
	nextServer: function() {
		// @TODO: Implement real server health checking
		// Or at least roundrobin

		var servers = Flint.collection('flintServers').find({},{sort: ["heartbeatCounter"]}).fetch();
		if (servers.length > 0) { 
			return servers[0].serverId;
		}
	}
});