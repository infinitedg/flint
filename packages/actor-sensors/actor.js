var defaultVelocity = 0.01;

var a = Flint.actor({
	_id:"actor-sensors",
	period: 33,
	action: function(ticks) {
		TWEEN.update();
	},
	onStart: function() {
		// Flint.Log.info("Starting sensors actor", "actor-sensors");
	}, onStop: function(){
		
	}, onKill: function() {
		// Flint.Log.info("actor-sensors killed", "actor-sensors");
	}, onError: function(exc){
		// Flint.Log.error("actor-sensors error", "actor-sensors");
		Flint.Log.data(exc, "actor-sensors");
	}
});

function findTweenById(id) {
	return _.where(TWEEN.getAll(), {contactID: id})[0];
}

var updateTweener = function(doc) {
	TWEEN.remove(findTweenById(doc._id));
	var dist = Math.sqrt(Math.pow(doc.x - doc.dstX, 2) + Math.pow(doc.y - doc.dstY, 2) + Math.pow(doc.z - doc.dstZ, 2)),
	velocity = doc.velocity || defaultVelocity;
	var t = new TWEEN.Tween({x: doc.x, y: doc.y, z: doc.z})
		.to({x: doc.dstX, y: doc.dstY, z: doc.dstZ }, Math.round(1000 * dist / velocity))
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate( function() {
			var d = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
			if (d > 1.2) {
				Flint.collection('sensorContacts').remove(doc._id);
			} else {
				Flint.collection('sensorContacts').update(doc._id, { $set: {x: this.x, y: this.y, z: this.z}});
			}
		})
		.onStart(function() {
			this.contactID = doc._id;
		})
		.onComplete(function() {
			Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false}});
		})
		.start();
}

var observer = Flint.collection('sensorContacts').find({isMoving: true}).observe({
	added: function(doc) {
		// console.log("Added",doc._id);
		if (doc.x !== doc.dstX || doc.y !== doc.dstY || doc.z !== doc.dstZ) {
			updateTweener(doc);
		}
	},
	changed: function(newDoc, oldDoc) {
		if (newDoc.dstX !== oldDoc.dstX || newDoc.dstY !== oldDoc.dstY || newDoc.dstZ !== oldDoc.dstZ || newDoc.velocity !== oldDoc.velocity) {
			// console.log("Changed",newDoc._id, newDoc);
			updateTweener(newDoc);
		}
	},
	removed: function(doc) {
		// console.log("Removed",doc._id);
		TWEEN.remove(findTweenById(doc._id));
	}
});