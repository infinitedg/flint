Package.describe({
  summary: "Flint station management system",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'underscore']);
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['jquery-ui-sortable.js'], 'client');
  api.add_files(['server.js'], 'server');
});
