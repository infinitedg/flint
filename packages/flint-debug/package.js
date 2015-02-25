Package.describe({
  summary: "Front-end interfaces for things not normally visible to users.",
  version: "0.1.0",
  debugOnly: true
});

Package.on_use(function(api) {  
  api.use(['templating','msavin:mongol']);
  
  api.add_files(['debugging.html', 'debugging.js'], 'client');
});
