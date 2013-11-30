Package.describe({
  summary: 'Manages state of connected clients'
});

Package.on_use(function(api) {  
  api.use(['flint']);

  api.add_files(['client.js'], 'client');
	api.add_files(['server.js'], 'server');
});
