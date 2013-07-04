/**
@class Meteor.call
*/

/**
Mechanism for creating or updating a client object
@method checkIn
@param {String} clientId The ID of the client checking in
*/
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

/**
@class Subscriptions
*/

/**
Basic subscription for returning the current client's document.
@method client
@param {String} id The ID of the client subscribing
*/
Meteor.publish("client", function(id) {
  return Flint.clients.find(id);
});

/**
Basic subscription for returning the current station's document.
@method station
@param {String} id The ID of the station document to subscribe to
*/
Meteor.publish("station", function(id) {
  if (id)
    return Flint.stations.find(id);
});

/**
Basic subscription for returning the current simulator's document.
@method simulator
@param {String} id The ID of the station subscribing
*/
Meteor.publish("simulator", function(id) {
  if (id)
    return Flint.simulators.find(id);
});
