Package.describe({
  summary: 'Theme handling system',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint'], ['server', 'client']);

  api.add_files(['server.js'], ['server']);
  api.add_files(['client.js'], ['client']);
});
