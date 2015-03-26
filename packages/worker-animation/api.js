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
	// Get the target document
	// var doc = Flint.collection(collectionName).findOne(objectId);

	// if (!doc) {
	// 	throw new Meteor.Error('no-such-document', 'No document to animate ' + objectId + ' of collection ' + collectionName);
	// 	return;
	// }

	// Make our initial tween parameters consist of only end parameters, with defaults of the document itself and initial settings of startParams
	// doc = _.pick(_.extend(doc, startParams), _.keys(endParams));

    var job = new Job(Flint.Jobs.collection('animationQueue'), 'animation', {
    	collection: collectionName,
    	objId: objectId,
    	duration: duration,
    	tweenVars: vars
    });

    job.delay(0)
    .priority('high')
    .retry({retries: 0})
    .save();
	
}
