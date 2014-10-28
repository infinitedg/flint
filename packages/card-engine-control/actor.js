var a = Flint.actor({
	_id:"engineHeat-actor",
	period: function() {
		return 200;
	},
	action: function(ticks) {
		Flint.collection('simulators').find().forEach(function(doc){
			if (!_.isUndefined(doc.heatRate)){ //Don't even worry about it if the simulator doesn't have a heat rate.
				var heatRate = doc.heatRate;
				var warpHeat = doc.engineHeat.warp;
				var impulseHeat = doc.engineHeat.impulse;
				var speed = doc.speed;
				var d = 0;

				if (speed.substr(0,1) === 0){ //Impulse Speed
					wDelta = -0.5;
					iDelta = speed.substr(2,1);
				}
				if (speed.substr(0,1) === 1){ //Warp Speed
					iDelta = -0.5;
					wDelta = speed.substr(2,1) / 2;
					if (wDelta === 0){wDelta = 10;}
				}
				if (speed == "0.0"){
					wDelta = -0.5;
					iDelta = -0.5;
				}
				warpHeat += (wDelta * heatRate / 10);
				impulseHeat += (iDelta * heatRate / 10);
				if (impulseHeat < 0){impulseHeat = 0;}
				if (impulseHeat > 100){impulseHeat = 100;}
				if (warpHeat < 0){warpHeat = 0;}
				if (warpHeat > 100){warpHeat = 100;}
				var engineHeat = {'warp': warpHeat, 'impulse': impulseHeat};
				Flint.simulators.update(doc._id, {$set: {'engineHeat': engineHeat}});
			}

		});
	}, onError: function(exc){
		console.log("ERROR");
		console.log(exc);
	}
});