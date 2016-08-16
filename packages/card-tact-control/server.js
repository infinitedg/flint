	Meteor.publish("card.viewscreen.tacticaltweens",function(simulatorId) {
		return Flint.collection('tacticaltweens').find({'simulatorId': simulatorId});
	});

	Meteor.publish("card.viewscreen.tacticalscreens",function(){
		return Flint.collection('tacticalscreens').find();
	});

	Meteor.publish("card.viewscreen.tacticalcontacts",function(tacticalScreen){
		return Flint.collection('tacticalContacts').find({tacticalScreen: tacticalScreen});
	});

	Meteor.publish("card.viewscreen.tacticaltemplatecontacts",function(){
		return Flint.collection('tacticalTemplateContacts').find();
	});

	var defaultVelocity = 1,
	tweenBank = {};
	Meteor.setInterval(function(){
		TWEEN.update();
	},64);

	var updateTweener = function(doc) {
		var oldTween = tweenBank[doc._id];
		if (oldTween) {
			oldTween.stop();
			TWEEN.remove(oldTween);
			delete tweenBank[doc._id];
		}
		var dist = Math.sqrt(Math.pow(doc.x - doc.dstX, 2) + Math.pow(doc.y - doc.dstY, 2)),
		velocity = doc.velocity || defaultVelocity;
		var t = new TWEEN.Tween({x: doc.x, y: doc.y,})
		.to({x: doc.dstX, y: doc.dstY}, Math.round(100*(dist * (1/Math.sqrt(velocity)) * 0.5)))
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate( function() {
			Flint.collection('tacticalcontacts').update(doc._id, { $set: {x: this.x, y: this.y}});
		})
		.onComplete(function() {
			Flint.collection('tacticalcontacts').update(doc._id, {$set: {isMoving: false}});
		})
		.start();
		tweenBank[doc._id] = t;
	};

	var observer = Flint.collection('tacticalcontacts').find({isMoving: true}).observe({
		added: function(doc) {
			if (doc.x !== doc.dstX || doc.y !== doc.dstY) {
				updateTweener(doc);
			}
		},
		changed: function(newDoc, oldDoc) {
			if (newDoc.dstX !== oldDoc.dstX || newDoc.dstY !== oldDoc.dstY || newDoc.velocity !== oldDoc.velocity) {
				updateTweener(newDoc);
			}
		},
		removed: function(doc) {
			TWEEN.remove(tweenBank[doc._id]);
		}
	});