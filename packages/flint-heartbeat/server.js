var _connectionCache = {},
heartbeatTimeout = 3;

Meteor.methods({
    'flint.connectionId': function() {
        return this.connection.id;
    }
});

Meteor.publish('flint.clientSelf', function() {
    return Flint.collection('flintClients').find({connectionId: this.connection.id});
});

Meteor.startup(function() {
    Flint.Log.info("Setting up client tracking system", 'flint-heartbeat');

    Meteor.onConnection(function(conn) {
        var connectionId = conn.id;
        _connectionCache[connectionId] = conn;
        conn.onClose(function() {
            Flint.collection('flintClients').remove({connectionId: connectionId});
        });
        Flint.collection('flintClients').insert({
            connectionId: connectionId,
            createdOn: (new Date()).getTime(),
            clientAddress: conn.clientAddress,
            serverId: Flint.serverId()
        });
    });

    Flint.collection('flintClients').find({}).observe({
        'removed': function(doc) {
            // Ignore connections not on this server
            if (_connectionCache[doc.connectionId]) {
                _connectionCache[doc.connectionId].close();
                delete _connectionCache[doc.connectionId];
            }
        }
    });

    // If a server drops, then drop its clients
    Flint.collection('flintServers').find().observe({
        'removed': function(doc) {
            Flint.collection('flintClients').remove({serverId: doc.serverId});
        }
    });

    // Cleanup orphaned clients where appropriate
    Meteor.setInterval(function() {
        // Increment client counters
        Flint.collection('flintClients').update({$inc: {heartbeatCounter: 1}}, {multi: true});
        // If they pass the heartbeat timeout, remove the client
        var serverCount = Flint.collection('flintServers').find().count();
        Flint.collection('flintClients').remove({heartbeatCounter: {$gt: serverCount * heartbeatTimeout}});
    }, 1000);
});