Package.describe({
  summary: "Appearance key-value store",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['flint']);
  
  api.add_files(['engine.js'], 'client');
  api.add_files(['server.js'], 'server');
  
});
