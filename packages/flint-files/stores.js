// Note that we run a stub to setup the collection on the client, server-side we use --settings to setup connection
if (Meteor.isServer) {
	if (Meteor.settings.assets) {
		Flint.FS.registerCollection('flintAssets', 'S3', {
			accessKeyId: Meteor.settings.assets.accessKeyId,
			secretAccessKey: Meteor.settings.assets.secretAccessKey,
			bucket: Meteor.settings.assets.bucket,
			ACL: Meteor.settings.assets.ACL
		});
	}
} else {
	Flint.FS.registerCollection('flintAssets', 'S3', {});
}