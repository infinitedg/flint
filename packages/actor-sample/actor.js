var a = Flint.actor({
	_id:"my-actor",
	period: function() {
		return 1000;
	},
	action: function() {
		console.log("hello world!");
	},
	onStart: function() {
		console.log("STARTING");
	}, onStop: function(){
		console.log("STOPPING");
	}, onKill: function() {
		console.log("KILLING");
	}, onError: function(){
		console.log("ERROR");
	}
});

Meteor.setTimeout(function(){
	console.log("Stopping actor");
	a.stop();
}, 5000);

Meteor.setTimeout(function(){
	console.log("Restarting actor");
	a.start();
}, 10000);

Meteor.setTimeout(function(){
	console.log("Changing period");
	a.period = 500
}, 15000);

Meteor.setTimeout(function(){
	console.log("Restoring period");
	a.period = 1000
}, 20000);

Meteor.setTimeout(function(){
	console.log("Killing actor");
	a.kill();
}, 25000);