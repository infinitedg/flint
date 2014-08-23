/**
@module Core Functionality
*/

/**
* @class Flint
*/

/**
* Smoothly interpolate any object's properties
* @method tween
* @param {String} collectionName The name of the collection in question
* @param {String} objectId The _id of the object in the collection
* @param {Integer} duration The duration in seconds
* @param {Object} vars The properties to be animated and the values for GreenSock (See TweenLite.to)
* @param {Object} beginningState Optional values with which to initialize the object in the collection
*/
Flint.tween = function(collectionName, objectId, duration, vars, beginningState) {
	/* Vars can consist of the following:
	* ease: Name of Ease passed to EaseLookup
	* easeConfig: Array of arguments to pass to easing function, in order
	* delay: Seconds before starting
	* immediateRender: t/f whether the tween should start immediately
	* overwrite: Control overwrite behavior for conflicting tweens
	* paused: t/f whether the tween starts paused
	* lazy: Lazy-animation to prevent layout thrashing
	*/

	Meteor.call('nextServer', function(err, serverId) {
		if (!err) {
			if (beginningState) {
				Flint.collection(collectionName).update(objectId, {$set: beginningState});
			}
			Flint.collection('flintTweens').insert({
				collection: collectionName,
				objId: objectId,
				serverId: serverId,
				duration: duration,
				tweenVars: vars
			});
		} else {
			Flint.Log.error(err);
		}
	});
};