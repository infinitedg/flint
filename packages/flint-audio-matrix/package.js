Package.describe({
  summary: "Controls for manipulating a MOTU16 A device through HTTP calls",
  version: "0.1.0"
});

Package.on_use(function(api) {
  api.use(['flint', 'http', 'less', 'templating', 'underscore', 'flint-heartbeat', 'flint-server-monitor']);

  api.add_files(['fixtures.js'], 'server');
  api.add_files(['card.html', 'card.js'], 'client');
});
