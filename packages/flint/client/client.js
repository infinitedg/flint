UI.registerHelper('alertStyle', function(){
  var a = Flint.simulator('alertCondition');
  switch (a) {
    case 'c':
    case 'cloak':
    case 'purple':
      return 'cloakColor';
    case 5:
      return 'nominalColor';
    case 4:
      return 'attentionColor';
    case 3:
      return 'cautionColor';
    case 2:
      return 'warningColor';
    case 1:
      return 'dangerColor';
  }
});

Flint.login = function(name) {
  return Flint.client('name', name);
};

Flint.logout = function() {
  Flint.client('name', undefined);
};

// Setup Flint methods
Flint.connectionId = function() {
  return Session.get('flint.connectionId');
};

Flint.client = function(key, val) {
  var client = Flint.collection('flintClients').findOne({connectionId: Flint.connectionId()}) || {};
  if (arguments.length == 2) {
    var updateObj = {}, statement;
    if (val === undefined) { // Remove the key
      updateObj[key] = "";
      statement = {$unset: updateObj};
    } else {
      updateObj[key] = val;
      statement = {$set: updateObj};
    }
    Flint.collection('flintClients').update({_id: client._id}, statement);
  } else if (arguments.length == 1) {
    return client[key];
  } else {
    return client;
  }
};

Flint.clientId = Utils.memoize(function() {
  var client = Flint.collection('flintClients').findOne({connectionId: Flint.connectionId()}) || {};
  return client._id;
});

Flint.system = function(sysName, key, val) {
  if (arguments.length == 0) { // An unusual case, but we'll handle it
    return Flint.systems.find();
  }

  var system = Flint.systems.findOne({name: sysName}) || {};
  if (arguments.length == 3) { // Set a system property
    var updateObj = {}, statement;
    if (val === undefined) { // Remove the key
      updateObj[key] = "";
      statement = {$unset: updateObj};
    } else { // Set the key
      updateObj[key] = val;
      statement = {$set: updateObj};
    }
    Flint.systems.update({_id: system._id}, statement);
  } else if (arguments.length == 2) { // Retrieve a property
    return system[key];
  } else if (arguments.length == 1) { // Retrieve the system
    return system;
  }
};

Flint.simulator = function(key, val) {
  var simulator = Flint.simulators.findOne(Session.get("flint.simulatorId"));
  if (arguments.length == 2) { // Update/unset
    var updateObj = {}, statement;
    if (val === undefined) { // Remove the key
      updateObj[key] = "";
      statement = {$unset: updateObj};
    } else {
      updateObj[key] = val;
      statement = {$set: updateObj};
    }
    Flint.simulators.update({_id: simulator._id}, statement);
  } else if (arguments.length == 1) {
    return simulator[key];
  } else {
    return simulator;
  }
};

Flint.simulatorId = function() {
  return Session.get("flint.simulatorId");
};

Flint.station = function(key, val) {
  var station = Flint.stations.findOne(Session.get("flint.stationId"));
  if (arguments.length == 2 && station) { // Update/unset
    var updateObj = {}, statement;
    if (val === undefined) { // Remove the key
      updateObj[key] = "";
      statement = {$unset: updateObj};
    } else {
      updateObj[key] = val;
      statement = {$set: updateObj};
    }
    Flint.stations.update({_id: station._id}, statement);
  } else if (arguments.length == 1 && station) {
    return station[key];
  } else {
    return station;
  }
};

Flint.stationId = function() {
  return Session.get("flint.stationId");
};

Flint.card = function() {
  var station = Flint.station();
  if (station)
    return station.cards[Session.get("flint.cardNumber")];
};

Flint.cardNumber = function() {
  return Session.get("flint.cardNumber");
};

Flint.cardId = function() {
  var card = Flint.card() || {};
  return card.cardId;
};

// Automatically change layouts based on current selection
Flint.layout = Utils.memoize(function() {
  if (Router.current()) {
    var layout,
    params = Router.current().params, 
    station = Flint.stations.findOne(params.stationId), 
    simulator = Flint.simulators.findOne(params.simulatorId);

    if (station && simulator) { // If we haven't loaded anything, then use our default layout
      layout = Flint.client('layout') || station.layout || simulator.layout || 'layout_default';
    } else {
      layout = 'flint_layout';
    }
    return layout;
  }
});

Flint.theme = Utils.memoize(function() {
  if (Flint.station() && Flint.simulator()) {
    var theme = Flint.client('theme') || Flint.station().theme || Flint.simulator().theme || 'default';
    if (Flint.station().name != "Flight Director"){
      return '/themes/' + theme + '/css/theme.css';
    } else {
      return '/themes/' + theme + '/css/core.css';
    }
  }
});