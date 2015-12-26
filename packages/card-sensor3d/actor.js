Flint.Jobs.createActor('sensor-ping', 500, function() {
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
	});
});
