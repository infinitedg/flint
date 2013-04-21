Flint = this.Flint || {};

//
// Getters
//

Flint.clientId = function() {
  return Session.get("Flint.clientId");
};

Flint.client = function() {
  var id = Flint.clientId();
  return id ? Flint.clients.findOne(id) : null;
};

Flint.stationId = Utils.memoize(function() {
  var client = Flint.client();
  return client ? client.stationId : null;
});

Flint.station = function() {
  var id = Flint.stationId();
  return id ? Flint.stations.findOne(id) : null;
};

Flint.simulatorId = Utils.memoize(function() {
  var station = Flint.station();
  return station ? station.simulatorId : null;
});

Flint.simulator = function() {
  var id = Flint.simulatorId();
  return id ? Flint.simulators.findOne(id) : null;
};

Flint.cardId = Utils.memoize(function() {
  var result;
  
  if (Flint.station() && Flint.station().cards && Flint.station().cards.length > 0)
    result = Flint.station().cards[0].cardId;
  if (Flint.station() && Flint.station().cardId)
    result = Flint.station().cardId;
  if (Flint.client() && Flint.client().cardId)
    result = Flint.client().cardId;
  
  return result;
});

Flint.layout = Utils.memoize(function() {
  var result = "default";
  
  if (Flint.simulator() && Flint.simulator().layout)
    result = Flint.simulator().layout;
  if (Flint.station() && Flint.station().layout)
    result = Flint.station().layout;
  if (Flint.client() && Flint.client().layout)
    result = Flint.client().layout;
  if (Meteor.isClient && Session.get("layout"))
    result = Session.get("layout");

  return result;
});

Flint.theme = Utils.memoize(function() {
  var result = "default";
  
  if (Flint.simulator() && Flint.simulator().theme)
    result = Flint.simulator().theme;
  if (Flint.station() && Flint.station().theme)
    result = Flint.station().theme;
  if (Flint.client() && Flint.client().theme)
    result = Flint.client().theme;

  return result;
});

Flint.user = Utils.memoize(function() {
  var client = Flint.client();
  return client ? client.user : null;
});

Flint.programmingEnabled = function() {
  return Session.get('Flint.programmingEnabled');
};


//
// Setters
//

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

Flint.setStationId = function(id) {
  if (id !== undefined)
    Flint.clients.update(Flint.clientId(), { $set: { stationId: id }});
  else
    Flint.clients.update(Flint.clientId(), { $unset: { stationId: "" }});
};

Flint.setCardId = function(id) {
  if (id !== undefined)
    Flint.clients.update(Flint.clientId(), { $set: { cardId: id }});
  else
    Flint.clients.update(Flint.clientId(), { $unset: { cardId: "" }});
};

Flint.setProgrammingEnabled = function(tf) {
  Session.set('Flint.programmingEnabled', tf);
};


//
// Actions
//

Flint.logIn = function(name) {
  Flint.clients.update(Flint.clientId(), { $set: { user: name }});
};

Flint.logOut = function() {
  Flint.clients.update(Flint.clientId(), { $set: { user: null }});
};

Flint.resetClient = function() {
  // Remove the client document. It will be automatically re-created.
  var clientId = Deps.nonreactive(function() { return Flint.clientId(); });
  Flint.setClientId(null);
  Flint.clients.remove(clientId);
};

//
// Subscriptions
//

Deps.autorun(function() {
  function heartbeat() {
    if (Flint.client())
      Flint.clients.update(Flint.clientId(), {$set:{heartbeat: new Date()}});
  }
  
  if (! Flint.clientId())
    Meteor.call("checkIn", Cookie.get("clientId"), function(error, result) {
      if (!error) {
        // Sometimes this gets called before the logger is loaded.
        Meteor.startup(function() {
          if (result !== Cookie.get("clientId"))
            Flint.Log.verbose("Using a new clientId");
          Flint.Log.verbose("Using clientId " + result);
        });
        
        Meteor.subscribe("client", result, function() {
          Flint.setClientId(result);
          Meteor.setInterval(heartbeat, 1000);
        });
      }
    });
});

Deps.autorun(function() {
  Meteor.subscribe("station", Flint.stationId());
});

Deps.autorun(function() {
  Meteor.subscribe("simulator", Flint.simulatorId());
});

//
// Handlebars
//

Handlebars.registerHelper('simulator', Flint.simulator);
Handlebars.registerHelper('station', Flint.station);
Handlebars.registerHelper('currentUser', Flint.user);
Handlebars.registerHelper('theme', Flint.theme);
Handlebars.registerHelper('layout', Flint.layout);
Handlebars.registerHelper('cards', Utils.memoize(function() {
  if (Flint.station())
    return Flint.station().cards;
}));
