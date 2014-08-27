Package.describe({
  name: "cfs-upload-ddp",
  summary: 'CollectionFS, DDP File Upload'
});

Package.on_use(function(api) {

  api.use([
    //CFS packages
    'cfs-base-package',
    'cfs-tempstore',
    'cfs-file',
    'cfs-ejson-file',
    //Core packages
    'deps',
    'check',
    'livedata',
    'mongo-livedata',
    'ejson',
    //Other packages
    'power-queue',
    'reactive-list'
    ]);

  api.add_files([
    'upload-ddp-client.js'
    ], 'client');

  api.add_files([
    'upload-ddp-server.js'
    ], 'server');
});

Package.on_test(function (api) {
  api.use('collectionfs');
  api.use('test-helpers', 'server');
  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
   'random', 'deps']);

  api.add_files('tests/server-tests.js', 'server');
  api.add_files('tests/client-tests.js', 'client');
});
