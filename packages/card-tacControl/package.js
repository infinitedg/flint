Package.describe({
  "summary": "3D sensor grid"
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'kinetic.js', 'underscore', 'jquery']);

  api.add_files(['publish.js', 'model.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css'], 'client');
  api.add_files(['card.html', 'card.js', 'events.js', 'beziers.js'], 'client');
  api.add_files(['images/cornerLoc.png', 'images/trashcan.png'], 'client');
});
