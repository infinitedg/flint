var tweenBank = {};

var instID = Math.random();

// Run loop for animation worker
var animationLoop = function() {
	// console.log("loop");
	Meteor.setTimeout(function() {
		TWEEN.update();
		animationLoop();
	}, 1000 / ((Meteor.settings.animation && Meteor.settings.animation.frameRate) || 30)); // Set the frame rate for animations, default to 30
};

// Kick off our animation loop
animationLoop();

// Setup animation worker
// Animation object:
/*
{
	collection: "collectionName",
	objectId: "objectId",
	startParams: { // properties to initialize the animation with // },
	endParams: { // Tween property target values // },

}
*/
var animationQueue = Flint.Jobs.processJobs('animationQueue', 'animation', {
	concurrency: 10
}, function(job, cb) {
	
	job.done();
	cb();
});

Flint.Jobs.collection('animationQueue').find({}).observe({
	added: function(doc) {
		animationQueue.trigger();
	}
});

Flint.animate = function(collectionName, objectId, endParams, startParams) {
	// Get the target document
	var doc = Flint.collection(collectionName).findOne(objectId);

	if (!doc) {
		throw new Meteor.Error('no-such-document', 'No document to animate ' + objectId + ' of collection ' + collectionName);
		return;
	}

	// Make our initial tween parameters consist of only end parameters, with defaults of the document itself and initial settings of startParams
	doc = _.pick(_.extend(doc, startParams), _.keys(endParams));
	var t = new TWEEN.Tween()
}

var updateTweener = function(doc) {
	var oldTween = tweenBank[doc._id];
	if (oldTween) {
		oldTween.stop();
		TWEEN.remove(oldTween);
		delete tweenBank[doc._id];
	}
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
		.onComplete(function() {
			Flint.collection('sensorContacts').update(doc._id, {$set: {isMoving: false}});
		})
		.start();
	tweenBank[doc._id] = t;
};