Flint.Jobs.createActor('engine-thrust', 100, function() {
	Flint.collection('systems').find({'name':'Thrust'}).forEach(function(doc){
		var velocity = parseInt(doc.velocity,10) + parseInt(doc.thrust,10)*10;
		var heat = Math.round((doc.heat + (Math.abs(parseInt(doc.thrust,10)) - 0.5)/50)*100)/100;
		if (heat < 0) {heat = 0;}
		var efficiency = parseInt(doc.efficiency + ((Math.abs(parseInt(doc.thrust,10)) * Math.random()*2) - parseInt(doc.thrust,10)/2))
		if (efficiency < 0){efficiency = 0;}
		if (efficiency > 300){efficiency = 300;}
		var setter = {
			'velocity': velocity,
			'heat': heat,
			'efficiency': efficiency
		}
		Flint.collection('systems').update(doc._id, {$set: setter});
	});
});