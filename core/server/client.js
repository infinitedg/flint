
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

Meteor.publish("client", function(clientId) {
  return Flint.clients.find(clientId);
});