Package.describe({
  summary: "Basic tools for managing remote clients"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['server.js'], 'server');
});