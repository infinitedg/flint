var a = Flint.actor({
	_id:"sensor-ping",
	period: 500,
	action: function(ticks) {
		Flint.collection('systems').find({'name':'Sensors'}).forEach(function(doc){
			if (!_.isEmpty(doc.pingInterval) && doc.pingInterval.period != 'manual'){
				var setter = {
						pingInterval: {
							triggered: doc.pingInterval.triggered,
							period: doc.pingInterval.period
						}
					};
				if (doc.pingInterval.triggered + doc.pingInterval.period < Date.now()){
					setter.pingInterval.triggered = Date.now();
				}
				Flint.systems.update(doc._id, {$set: setter});
			}
			//console.log(doc.pingInterval.triggered + doc.pingInterval.period - Date.now());
		});
	},
	onStart: function() {
		console.log("STARTING");
	}, onStop: function(){
		console.log("STOPPING");
	}, onKill: function() {
		console.log("KILLING");
	}, onError: function(exc){
		console.log("ERROR");
		console.log(exc);
	}
});
