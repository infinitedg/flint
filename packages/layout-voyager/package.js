Package.describe({
  summary: "Voyager layout.",
  version: "0.0.1"
});

Package.on_use(function(api) { 
  api.use(['flint', 'templating', 'cmather:iron-router']);
  
    api.add_files(['model.js'], ['server', 'client']);
    api.add_files([
    'cardList.html', 'cardList.js', 
    'messageBox.html', 'messageBox.js', 'messageBox.css',
    'template.html', 'template.js', 'bootstrap.less'], 'client');
    
});
