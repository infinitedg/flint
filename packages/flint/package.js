Package.describe({
  summary: 'Core Flint library'
});

Package.on_use(function(api) {  
  
  api.use(['iron-router', 'underscore']);
  api.use(['winston', 'winston-loggly'], ['server']);
	api.use(['templating', 'winston-client', 'bootstrap-growl'], ['client']);
  api.use(['deps'], 'client');
  api.use('flint-utils');
  
  api.add_files(['flint.js', 'logger.js', 'collection.js'], ['server', 'client']);
  api.add_files(['server/fixture.js', 'server/reset.js', 'server/actor.js', 'server/picker.js'], 'server');
  
  api.add_files(['client/notifications.js', 'client/flint.html', 'client/picker.js', 'client/router.js'], 'client');
  
  api.add_files(['client/client.js'], 'client');
  api.add_files('server/heartbeat.js', 'server');
  
  api.export("Flint");
});
