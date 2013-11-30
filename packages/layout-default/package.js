Package.describe({
  summary: "Default layout."
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'iron-router']);
  
  api.add_files([
    'cardList.html', 'cardList.js', 
    'template.html', 'template.js'], 'client');
});