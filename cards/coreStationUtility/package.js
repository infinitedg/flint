Package.describe({
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui']);
  
  api.add_files(['core.html', 'core.js'], 'client');
});
