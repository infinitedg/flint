Package.describe({
  summary: "Core card layout."
});

Package.on_use(function(api) { 
  api.use(['templating', 'flint'], 'client');
  
  api.add_files(['salvattore.min.js', 'template.html', 'core.js', 'core.css'], 'client');
});
