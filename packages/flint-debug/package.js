Package.describe({
  summary: "Front-end interfaces for things not normally visible to users.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating']);
  
  api.add_files(['debugging.html', 'debugging.js'], 'client');
});
