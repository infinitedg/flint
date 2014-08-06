Package.describe({
  "summary": "Basic Engine Control"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'bootboxjs']);
  
  api.add_files(['actor.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
});
