Package.describe({
  summary: 'Sound playback macros',
  version: "0.1.0"
});

Package.on_use(function(api) {  
  
  api.use(['flint', 'flint-macro-engine'],['server']);

  api.add_files(['server.js'], ['server']);
});
