Meteor.startup(function(){
  Meteor.setInterval(function(){
    var d = new Date();
    // Remove clients that vanish for longer than 10 minutes
    Flint.collection('clients').remove({heartbeat: {$lt: (d.getTime() - 20 * 1000)}});
  }, 10000);
});

Meteor.publish("flint.clientId", function(clientId) {
  return Flint.collection("clients").find(clientId);
});