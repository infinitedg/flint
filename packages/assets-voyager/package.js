Package.describe({
	summary: "Asset Collection for the Voyager",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.addAssets(['img/outline.png'], 'client');
});
