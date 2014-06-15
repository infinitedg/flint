if (Meteor.absoluteUrl() !== "http://flint-demo.spaceedventures.org/") {
	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
} else {
	Flint.FS.registerCollection('flintAssets', 'FileSystem', { path: "~/flint-assets" });
}