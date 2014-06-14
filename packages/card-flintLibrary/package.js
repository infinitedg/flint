Package.describe({
  summary: "Flint file management system"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['server.js'], 'server');
});
