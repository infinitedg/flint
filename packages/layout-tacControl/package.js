Package.describe({
  summary: "Viewscreen layout."
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'iron-router']);
  
    api.add_files(['template.html', 'template.js'], 'client');
    
});
