Package.describe({
  "summary": "3D sensor grid",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'flint-drama', 'brentjanderson:kinetic', 'underscore', 'jquery']);

  api.add_files(['publish.js', 'actor.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css', 'stars.png'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
});
