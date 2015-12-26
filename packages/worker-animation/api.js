// @TODO consider making this its own package, or splitting the worker component
// 				into a separate package from the scheduler.
/**
* Smoothly interpolate any object's properties
* @method tween
* @param {String} collectionName The name of the collection in question
* @param {String} objectId The _id of the object in the collection
* @param {Integer} duration The duration in miliseconds
* @param {Object} vars The properties to be animated and the values for GreenSock (See TweenLite.to)
* @param {Object} beginningState Optional values with which to initialize the object in the collection
*/
Flint.tween = function(collectionName, objectId, duration, vars, beginningState) {
    var job = new Job(Flint.Jobs.collection('animationQueue'), 'animation', {
    	collection: collectionName,
    	objId: objectId,
    	duration: duration,
    	tweenVars: vars
    });

    return job.delay(0)
    .priority('high')
    .retry({retries: 0})
    .save();
};

Flint.cancelTween = function(tweenJobId) {
    Flint.Jobs.collection('animationQueue').cancelJobs([tweenJobId]);
};
