Package.describe({
  "summary": "Standard sensor grid card for sensors stations",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'brentjanderson:kinetic', 'underscore', 'infinitedg:gsap']);
  
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
});
