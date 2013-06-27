Package.describe({
  "summary": "Communications card for connecting via particle network"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui', 'd3']);
  
  // api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'styles.css'], 'client');
  
  api.add_files([
    'public/data.json'
  ], 'client');
});
