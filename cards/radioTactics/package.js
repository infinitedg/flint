Package.describe({
  "summary": "Radio tactical jamming and scanning"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'styles.css'], 'client');
});