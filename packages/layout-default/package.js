Package.describe({
  summary: "Default layout.",
  version: "0.0.1"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'iron-router']);
  
    api.add_files(['model.js'], ['server', 'client']);
    api.add_files(['publish.js'], 'server');
    api.add_files([
    'cardList.html', 'cardList.js', 
    'messageBox.html', 'messageBox.js', 'messageBox.css',
    'template.html', 'template.js'], 'client');
    
});
