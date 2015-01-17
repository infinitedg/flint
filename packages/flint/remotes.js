var _remotes = {};

/**
 * Connect to remote meteor instances by key name
 * @method remote
 * @param {String} remoteName Name of remote server to connect with
 * @return {Object} Connection to remote meteor server of the key remoteName
 */
Flint.remote = function(remoteName) {
	remoteName = remoteName.toLowerCase();
	Flint.Log.verbose('Retrieving remote' + remoteName);
	if (!_.has(_remotes, remoteName)) {
		if (!Meteor.settings.public.flintRemotes || Meteor.settings.public.flintRemotes[remoteName]) {
			throw new Meteor.Error('flint-no-such-remote', 'The remote ' + remoteName + ' is not configured in settings.public.flintRemotes!');
		}
		_remotes[remoteName] = DDP.connect();
		Tracker.autorun(function(c) {
			if (_remotes[remoteName].status() === 'connected') {
				Flint.Log.verbose('Connected to ' + remoteName);
				c.stop();
			}
		});
	}
	return _remotes[remoteName];
};