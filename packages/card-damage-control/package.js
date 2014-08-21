Package.describe({
  "summary": "Damage controls screen with damaged systems and steps to repair",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['core.html', 'core.js', 'admin.html', 'admin.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['jquery-ui-sortable.js'], 'client');
  api.add_files('server.js','server');
});
