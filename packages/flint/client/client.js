Meteor.startup(function() {
  var clientIdDep = new Deps.Dependency;

  var getCookie = function(c_name)
  {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1)
      {
      c_start = c_value.indexOf(c_name + "=");
      }
    if (c_start == -1)
      {
      c_value = null;
      }
    else
      {
      c_start = c_value.indexOf("=", c_start) + 1;
      var c_end = c_value.indexOf(";", c_start);
      if (c_end == -1)
      {
    c_end = c_value.length;
    }
    c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
  };

  var setCookie = function (c_name,value,exdays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
  };

  Flint.client = function(key, value) {
    var clientId = Flint.clientId();
    var d = new Date();
    var client = Flint.collection('clients').findOne(clientId);
    if (!client) {
      clientId = Flint.collection('clients').insert({createdOn: d.getTime(), heartbeat: d.getTime() });
      setCookie('flint.clientId', clientId);
      clientIdDep.changed();
    }

    if (key && value && client) { // Set a value
      delete client['_id']; // Updates disallow _id on mass assignment
      client[key] = value;
      client.updatedOn = d.getTime();
      return (Flint.collection('clients').update(clientId, {$set: client}) === 1);
    } else if (key && !value && client) { // Get a value
      return client[key];
    } else { // Get entire object
      return client;
    }
  };

  Flint.clientUnset = function(key) {
    var client = Flint.client();
    var obj = {};
    obj[key] = 1;

    return (Flint.collection('clients').update(client._id, {$unset: obj}) === 1);
  };

  Flint.clientId = function() {
    clientIdDep.depend();
    return getCookie('flint.clientId');
  };

  Flint.login = function(name) {
    return Flint.client('name', name);
  };

  Flint.logout = function() {
    Flint.clientUnset('name');
  };

  Flint.resetClient = function() {
    var newClientId = Flint.collection('clients').insert({createdOn: d.getTime(), heartbeat: d.getTime() });
    var oldClientId = Flint.clientId();
    setCookie('flint.clientId', newClientId);
    clientIdDep.changed();
    Flint.collection('clients').remove(oldClientId);
    document.cookie = 'flint.clientId=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };
});