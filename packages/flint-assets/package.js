Package.describe({
  summary: 'Flint asset management API',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint', 'underscore', 'deps']);
  
  api.addFiles('client.js', 'client');
  api.addFiles('server.js', 'server');
  api.addFiles('common.js', ['client', 'server']);
});
