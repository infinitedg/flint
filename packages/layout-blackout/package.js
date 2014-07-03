Package.describe({
  summary: "Blackout the screen"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating']);
  
  api.add_files(['layout.html'], 'client');
});
