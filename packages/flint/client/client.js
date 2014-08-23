// var heartbeatInterval = 10 * 1000;
// function setCookie(name,value,days) {
//   if (days) {
//     var date = new Date();
//     date.setTime(date.getTime()+(days*24*60*60*1000));
//     var expires = "; expires="+date.toGMTString();
//   }
//   else var expires = "";
//   document.cookie = name+"="+value+expires+"; path=/";
// }

// function getCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(';');
//   for(var i=0;i < ca.length;i++) {
//     var c = ca[i];
//     while (c.charAt(0)==' ') c = c.substring(1,c.length);
//     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
//   }
//   return null;
// }
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
})
// function clearCookie(name) {
//   setCookie(name,"",-1);
// }

Meteor.startup(function() {
  // var clientIdDep = new Deps.Dependency;

  // Flint.client = function(key, value) {

  //   var clientId = Flint.clientId();
  //   var client = Flint.clients.findOne(clientId);
  //   if (!client) {
  //     clientId = Meteor.call('flint.getClient', clientId, function(e, newClientId) {
  //       setCookie('flint.clientId', newClientId);
  //       clientIdDep.changed();
  //     });
  //     client = Flint.clients.findOne(clientId) || {};
  //   }

  //   if (key && value && client) { // Set a value
  //     delete client['_id']; // Updates disallow _id on mass assignment
  //     client[key] = value;
  //     var d = new Date();
  //     client.updatedOn = d.getTime();
  //     return (Flint.clients.update(clientId, {$set: client}) === 1);
  //   } else if (key && !value && client) { // Get a value
  //     return client[key];
  //   } else { // Get entire object
  //     return client;
  //   }
  // };

  // Flint.clientUnset = function(key) {
  //   var obj = {};
  //   obj[key] = 1;

  //   return (Flint.clients.update(Flint.clientId(), {$unset: obj}) === 1);
  // };

  // Flint.clientId = function() {
  //   clientIdDep.depend();
  //   return getCookie('flint.clientId');
  // };

  // Flint.clients = Flint.collection('clients');

  Flint.login = function(name) {
    return Flint.client('name', name);
  };

  Flint.logout = function() {
    Flint.clientUnset('name');
  };

  Flint.resetClient = function() {
    Meteor.Error(500, "Flint.resetClient() called");
    Meteor.call('flint.resetClient', Flint.clientId());
    clearCookie('flint.clientId');
    clientIdDep.changed()
    var c = Flint.client(); // Creates a new client object since our cookie is now invalid.
    Router.go('/');
  };
  
  Flint.heartbeat = function() {
    Meteor.Error(500, "Flint.heartbeat() called");
    // Meteor.call('flint.heartbeat', Flint.clientId(), Flint.simulatorId(), Flint.stationId());
  };

  // Meteor.setInterval(function(){
  //   Flint.heartbeat();
  // }, heartbeatInterval);

  // Meteor.setTimeout(function() {
  //   Flint.heartbeat();
  // }, 1000);

  // Deps.autorun(function(){
  //   Meteor.subscribe("flint.clientId", Flint.clientId());
  // });
});

// window.onbeforeunload = function() {
//   Flint.resetClient();
//   return;
// };