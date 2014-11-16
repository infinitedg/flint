// if (Meteor.absoluteUrl() !== "http://flint-demo.spaceedventures.org/") {
// 	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
// } else {
	Flint.FS.registerCollection('flintAssets', 'S3', {
		// region: "my-s3-region", //optional in most cases
		accessKeyId: Meteor.settings.assets.accessKeyId || "", //required if environment variables are not set
		secretAccessKey: Meteor.settings.assets.secretAccessKey || "", //required if environment variables are not set
		bucket: Meteor.settings.assets.bucket, //required
		ACL: "public-read" //optional, default is 'private', but you can allow public or secure access routed through your app URL
		// The rest are generic store options supported by all storage adapters
		// transformWrite: myTransformWriteFunction, //optional
		// transformRead: myTransformReadFunction, //optional
		// maxTries: 1 //optional, default 5
	});
// }