var tweenBank = {};

Meteor.startup(function(){
	// @TODO Get this observer to re-run reactively when the server ID changes
	Flint.collection('flintTweens').find({serverId: Flint.serverId()}).observe({
		added: function(doc) {
			var sourceObj = Flint.collection(doc.collection).findOne({_id: doc.objId}) || {},
			gsVars = doc.tweenVars || {};
			if (gsVars.ease) {
				try {
					gsVars.ease = EaseLookup.find(gsVars.ease);
				} catch (e) {
					Flint.Log.error('Failed to config tween ' + doc.tweenVars.ease);
				}
			}

			gsVars.onUpdate = function() {
				var newValues = this.target;
				console.log(newValues);
				// Flint.collection(doc.collection).update({_id: doc.objId}, {$set: })
			};

			tweenBank[doc._id] = TweenLite.to(sourceObj, doc.duration, gsVars);
		},
		changed: function(newDoc, oldDoc) {

		},
		removed: function(doc) {

		}
	});

	Flint.collection('flintServers').find().observe({
		removed: function(doc) {
			// When a server drops, update all tweens for that server to a new server
			Flint.Log.info("Moving tweens from server " + doc.serverId + " to new server", 'flint-tween');
			var serverId = Meteor.call('nextServer');
			Flint.collection('flintTweens').update({serverId: doc.serverId}, 
				{$set: {serverId: Meteor.call('nextServer')}}, {multi: true});
		}
	});

	Flint.collection('flintTweens').find().observe({
		added: function(doc) {
			if (Flint.collection('flintServers').find({serverId: doc.serverId}).count() == 0) {
				Flint.Log.info("Moving tween " + doc._id + " to new server", 'flint-tween');
				var serverId = Meteor.call('nextServer');
				Flint.collection('flintTweens').update({serverId: doc.serverId}, 
					{$set: {serverId: Meteor.call('nextServer')}}, {multi: true});
			}
		}
	});
});

// var defaultVelocity = 0.01,
// tweenBank = {};

// var a = Flint.actor({
// 	_id:"actor-sensors",
// 	period: 33,
// 	action: function(ticks) {
// 		TWEEN.update();
// 	},
// 	onStart: function() {
// 		// Flint.Log.info("Starting sensors actor", "actor-sensors");
// 	}, onStop: function(){
		
// 	}, onKill: function() {
// 		// Flint.Log.info("actor-sensors killed", "actor-sensors");
// 	}, onError: function(exc){
// 		// Flint.Log.error("actor-sensors error", "actor-sensors");
// 		Flint.Log.data(exc, "actor-sensors");
// 	}
// });

// var updateTweener = function(doc) {
// 	var oldTween = tweenBank[doc._id];
// 	if (oldTween) {
// 		oldTween.stop();
// 		TWEEN.remove(oldTween);
// 		delete tweenBank[doc._id];
// 	}
// 	var dist = Math.sqrt(Math.pow(doc.x - doc.dstX, 2) + Math.pow(doc.y - doc.dstY, 2) + Math.pow(doc.z - doc.dstZ, 2)),
// 	velocity = doc.velocity || defaultVelocity;
// 	var t = new TWEEN.Tween({x: doc.x, y: doc.y, z: doc.z})
// 		.to({x: doc.dstX, y: doc.dstY, z: doc.dstZ }, Math.round(1000 * dist / velocity))
// 		.easing(TWEEN.Easing.Linear.None)
// 		.onUpdate( function() {
// 			var d = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
// 			if (d > 1.2) {
// 				Flint.collection('sensorContacts').remove(doc._id);
// 			} else {
// 				Flint.collection('sensorContacts').update(doc._id, { $set: {x: this.x, y: this.y, z: this.z}});
// 			}
// 		})
// 		.onComplete(function() {
// 			Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false}});
// 		})
// 		.start();
// 	tweenBank[doc._id] = t;
// }

// var fadeContacts = function(doc){
// 	var oldTween = tweenBank[doc._id + "o"]; //Add on the 'o' do differentiate from movement tweens
// 	if (oldTween) {
// 		oldTween.stop();
// 		TWEEN.remove(oldTween);
// 		delete tweenBank[doc._id + "o"];
// 	}
// 	d = Math.sqrt(Math.pow(doc.x, 2) + Math.pow(doc.y, 2) + Math.pow(doc.z, 2)) ;
// 	var t = new TWEEN.Tween({opacity: 0.6 + Math.sqrt(d)*.9})
// 	.to({opacity: 0}, 7000)
// 	.easing(TWEEN.Easing.Linear.None)
// 	.onUpdate(function(){
// 		if (this.opacity < 1){
// 			Flint.collection('sensorContacts').update(doc._id, {$set: {opacity: this.opacity}});
// 		}
// 	})
// 	.start();
// 	tweenBank[doc._id + "o"] = t;

// }
// var intervalObserver = Flint.simulators.find().observe({
// 	changed: function(newDoc, oldDoc){
// 		if (newDoc.pingInterval != oldDoc.pingInterval){
// 			/*if (newDoc.pingInterval.updated == 'true'){
// 				console.log('changing');
// 				var setter = {
// 					triggered: oldDoc.pingInterval.triggered,
// 					period: newDoc.pingInterval.period
// 				};
// 				Flint.simulators.update(newDoc._id, {$set: setter});
// 			}
// 			else{*/
// 				Flint.collection('sensorContacts').find({simulatorId: newDoc._id}).forEach(function(doc){
// 					fadeContacts(doc);
// 				});
// 			//}
// 		}
// 	}
// });
// var observer = Flint.collection('sensorContacts').find({isMoving: true}).observe({
// 	added: function(doc) {
// 		if (doc.x !== doc.dstX || doc.y !== doc.dstY || doc.z !== doc.dstZ) {
// 			updateTweener(doc);
// 		}
// 	},
// 	changed: function(newDoc, oldDoc) {
// 		if (newDoc.dstX !== oldDoc.dstX || newDoc.dstY !== oldDoc.dstY || newDoc.dstZ !== oldDoc.dstZ || newDoc.velocity !== oldDoc.velocity) {
// 			updateTweener(newDoc);
// 		}
// 	},
// 	removed: function(doc) {
// 		TWEEN.remove(tweenBank[doc._id]);
// 	}
// });