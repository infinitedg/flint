Meteor.startup(function() {
	var a = Flint.actor({
		_id:"actor-sensors",
		period: 33,
		action: function(ticks) {
			var dt = ticks / 1000; // Change in time between this frame and the prior frame
			var c = Flint.collection('sensorContacts').find({isMoving: true}).forEach(function(doc){
				// Recalculate sensor position
				var v = doc.velocity || 0.01; // Defaults to 1/100 grid/second
				var x0 = doc.x;
				var y0 = doc.y;
				var z0 = doc.z;
				var x  = doc.dstX;
				var y  = doc.dstY;
				var z  = doc.dstZ;

				if (x0 === x && y0 === y && z0 === z) {
				  Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false}});
				  // @TODO Remove the following movement simulation.
				  // Flint.collection('sensorContacts').update(doc._id, {$set: {dstX: Math.random(), dstY: Math.random(), dstZ: Math.random(), velocity: Math.random() / 2.0, isMoving: true}});
				  return;
				}

				// First, if the velocity is zero then move the contact there immediately
				if (v === 0) {
					Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false, x: doc.dstX, y: doc.dstY, z: doc.dstZ }});
					// @TODO Remove the following movement simulation
					// Flint.collection('sensorContacts').update(doc._id, {$set: {dstX: Math.random(), dstY: Math.random(), dstZ: Math.random(), velocity: Math.random() * 10, isMoving: true}});
					return;
				}

				// 1. Calculate the distance in x, y, and direct (h)
				var dx = Math.abs(x - x0); // Distance between current sprite location and intended location on the x-axis
				var dy = Math.abs(y - y0); // Distance between current sprite location and intended location on the y-axis
				var dz = Math.abs(z - z0); // Distance between current sprite location and intended location on the z-axis
				var h  = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2)); // Distance between current sprite location and intended location (the hypotenuse)
				
				// 2. Calculate angles theta & phi
				var th = Math.acos(dx / h);
				var ph = Math.asin(dy / h);

				// IF the distance between the sprite and its 
				// target destination is less than the distance between 
				// the sprite and it's planned location,
				// THEN set the planned location to its target location
				var vdt; // Velocity * change in time
				if (v * dt > h) {
				  vdt = h;
				} else {
				  vdt = v * dt;
				}

				var x1, y1, z1;
				if (x0 - x < 0) {
				  x1 = x0 + vdt * Math.cos(th);
				} else {
				  x1 = x0 - vdt * Math.cos(th);
				}

				if (y0 - y < 0) {
				  y1 = y0 + vdt * Math.sin(th);
				} else {
				  y1 = y0 - vdt * Math.sin(th);
				}

				if (z0 - z < 0) {
				  z1 = z0 + vdt * Math.sin(ph);
				} else {
				  z1 = z0 - vdt * Math.sin(ph);
				}

				// If the sprite is out of bounds, then remove it
				// @TODO Figure out visibility and bounding
				// var isVisible;
				// if (Math.sqrt(Math.pow(x1 - 0.5, 2) + Math.pow(y1 - 0.5, 2) + Math.pow(z1 - 0.5,2)) > 0.5) {
				// 	isVisible = false
				// } else {
				// 	isVisible = true;
				// }

				// 3. Set the location of this sprite to the new location
				Flint.collection('sensorContacts').update(doc._id, {$set: {x: x1, y: y1, z: z1, isVisible: true}});

			});
		},
		onStart: function() {
			// Flint.Log.info("Starting sensors actor", "actor-sensors");
		}, onStop: function(){
			
		}, onKill: function() {
			// Flint.Log.info("actor-sensors killed", "actor-sensors");
		}, onError: function(exc){
			// Flint.Log.error("actor-sensors error", "actor-sensors");
			// Flint.Log.data(exc, "actor-sensors");
			console.log(exc);
		}
	});
});