Package.describe({
  name: 'cfs-ui',
  summary: 'CollectionFS, provides UI helpers'
});

Package.on_use(function(api) {
  api.use(['cfs-base-package', 'ui', 'templating', 'cfs-file'], 'client');

  api.add_files([
    'ui.html',
    'ui.js'
  ], 'client');
});

Package.on_test(function (api) {
  api.use(['collectionfs', 'test-helpers', 'tinytest']);
  api.add_files('tests/client-tests.js', 'client');
});
