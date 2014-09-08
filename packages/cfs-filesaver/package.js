Package.describe({
  summary: 'CollectionFS, FileSaver by Eli Grey, http://eligrey.com'
});

Package.on_use(function(api) {
  
  api.add_files([
    'FileSaver.js'
  ], 'client');

});

Package.on_test(function (api) {
  api.use('cfs-filesaver');
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.add_files('tests/client-tests.js', 'server');
  api.add_files('tests/server-tests.js', 'client');
});
