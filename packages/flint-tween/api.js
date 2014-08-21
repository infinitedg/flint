
Flint.tween = function(collectionName, objectId, duration, vars) {
	/* Vars can consist of the following:
	* ease: The string version of the easing to use
	* delay: Seconds before starting
	* immediateRender: t/f whether the tween should start immediately
	* overwrite: Control overwrite behavior for conflicting tweens
	* paused: t/f whether the tween starts paused
	* lazy: Lazy-animation to prevent layout thrashing
	*/

	Meteor.call('nextServer', function(err, serverId) {
		if (!err) {
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