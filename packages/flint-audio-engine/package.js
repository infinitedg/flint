Package.describe({
  summary: "Granular sound direction and playback system",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['flint', 'templating']);
  
  api.add_files(['engine.js'], 'server');
  api.add_files(['component.html', 'component.js'], 'client');
});
