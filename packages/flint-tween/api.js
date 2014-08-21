
Flint.tween = function(collectionName, objectId, duration, vars) {
	/* Vars can consist of the following:
	* ease: Name of Ease passed to EaseLookup
	* easeConfig: Config passed to ease
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