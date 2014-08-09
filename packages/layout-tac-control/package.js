Package.describe({
  summary: "Viewscreen layout.",
  version: "0.0.1"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'cmather:iron-router']);
  
    api.add_files(['template.html', 'template.js'], 'client');
    
});
