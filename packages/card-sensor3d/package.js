Package.describe({
  "summary": "3D sensor grid"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'three.js', 'underscore', 'jquery']);
  
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css', 'starfield.png'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
});