Package.describe({
  summary: 'Server monitoring system',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint'],['server']);

  api.add_files(['server.js'], ['server']);
});
