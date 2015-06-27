Flint.Jobs.createActor('engineHeat-actor', 200, function() {
	Flint.collection('systems').find({'name':'Engines'}).forEach(function(doc){
		if (typeof doc.heatRate != 'undefined'){ //Don't even worry about it if the simulator doesn't have a heat rate.
		var heatRate = doc.heatRate;
		if (typeof doc.heat != 'object'){
			doc.heat = {'impulse':0,'warp':0};
		}
		var warpHeat = doc.heat.warp;
		var impulseHeat = doc.heat.impulse;
		var speed = doc.speed;
		var d = 0;

		if (speed.substr(0,1) == '0'){ //Impulse Speed
			wDelta = -0.5;
			iDelta = speed.substr(2,1);
		}
		if (speed.substr(0,1) == '1'){ //Warp Speed
			iDelta = -0.5;
			wDelta = speed.substr(2,1) / 2;
			if (wDelta === 0){
				wDelta = 10;
			}
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
		Flint.collection('systems').update(doc._id, {$set: {'heat': engineHeat}});
	}

});
});
