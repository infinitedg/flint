Package.describe({
  summary: 'Arbitrary macro execution engine',
  version: "0.2.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint', 'underscore', 'flint-jobs'],['server', 'client']);

  api.add_files(['server.js'], ['server']);
  api.add_files(['client.js'], ['client']);
  api.export('_flintWorkers', 'server');
});
