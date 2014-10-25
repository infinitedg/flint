Package.describe({
  "summary": "3D sensor grid",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['templating', 'flint', 'brentjanderson:kinetic', 'underscore', 'jquery', 'infinitedg:gsap']);

  api.add_files(['publish.js', 'model.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css'], 'client');
  api.add_files(['card.html', 'card.js', 'events.js', 'beziers.js'], 'client');
  api.add_files(['playlists.js'],'client');
  api.add_files(['images/cornerLoc.png', 'images/trashcan.png'], 'client');
});
