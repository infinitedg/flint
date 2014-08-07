Package.describe({
  summary: "Blackout the screen",
  version: "0.0.1"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating']);
  
  api.add_files(['layout.html'], 'client');
});
