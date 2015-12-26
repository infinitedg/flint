var defaultVelocity = 0.01,
tweenBank = {};

var updateTweener = function(doc) {
	var dist = Math.sqrt(Math.pow(doc.x - doc.dstX, 2) + Math.pow(doc.y - doc.dstY, 2) + Math.pow(doc.z - doc.dstZ, 2)),
	velocity = doc.velocity || defaultVelocity;

	Flint.tween('sensorContacts', doc._id, 1000 * dist / velocity, {x: doc.dstX, y: doc.dstY, z: doc.dstZ});
};

var observer = Flint.collection('sensorContacts').find({isMoving: true}).observe({
	added: function(doc) {
		if (doc.x !== doc.dstX || doc.y !== doc.dstY || doc.z !== doc.dstZ) {
			updateTweener(doc);
		}
	},
	changed: function(newDoc, oldDoc) {
		if (newDoc.dstX !== oldDoc.dstX || newDoc.dstY !== oldDoc.dstY || newDoc.dstZ !== oldDoc.dstZ || newDoc.velocity !== oldDoc.velocity) {
			updateTweener(newDoc);
		}
	},
	removed: function(doc) {
		Flint.cancelTween(doc._animationJobId);
	}
});

var fadeContacts = function(doc){
	var d = Math.sqrt(Math.pow(doc.x, 2) + Math.pow(doc.y, 2) + Math.pow(doc.z, 2));
	Flint.collection('sensorContacts').update({_id:doc._id},{$set:{opacity: 0.6 + Math.sqrt(d) * 0.9}});
	Flint.tween('sensorContacts', doc._id, 7000, {opacity: 0}, {opacity: 0.6 + Math.sqrt(d) * 0.9});
};

var intervalObserver = Flint.collection('systems').find({'name':'Sensors'}).observe({
	changed: function(newDoc, oldDoc){
		if (newDoc.pingInterval.period != oldDoc.pingInterval.period){
			Flint.collection('sensorContacts').find({simulatorId: newDoc.simulatorId}).forEach(function(doc){
				fadeContacts(doc);
			});
		}
	}
});
