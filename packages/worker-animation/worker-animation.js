var tweenBank = {},
gsTweenProps = [
	'ease',
	'easeConfig',
	'delay',
	'immediateRender',
	'overwrite',
	'paused',
	'lazy',
	'onUpdate',
	'onComplete',
	'data'
	];

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
Flint.Jobs.processJobs('animationQueue', 'animation', {
	concurrency: 125
}, function(job, cb) {
	var targetObj = Flint.collection(job.data.collection).findOne(job.data.objId);

	// Fail if our intended animation does not exist
	if (!targetObj) {
		job.fail({
			reason: 'Attempt to animate non-existent document. Cancelling animation job.'
		}, {
			fatal: true
		});
		cb();
		return;
	}

	// We are already animating this document: cancel that job
	if (targetObj._animationJobId) {
		job.log('Cancelling existing animation ' + targetObj._animationJobId + ' for ' + job.data.collection + '.' + job.data.objId);
		Flint.cancelTween(targetObj._animationJobId);
	}

	var gsVars = job.data.tweenVars || {};

	// Configure easing
	if (gsVars.ease) {
		try {
			var ease = EaseLookup.find(gsVars.ease);
			if (ease.config && gsVars.easeConfig) {
				ease = ease.config.apply(undefined, gsVars.easeConfig);
			}
			gsVars.ease = ease;
		} catch (e) {
			job.log('Failed to config tween easing ' + doc.tweenVars.ease, {level: 'warning'});
			delete gsVars.ease;
		}
	}

	gsVars.onUpdate = Meteor.bindEnvironment(function() {
		// Animate the object (without the _gsTweenID property)
		var newValues = _.omit(tweenBank[job._doc._id].target,['_gsTweenID']);
		Flint.collection(job.data.collection).update(job.data.objId, {$set: newValues});
		if (job.progress() === false || job.progress() === null) {
			console.log(tweenBank[job._doc._id]);
			tweenBank[job._doc._id].kill();
			Flint.collection(job.data.collection).update({_id: job.data.objId}, {$unset: {_animationJobId: 1}});
			delete tweenBank[job._doc._id];
			job.fail('Animation cancelled during tween');
			cb();
		}
	});

	gsVars.onComplete = Meteor.bindEnvironment(function() {
		Flint.collection(job.data.collection).update({_id: job.data.objId}, {$unset: {_animationJobId: 1}});
		delete tweenBank[job._doc._id];
		job.done();
		cb();
	});

	gsVars.data = {
		collection: job.data.collection,
		objId: job.data.objId,
		tweenDocId: job._doc._id
	};


	// Retrieve the values we are tweening from
	/* This one-liner does the following:
		1. Grabs the keys of tweenVars
		2. Filters out Greensock paramaters
		3. Maps this into an array of arrays, where each array is [key, 1]
		4. Converts this into a field specifier for Meteor e.g. {field: 1, field: 1}
		5. Tacks on _id: 0 to ignore the _id attribute */
	var fieldMask = _.extend(
		_.object(
			_.map(
				_.difference(
					_.keys(job.data.tweenVars),
					gsTweenProps
					),
				function(key) { return [key, 1]; })
			),
		{_id: 0});


	var sourceObj = Flint.collection(job.data.collection).findOne({_id: job.data.objId}, {fields: fieldMask}) || {};

	// Warn if we are trying to tween something that doesn't exist on sourceObj
	// set to defaults of zero
	// If doc.tweenVars is trying to tween keys on sourceObj that do not exist...
	var keysWithoutDefaults = _.keys(
		_.omit(job.data.tweenVars,
			_.union(gsTweenProps, _.keys(sourceObj)
				)
			)
		);
	if (keysWithoutDefaults.length > 0) {
		job.log('Assuming default of 0 while animating ' +
			job.data.collection + '.' + job.data.objId + ' ' +
			keysWithoutDefaults.join(' ,'), {level: 'warning'});

		// ... then set the defaults of sourceObj's missing keys to 0
		/* This one-liner does the following:
		1. Filters out the gsTweenProps
		2. Grabs the keys and maps them with zero defaults
		3. Creates an object out of it
		4. Uses this to drop defaults of zero on top
		*/
		sourceObj = _.defaults(sourceObj,
			_.object(
				_.map(
					_.keys(
						_.omit(job.data.tweenVars, gsTweenProps)
					),
					function(key) { return [key,0]; }
				)
			)
		);
	}

	tweenBank[job._doc._id] = TweenLite.to(sourceObj, job.data.duration / 1000, gsVars);

	Flint.collection(job.data.collection).update({_id: job.data.objId}, {$set: {_animationJobId: job._doc._id}});
});

Flint.Jobs.collection('animationQueue').find({status: 'ready'}).observe({
	added: function(doc) {
		Flint.Jobs.queue('animationQueue', 'animation').trigger();
	}
});
