Package.describe({
  summary: "Core card layout."
});

Package.on_use(function(api) { 
  api.use(['templating', 'flint-core', 'flint-ui', 'log']);
  
  api.add_files(['template.html', 'core.js'], 'client');
});
