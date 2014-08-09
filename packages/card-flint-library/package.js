Package.describe({
  summary: "Flint file management system",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'underscore', 'http', 'flint-files', 'ejson']);
  
  api.add_files('common.js', ['client', 'server']);
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['server.js'], 'server');
});
