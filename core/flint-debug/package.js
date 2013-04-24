Package.describe({
  summary: "Front-end interfaces for things not normally visible to users."
});

Package.on_use(function(api) {  
  api.use(['log', 'templating', 'utils']);
  
  api.add_files(['debugging.html', 'debugging.js'], 'client');
});
