/**
@class Flint
*/
Flint = this.Flint || {};

//
// Getters
//

/** 
 * Get the current client id.
 *
 * When a client connects to the server for the first time, it asks the server 
 * for a unique clientId that references a document in the `Flint.clients`
 * collection.
 *  
 * After the first connection to the server, the client will save the client id
 * in local storage so that client will keep its identity when the page is 
 * reloaded.
 *  
 * Currently this method can only be called from the client, in the future
 * it will be capable of being called from anywhere.
 *  
 * @return {String} a document ID unique to the client.
 * @method clientId
 */
Flint.clientId = function() {
  return Session.get("Flint.clientId");
};

/**
 * Get the current client document. 
 *
 * @return {Object} a document unique to the client.
 * @method client
 */
Flint.client = function() {
  var id = Flint.clientId();
  return id ? Flint.clients.findOne(id) : null;
};

/** 
 * Get the station ID of the current client.
 *
 * @return {String} the ID of the current client's station.
 * @method stationId
 */
Flint.stationId = Utils.memoize(function() {
  var client = Flint.client();
  return client ? client.stationId : null;
});

/**
 * Get the station document of the current client.
 *
 * @return {Object} the station document of the current client.
 * @method station
 */
Flint.station = function() {
  var id = Flint.stationId();
  return id ? Flint.stations.findOne(id) : null;
};

/**
 * Get the simulator ID of the current client.
 *
 * The simulator ID is derived from the current client's station document.
 * 
 * 
 * @method simulatorId
 * @return {String} the simulator id of the current client.
 */
Flint.simulatorId = Utils.memoize(function() {
  var station = Flint.station();
  return station ? station.simulatorId : null;
});

/**
 * Get the simulator document of the current client.
 *
 * The simulator document is derived from the current client's station document.
 * 
 * @method simulator
 * @return {Object} the simulator document of the current client.
 */
Flint.simulator = function() {
  var id = Flint.simulatorId();
  return id ? Flint.simulators.findOne(id) : null;
};

/**
 * Get the participant name of the current client.
 *
 * @method user
 * @return {String} the participant name of the current client.
 */
Flint.user = Utils.memoize(function() {
  var client = Flint.client();
  return client ? client.user : null;
});

//
// Setters
//

/**
 * Set the current clientId.
 *
 * The client ID will be saved in a cookie for use by future instances of Flint,
 * which enables Flint to recognize which client is which and makes the client's
 * identity consistent across reloads.
 *
 * @param {String} id the ID of a document in `Flint.clients`
 * @private
 * @method setClientId
 */
Flint.setClientId = function(id) {
  if (id)
    // Allow us to open multiple client instances until we select the current
    // station.
    Deps.autorun(function() {
      if (Flint.stationId()) {
        Cookie.set("clientId", id);
        this.stop();
      }
    });
  else
    Cookie.remove("clientId");
    
  Session.set("Flint.clientId", id);
};

/**
 * Set the current station.
 *
 * The current simulator ID is derived from the client's station ID.
 * @param {String} id the ID of a document in `Flint.clients`
 * @method setStationId
 */
Flint.setStationId = function(id) {
  if (id !== undefined)
    Flint.clients.update(Flint.clientId(), { $set: { stationId: id }});
  else
    Flint.clients.update(Flint.clientId(), { $unset: { stationId: "" }});
};

//
// Actions
//

/**
 * Log in using an arbitrary participant name.
 *
 * "Logging in" is probably a misuse of terms, as we really don't do any kind of
 * authentication. The current user is nothing more than a name tied to a
 * client.
 *
 * @param {String} name a participant name to set as the current participant 
 *        name for the client.
 * @method logIn
 */
Flint.logIn = function(name) {
  Flint.clients.update(Flint.clientId(), { $set: { user: name }});
};

/**
 * Log out of the current participant.
 *
 * Sets the participant name to null.
 * @method logout
 */
Flint.logOut = function() {
  Flint.clients.update(Flint.clientId(), { $set: { user: null }});
};

/**
 * Reset the client.
 *
 * Requests that the server send us a fresh, new client document to use. This
 * will reset all client-specific fields.
 * @method resetClient
 */
Flint.resetClient = function() {
  // Remove the client document. It will be automatically re-created.
  var clientId = Deps.nonreactive(function() { return Flint.clientId(); });
  Flint.setClientId(null);
  Flint.clients.remove(clientId);
};

//
// Subscriptions
//

/**
 * Tells the server the client is still alive.
 *
 * Tells the server "Hey, I'm here!". The server will give the client a new ID
 * if the old one is stale.
 * @method heartbeat
 */
Flint.heartbeat = function() {
  var prevClientId = Session.get("Flint.clientId") || Cookie.get("clientId");
  
  Meteor.call("heartbeat", prevClientId, function(error, newClientId) {
    if (!error && newClientId !== Session.get("Flint.clientId"))
      Meteor.subscribe("client", newClientId, function() {
        Flint.setClientId(newClientId);
        
        // Sometimes this gets called before the logger is loaded, so wait until
        // startup to log this info.
        Meteor.startup(function() {
          Flint.Log.verbose("Using a new clientId");
          Flint.Log.verbose("Using clientId " + result);
        });
      });
  });
};

// Whenever a client ID is null, the client will ask the server to send it a new
// client ID.
// XXX: Possible race condition if clientId gets set to null.
Deps.autorun(function() {
  if (! Flint.clientId())
    Flint.heartbeat();
  if (! Flint.client())
    Flint.heartbeat();
});

Meteor.setInterval(Flint.heartbeat, 1000);

Deps.autorun(function() {
  Meteor.subscribe("station", Flint.stationId());
});

Deps.autorun(function() {
  Meteor.subscribe("simulator", Flint.simulatorId());
});

//
// Handlebars
//

/**
 * Returns the current simulator document.
 * @method simulator
 */
Handlebars.registerHelper('simulator', Flint.simulator);

/**
 * Returns the current station document.
 * @method station
 */
Handlebars.registerHelper('station', Flint.station);

/**
 * Returns the currently logged in participant name.
 * @method currentUser
 */
Handlebars.registerHelper('currentUser', Flint.user);
