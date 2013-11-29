Package.describe({
  summary: "Import fixture files to initialize the server."
});

Package.on_use(function(api) {  
  // We're going to use the addFixture file from flint-models.
  api.use(['flint','underscore'], 'server');
  api.add_files('fixtures.js', 'server');
  api.add_files(['fixtures/manifest.json'], 'server');
});
