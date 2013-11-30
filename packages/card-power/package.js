Package.describe({
  "summary": "Power balancing screen. Originally developed as a demo."
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'bootboxjs']);
  
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
});
