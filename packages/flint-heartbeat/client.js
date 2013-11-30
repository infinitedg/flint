Meteor.startup(function(){
	Flint.heartbeat = function() {
	  var d = new Date();
	  Flint.client('heartbeat', d.getTime());
	};

	Meteor.subscribe("flint.clientId", Flint.clientId(), function() {
	  Meteor.setInterval(function(){
	    Flint.heartbeat();
	  }, 10000);
	});
});