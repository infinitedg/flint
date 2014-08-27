Package.describe({
  summary: "A server and client event package."
});

Package.on_use(function (api) {
	api.use(['jquery'])

  api.add_files('emitter.client.js', 'client');

  api.add_files('emitter.server.js', 'server');

  api.export('EventEmitter')
});


Package.on_test(function (api) {
  api.use(['emitter']);
  api.use('test-helpers', ['server', 'client']);
  api.use('tinytest');

  api.add_files('emitter.tests.js');
});
