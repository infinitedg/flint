Meteor.startup(function() {
	var a = Flint.actor({
		_id:"actor-sensors",
		period: 300,
		action: function(ticks) {
			// Recalculate sensor positions
		},
		onStart: function() {
			// Flint.Log.info("Starting sensors actor", "actor-sensors");
		}, onStop: function(){
			
		}, onKill: function() {
			// Flint.Log.info("actor-sensors killed", "actor-sensors");
		}, onError: function(exc){
			// Flint.Log.error("actor-sensors error", "actor-sensors");
			// Flint.Log.data(exc, "actor-sensors");
		}
	});
});