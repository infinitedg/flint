// if (Meteor.absoluteUrl() !== "http://flint-demo.spaceedventures.org/") {
// 	// Development environment uses locally-stored assets
// 	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
// } else {
	// Production publishes to S3
	// Note that we run a stub to setup the collection on the client, server-side we use --settings to setup connection
	if (Meteor.isServer) {
		Flint.FS.registerCollection('flintAssets', 'S3', {
			accessKeyId: Meteor.settings.assets.accessKeyId,
			secretAccessKey: Meteor.settings.assets.secretAccessKey,
			bucket: Meteor.settings.assets.bucket,
			ACL: Meteor.settings.assets.ACL
		});
	} else {
		Flint.FS.registerCollection('flintAssets', 'S3', {});
	}
// }

// Flint.FS.registerCollection('flintAssets', 'GridFS', {});