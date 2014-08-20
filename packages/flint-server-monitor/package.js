Package.describe({
  summary: 'Server monitoring system',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint'],['server']);

  // api.add_files(['model.js'], ['client', 'server']);
  // api.add_files(['client.js'], ['client']);
  api.add_files(['server.js'], ['server']);

});
