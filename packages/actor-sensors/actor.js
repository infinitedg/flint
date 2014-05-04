var contactTweens = {},
defaultVelocity = 0.01;

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
		// Flint.Log.data(exc, "actor-sensors");
		Flint.Log.verbose(exc);
	}
});

var updateTweener = function(doc) {
	if (contactTweens[doc._id]) {
		contactTweens[doc._id].stop();
		delete contactTweens[doc._id];
	}
	var dist = Math.sqrt(Math.pow(doc.x - doc.dstX, 2), Math.pow(doc.y - doc.dstY, 2), Math.pow(doc.z - doc.dstZ, 2)),
	velocity = doc.velocity || defaultVelocity;
	contactTweens[doc._id] = new TWEEN.Tween({x: doc.x, y: doc.y, z: doc.z})
		.to({x: doc.dstX, y: doc.dstY, z: doc.dstZ }, Math.round(1000 * dist / velocity))
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate( function() {
			Flint.collection('sensorContacts').update(doc._id, { $set: {x: this.x, y: this.y, z: this.z}});
		})
		.onComplete(function() {
			Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false}});
			delete contactTweens[doc._id];
		})
		.start();
}

var observer = Flint.collection('sensorContacts').find({isMoving: true}).observe({
	added: function(doc) {
		if (doc.x !== doc.dstX || doc.y !== doc.dstY || doc.z !== doc.dstZ) {
			updateTweener(doc);
		}
	},
	changed: function(newDoc, oldDoc) {
		if (newDoc.dstX !== oldDoc.dstX || newDoc.dstY !== oldDoc.dstY || newDoc.dstZ !== oldDoc.dstZ) {
			updateTweener(newDoc);
		}
	},
	removed: function(doc) {
		if (contactTweens[doc._id]) {
			contactTweens[doc._id].stop();
			delete contactTweens[doc._id];
		}
	}
});