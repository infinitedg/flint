Package.describe({
  summary: 'Core Flint library',
  version: "0.1.0"
});

Package.on_use(function(api) {

  api.use(['iron:router', 'underscore']);
  api.use(['percolate:migrations']);
  api.use(['infinitedg:winston'], ['server']);
	api.use(['templating', 'mrt:bootstrap-growl'], ['client']);
  api.use('tracker'); // @TODO Evaluate - see if we can use Utils.memoize
  api.use('flint-utils');

  api.addFiles(['flint.js'], ['client', 'server']);
  api.addFiles(['logger.js'], ['client', 'server']);
  api.addFiles('remotes.js', ['client', 'server']);
  api.addFiles(['collection.js'], ['client', 'server']);
  api.addFiles(['server/fixture.js', 'server/reset.js', 'server/picker.js'], 'server');


  api.addFiles(['client/notifications.js',
    'client/flint.html',
    'client/picker.js',
    'client/router.js'],
  'client');

  api.addFiles(['client/client.js', 'client/components.js'], 'client');
  api.addFiles('server/heartbeat.js', 'server');

  api.addFiles('server/migrations.js', 'server');

  api.addFiles('localization.js', ['client', 'server']);
  api.addFiles('client/localization.js', ['client']);
  api.addFiles('server/localization.js', ['server']);


  api.export("Flint");
});

// Stub for testing with Velocity
Package.onTest(function(api) {
  api.use('flint');
  api.use('sanjo:jasmine@0.16.4');

  api.addFiles('tests/collection.js', ['server', 'client']);
});
