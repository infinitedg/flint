// Threshhold of missed beats (adjusted by number of servers in cluster)
// used for removing clients and connections
var heartbeatLimit = 3;


// Publication used for registering/deregistering connections reactively
Meteor.publish("flint.clientHeartbeat", function(simulatorId, stationId) {
    var connectionId = this.connection.id;
    this.onStop(function() {
        Flint.collection('flintClients').remove({connectionId: connectionId});
    });

    var upsertObj = {
        createdOn: (new Date()).getTime()
    };
    if (simulatorId !== undefined) {
        upsertObj.simulatorId = simulatorId;
    }
    if (stationId !== undefined) {
        upsertObj.stationId = stationId;
    }

    var client = Flint.collection('flintClients').upsert({connectionId: connectionId}, {$set: upsertObj});
    return Flint.collection('flintClients').find({connectionId: connectionId});
});

// Although similar to flint.clientSubId, this publication provides the connectionID
// to the subscriber, and just that one document - no others. This way, the client knows
// its client ID
Meteor.publish("flint.clientConnectionId", function() {
    var connectionId = this.connection.id;
    this.onStop(function() {
        Flint.collection('flintConnections').remove({connectionId: connectionId});
    });

    var client = Flint.collection('flintConnections').upsert({connectionId: connectionId, serverId: Flint.serverId()}, {$set: {connectionId: connectionId, createdOn: (new Date()).getTime()}});
    return Flint.collection('flintConnections').find({connectionId: connectionId});
});

Meteor.startup(function() {
    // Prune stale connections & associated clients
    Meteor.setInterval(function() {
        Flint.collection('flintConnections').update({}, {$inc: {heartbeatCounter: 1}}, {multi: true});
        Flint.collection('flintClients').update({}, {$inc: {heartbeatCounter: 1}}, {multi: true});
        var serverCount = Flint.collection('flintServers').find().count();
        Flint.collection('flintConnections').remove({heartbeatCounter: {$gt: (serverCount * heartbeatLimit)}});
        Flint.collection('flintClients').remove({heartbeatCounter: {$gt: (serverCount * heartbeatLimit)}});
    }, 1000);

    // Remove clients from collection whose connections drop
    Flint.collection('flintConnections').find().observe({
        removed: function(doc) {
            Flint.collection('flintClients').remove({connectionId: doc.connectionid});
        }
    })
});