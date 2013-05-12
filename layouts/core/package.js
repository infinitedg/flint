Package.describe({
  summary: "Core card layout."
});

Package.on_use(function(api) { 
  api.use(['templating', 'flint-core', 'flint-ui', 'log', 'jquery-masonry']);
  
  api.add_files(['template.html', 'core.js'], 'client');
});
