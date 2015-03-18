Package.describe({
  summary: 'Core Flint library',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['iron:router', 'underscore']);
  api.use(['infinitedg:winston'], ['server']);
	api.use(['templating', 'mrt:bootstrap-growl'], ['client']);
  api.use(['deps'], ['client', 'client']); // @TODO Evaluate - see if we can use Utils.memoize
  api.use('flint-utils');

  api.add_files(['flint.js'], ['client', 'server']);
  api.add_files(['logger.js'], ['client', 'server']);
  api.add_files('remotes.js', ['client', 'server']);
  api.add_files(['collection.js'], ['client', 'server']);
  api.add_files(['server/fixture.js', 'server/reset.js', 'server/picker.js'], 'server');

  
  api.add_files(['client/notifications.js', 
    'client/flint.html', 
    'client/picker.js', 
    'client/router.js'], 
  'client');
  
  api.add_files(['client/client.js', 'client/components.js'], 'client');
  api.add_files('server/heartbeat.js', 'server');

  api.add_files('localization.js', ['client', 'server']);
  api.add_files('client/localization.js', ['client']);
  api.add_files('server/localization.js', ['server']);

  
  api.export("Flint");
});
