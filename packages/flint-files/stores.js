// Note that we run a stub to setup the collection on the client, server-side we use --settings to setup connection
if (Meteor.isServer) {
	if (Meteor.settings.assets) {
		if (Meteor.settings.public.assets.adaptor == 'S3'){
			Flint.FS.registerCollection('flintAssets', 'S3', {
				accessKeyId: Meteor.settings.assets.accessKeyId,
				secretAccessKey: Meteor.settings.assets.secretAccessKey,
				bucket: Meteor.settings.assets.bucket,
				ACL: Meteor.settings.assets.ACL
			});
		} else {
			Flint.FS.registerCollection('flintAssets', 'FileSystem', {
				path: "~/flint-assets"
			});

		}	
	}

	/**
	* HTTP Header Security
	*
	* enforce HTTP Strict Transport Security (HSTS) to prevent ManInTheMiddle-attacks
	* on supported browsers (all but IE)
	* > http://www.html5rocks.com/en/tutorials/security/transport-layer-security
	*
	* @header Strict-Transport-Security: max-age=2592000; includeSubDomains
	*/

	var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation
	// attach connect-style middleware for response header injection
	Meteor.startup(function () {
		connectHandler.use(function (req, res, next) {
			res.setHeader('access-control-allow-origin', '*');
			return next();
		});
	});
} else {
	if (Meteor.settings.public.assets.adaptor == 'S3'){
		Flint.FS.registerCollection('flintAssets', 'S3', {});
	} else {
		Flint.FS.registerCollection('flintAssets', 'FileSystem', {
			path: "~/flint-assets"
		});
	}
}