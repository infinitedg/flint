
Meteor.methods({
  checkIn: function(clientId) {
    var client = Flint.clients.find(clientId);
    if (client.count() === 0) {
      if (clientId)
        Flint.clients.insert({ _id: clientId });
      else
        clientId = Flint.clients.insert({});
    }
    
    return clientId;
  }
});

Meteor.publish("client", function(id) {
  return Flint.clients.find(id);
});

Meteor.publish("station", function(id) {
  if (id)
    return Flint.stations.find(id);
});

Meteor.publish("simulator", function(id) {
  if (id)
    return Flint.simulators.find(id);
});
